/**
 * Server config for Cor Scoresheet app
 */

/* DEPENDENCIES */

// utility dependencies
import path from 'path';
const fs = require('fs');

// server dependencies
import { Server as InsecureServer } from 'http';
import { Server as SecureServer } from 'https';

// server config dependencies
import PORTS from './ports';

// server framework dependencies
import Express from 'express';
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const session = require('express-session');

// database dependencies
const mongo = require('../database/config.js');
mongo.connect();

// data dependencies
const uuid = require('uuid/v4');

// authentication dependencies
const passport = require('passport');
import authenticationSetup from '../authentication/local';

// react dependencies
import React from 'react';
import { renderToString } from 'react-dom/server';
import { match, RouterContext } from 'react-router';

// app dependencies
import routes from '../../app/js/config/routes';
import NotFoundPage from '../../app/js/components/pages/404';

// socket dependencies
const socketio = require('socket.io');
import EVENTS from '../../app/js/config/socket/event-names';

/* ************************************************************************** */

/* APP SETUP */

const app = Express();

// express setup
app.use( Express.static(__dirname + '/../../../dist/app/'));
app.use( cookieParser() );
app.use( bodyParser.urlencoded({ extended: false }) );
app.use( bodyParser.json() );
app.use( session({ secret: 'cor blimey' }) );
app.use( passport.initialize() );
app.use( passport.session() ); // needs to be after Express.session()

app.set('port_https', PORTS.SECURE);

app.all('*', (req, res, next) => {
    if (req.secure) {
        return next();
    };
    res.redirect('https://' + req.hostname + ':' + app.get('port_https') + req.url);
});

// ejs setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '../', 'views'));

/* ************************************************************************** */

/* AUTHENTICATION SETUP */

authenticationSetup(mongo);

/* ************************************************************************** */

/* APP ROUTING */

app.get(
    [
        '/login-register',
        '/log-out'
    ],
    (req, res) => {

        let title;

        // interrogate the URL to set the title, and perform other route-specific
        // actions before the React App is hit on the server side for rendering
        switch (req.url) {

            case '/login-register':
                title = 'Log in or register';
                break;

            // log the user out
            case '/log-out':
                title = 'You have been logged off, here you can log in again or register';
                req.logout();
                break;

        }

        return res.render('login-register.ejs', { title });

    }
);

app.get(
    [
        '/',
        '/scores',
        '/scores/*',
        '/add-tracker',
        '/404'
    ],
    (req, res) => {

        // for debugging purposes (temporary)
        console.log(req.url, req.isAuthenticated());

        // TODO prevent clickjacking by adding HTTP Header for X-FRAME-OPTIONS
        // res.get('X-Frame-Options') // === 'Deny'

        // interrogate all app-related requests; if not authenticated, redirect
        // to login page.
        // 404 page doesn't technically need authentication, but stops guests
        // knowing what routes do/don't exist. Except code is on GitHub! :)
        if (!req.isAuthenticated()) return res.redirect('/login-register');

        // interrogate the URL to set the title, and perform other route-specific
        // actions before the React App is hit on the server side for rendering
        let title;
        switch (true) {

            // do not use react app if needing to log in, return login/reg page instead
            case (req.url == '/'):
            case (req.url == '/scores'):
                title = 'Your Scores';
                break;

            case (/^\/scores\/[a-zA-Z0-9\-]+$/.test(req.url)):
                title = 'Score Details Page'; // TODO make dynamic and check db for match
                break;

            case (req.url == '/add-tracker'):
                title = 'Add score tracker';
                break;

            case (req.url == '/404'):
                title = 'Page not found';
                break;

            default:
                title = '';

        }

        // attempt to render react app and return to client
        match(
            { routes, location: req.url },
            (err, redirectLocation, renderProps) => {

                // show error if one present
                if (err) {
                    console.log('');
                    console.log('');
                    console.log('**500 ERROR**');
                    console.log('');
                    console.log('Request URL: ' + req.url);
                    return res.status(500).send(err.message);
                }

                // propogate redirect to browser if one present
                if (redirectLocation) {
                    return res.redirect(302, redirectLocation.pathname + redirectLocation.search);
                }

                // generate markup for the current route
                let markup;
                if (renderProps) {
                    markup = renderToString(<RouterContext {...renderProps} />);
                } else {
                    markup = renderToString(<NotFoundPage />);
                    res.status(404);
                }

                // render the index template with the embedded React markup
                return res.render('index.ejs', { markup, title });

            }
        );
    }
);

// catch all for all GET routes not already explicitly covered
app.get('*', (req, res) => {

    if (!req.isAuthenticated()) return res.redirect('/login-register');
    res.redirect('/scores');

});

app.post('/data/users/log-in', (req, res, next) => {

    req.login(
        {
            username: req.body.username,
            password: req.body.password
        },
        (err) => {
            if (err) return next(err);
            return res.redirect('/scores');
        }
    );

});

