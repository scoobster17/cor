/**
 * Server config for Cor Scoresheet app
 */

/* DEPENDENCIES */

// server dependencies
import path from 'path';
import { Server } from 'http';
import Express from 'express';
const bodyParser = require('body-parser');

// socket dependencies
const socketio = require('socket.io');
import EVENTS from '../app/js/config/socket/event-names';

// database dependencies
const mongo = require('./database/config.js');
mongo.connect();

// data dependencies
const uuid = require('uuid/v4');

// react dependencies
import React from 'react';
import { renderToString } from 'react-dom/server';
import { match, RouterContext } from 'react-router';

// app dependencies
import routes from '../app/js/config/routes';
import NotFoundPage from '../app/js/components/pages/404';

/* ************************************************************************** */

/* APP SETUP */

const app = Express();

// express setup
app.use( Express.static(__dirname + '/../../dist/app/'));
app.use( bodyParser.urlencoded({ extended: false }) );
app.use( bodyParser.json() );

// http server setup
const server = Server(app);

// socket.io setup
const io = socketio(server);

// ejs setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// routes
app.get('*', (req, res) => {

    // prevent clickjacking by adding HTTP Header for X-FRAME-OPTIONS
    // res.get('X-Frame-Options') // === 'Deny'

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
            return res.render('index', { markup });

        }
    );
});

app.post('/data/users/add', (req, res) => {

    // get the users from the database and
    const users = mongo.users();
    const userData = req.body;

    // check if the user exists, and return if so
    users.find({ "email": req.body.email }).toArray((err, doc) => {

        if (err) res.status(500); // 500?

        if (doc.length) {

            res.status(403).send({
                "message": "Email address already in use"  // needs to be email or password is incorrect for security
            });

        } else {

            // assign a random id to user and store to database
            userData.id = uuid();
            users.save(userData, (err, saved) => {

                if (err || !saved) res.status(500);

                res.status(200);

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

        if (err) res.status(500); // 500?

        if (doc.length) {

            res.status(403).send({
                "message": "Score tracker name address already in use for this user"  // needs to be email or password is incorrect for security
            });

        } else {

            // assign a random id to tracker and store to database
            scoreData.id = uuid();
            scores.save(scoreData, (err, saved) => {

                if (err || !saved) res.status(500);

                res.status(200);

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

/* ************************************************************************** */

/* SERVER */

server.listen(6077, () => {

    const host = server.address().address;
    const port = server.address().port;

    console.log('Cor scorekeeper app listening @ http://%s:%s', host, port);

});

/* ************************************************************************** */

/* SOCKET.IO EVENTS */

io.on('connection', (socket) => {
    console.log('a user connected');
	socket.emit(EVENTS.CONNECTION.TEST, { message: 'You have received this from the server, your connection is running' });
	socket.on(EVENTS.CHAT.SEND, (data) => console.log(data));
});