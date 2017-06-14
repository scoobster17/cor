/**
 * Server config for Cor Scoresheet app
 */

/* DEPENDENCIES */

// server dependencies
import setupServers from './servers.js';

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

/* SERVERS */

const servers = setupServers(app);

/* ************************************************************************** */

/* SOCKET.IO */

ioSetup(socketio(servers.secureServer), mongo);
