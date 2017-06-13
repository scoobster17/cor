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

// routing dependencies
import setupAppRouting from './routing';

// socket dependencies
const socketio = require('socket.io');
import EVENTS from '../../app/js/config/socket/event-names';
import ioSetup from '../sockets/event-bindings';

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

setupAppRouting(app, mongo, passport);

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

ioSetup(socketio(secureServer), mongo);
