/**
 * Server config for Cor Scoresheet app
 */

/* DEPENDENCIES */

// server dependencies
import path from 'path';
import { Server } from 'http';
import Express from 'express';
const socketio = require('socket.io');

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
	socket.emit('news', { hello: 'world' });
	socket.on('my other event', (data) => console.log(data));
});