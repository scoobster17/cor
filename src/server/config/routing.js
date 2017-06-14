// data dependencies
const uuid = require('uuid/v4');

// react dependencies
import React from 'react';
import { renderToString } from 'react-dom/server';
import { match, RouterContext } from 'react-router';

// app dependencies
import routes from '../../app/js/config/routes';
import NotFoundPage from '../../app/js/components/pages/404';
import COOKIES from '../../app/js/config/cookies/names';

const setUserCookie = (req, res) => {
    res.cookie(COOKIES.USER, JSON.stringify({
        email: req.body.username
    }));
};

const setupAppRouting = (app, db, authenticator) => {

    /* ALL REQUESTS */

    // re-direct requests from HTTP to HTTPS protocol
    app.all('*', (req, res, next) => {
        if (req.secure) {
            return next();
        };
        res.redirect('https://' + req.hostname + ':' + app.get('port_https') + req.url);
    });

    /* GET REQUESTS */

    app.get(
        [
            '/login-register',
            '/log-out'
        ],
        (req, res) => {

            let title;

            // clear any existing cookie data there is for the user
            res.clearCookie(COOKIES.USER);

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

    /* POST REQUESTS */

    app.post('/data/users/log-in', (req, res, next) => {

        req.login(
            {
                username: req.body.username,
                password: req.body.password
            },
            (err) => {
                if (err) return next(err);
                setUserCookie(req, res);
                return res.redirect('/scores');
            }
        );

    });

    app.post('/data/users/add', (req, res, next) => {

        // get the users from the database and
        const userData = req.body;

        // check if the user exists, and return if so
        db.users().find({ "username": req.body.username }).toArray((err, doc) => {

            if (err) res.redirect('/login-register?error=500')

            if (doc.length) {

               res.redirect('/login-register?error=duplicate')

            } else {

                // assign a random id to user and store to database
                userData.id = uuid();

                db.users().save(userData, (err, saved) => {

                    if (err || !saved) res.redirect('/login-register?error=not%20saved');

                    authenticator.authenticate(
                        'local',
                        (err, user, info) => {
                            if (err) return next(err);
                            if (!user) return res.redirect('/login-register');
                            req.login(user, (err) => {
                                if (err) return next(err);
                                setUserCookie(req, res);
                                return res.redirect('/scores');
                            });
                        }
                    )(req, res, next);

                });
            }

        });

    });

    app.post('/data/scores/add', (req, res) => {

        const scoreData = req.body;

        // check if the user exists, and return if so
        db.scores().find({ "name": req.body.name }).toArray((err, doc) => {

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
                db.scores().save(scoreData, (err, saved) => {

                    // TODO needs to re-direct
                    if (err || !saved) res.status(500).send({
                        "error": "Tracker not set up, please contact an administrator"
                    });

                    // define a chat template
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
                    db.chats().save(chatTemplate, (err, saved) => {
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

        const scoreData = req.body;

        if (scoreData.urlText) {
            db.scores().find({
                "creator": scoreData.id,
                "urlText": scoreData.urlText
            }).toArray((err, doc) => {
                if (err) res.status(500); // 500?
                if (doc.length) {
                    res.status(200).send(doc[0]);
                }
            });
        } else {
            db.scores().find({
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

        db.chats().find({
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
}

export default setupAppRouting;