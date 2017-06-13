/**
 * Server config for Cor Scoresheet app
 */

/* DEPENDENCIES */

// utility dependencies
const fs = require('fs');

// server dependencies
import { Server as InsecureServer } from 'http';
import { Server as SecureServer } from 'https';

// server config dependencies
import PORTS from './ports';

// server framework dependencies
import Express from 'express';
import setupFramework from '../framework/config.js';

// database dependencies
const mongo = require('../database/config.js');
mongo.connect();

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

setupFramework(app, passport);

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