app.post('/data/users/add', (req, res, next) => {

    // get the users from the database and
    const userData = req.body;

    // check if the user exists, and return if so
    mongo.users().find({ "username": req.body.username }).toArray((err, doc) => {

        if (err) res.redirect('/login-register?error=500')

        if (doc.length) {

           res.redirect('/login-register?error=duplicate')

        } else {

            // assign a random id to user and store to database
            userData.id = uuid();

            mongo.users().save(userData, (err, saved) => {

                if (err || !saved) res.redirect('/login-register?error=not%20saved');

                passport.authenticate(
                    'local',
                    {
                        successRedirect: '/scores',
                        failureRedirect: '/login-register'
                    }
                )(req, res, next);

            });
        }

    });

});

app.post('/data/scores/add', (req, res) => {

    // get the scores from the database
    const scores = mongo.scores();
    const scoreData = req.body;

    // check if the user exists, and return if so
    scores.find({ "name": req.body.name }).toArray((err, doc) => {

        // TODO needs to re-direct
        if (err) res.status(500); // 500?

        if (doc.length) {

            // TODO needs to re-direct
            res.status(403).send({
                "message": "Score tracker name address already in use for this user"  // needs to be email or password is incorrect for security
            });

        } else {

            // assign a random id to tracker and store to database
            const trackerId = uuid();
            scoreData.id = trackerId;
            scores.save(scoreData, (err, saved) => {

                // TODO needs to re-direct
                if (err || !saved) res.status(500).send({
                    "error": "Tracker not set up, please contact an administrator"
                });

                // get the chats collection in the DB and define a chat template
                const chats = mongo.chats();
                const chatTemplate = {
                    id: trackerId,
                    messages: [
                        {
                            text: 'Hi there! Your chat is all set up. Send your own message to contribute below :)'
                        }
                    ]
                }

                // TODO needs to re-direct
                // create a chat for this event with the same ID as the tracker
                chats.save(chatTemplate, (err, saved) => {
                    if (err || !saved) res.status(500).send({
                        "error": "Chat not set up, please contact an administrator"
                    });
                    res.status(200);
                });

            });

        }

    });

});

app.post('/data/scores/get', (req, res) => {

    // get the scores from the database
    const scores = mongo.scores();
    const scoreData = req.body;

    if (scoreData.urlText) {
        scores.find({
            "creator": scoreData.id,
            "urlText": scoreData.urlText
        }).toArray((err, doc) => {
            if (err) res.status(500); // 500?
            if (doc.length) {
                res.status(200).send(doc[0]);
            }
        });
    } else {
        scores.find({
            "creator": scoreData.id
        }).toArray((err, doc) => {
            if (err) res.status(500); // 500?
            if (doc.length) {
                res.status(200).send(doc);
            }
        });
    }
});

app.post('/data/chat/get', (req, res) => {

    mongo.chats().find({
        "id": req.body.chatId
    }).toArray((err, doc) => {
        if (err) res.status(500); // 500?
        if (doc.length) {
            let messagesToReturn = doc[0].messages;
            if (messagesToReturn.length > 10) {
                messagesToReturn = messagesToReturn.slice(doc.length - 11); // zero-indexed
            }
            res.status(200).send(messagesToReturn);
        }
    });

});

/* ************************************************************************** */

/* SERVER */

// HTTP server
const insecureServer = InsecureServer(app).listen(PORTS.INSECURE, () => {

    const host = insecureServer.address().address || 'localhost';
    const port = insecureServer.address().port || PORTS.INSECURE;

    console.log('Cor scorekeeper app (insecure - HTTP) listening @ http://%s:%s for re-direct to HTTPS', host, port);
});

// HTTPS server
const sslOptions = {
    key: fs.readFileSync(__dirname + '/../ssl/private.key'),
    cert: fs.readFileSync(__dirname + '/../ssl/certificate.pem')
};
const secureServer = SecureServer(sslOptions, app);

secureServer.listen(PORTS.SECURE, () => {

    const host = secureServer.address().address || 'localhost';
    const port = secureServer.address().port || PORTS.SECURE;

    console.log('Cor scorekeeper app (secure - HTTPS) listening @ https://%s:%s', host, port);

});

/* ************************************************************************** */

/* SOCKET.IO */

// socket.io setup
const io = socketio(secureServer);

// socket.io event bindings
io.on('connection', (socket) => {

    // demonstrate to the user that there is a successful connection
	socket.emit(EVENTS.CONNECTION.TEST, { message: 'You have received this from the server, your connection is running' });

    // bind server functionality to socket events
    socket.on(EVENTS.CHAT.SEND, storeChatMessage);
	socket.on(EVENTS.CHAT.FETCH, getChatMessages);

});

// socket.io callbacks
const storeChatMessage = (data) => {

    const chats = mongo.chats();

    // update the chat with a new message
    chats.update({ id: data.chatId }, { $push: { messages: data.messageData } }, (err, saved) => {

        if (err || !saved) io.emit(EVENTS.ERROR.CHAT.SEND, {
            message: "Message not saved to database"
        });

        io.emit(EVENTS.SUCCESS.CHAT.SEND, {
            message: "Message saved to database",
            messageData: data.messageData
        });

    });
};

const getChatMessages = (data) => {

    mongo.chats().find({ "id": data.chatId }).toArray((err, doc) => {

        if (err) io.emit(EVENTS.ERROR.CHAT.FETCH, {
            message: "Messages not fetched from database"
        });

        io.emit(EVENTS.SUCCESS.CHAT.FETCH, {
            message: "Messages found in database",
            chat: doc[0]
        });

    });
};