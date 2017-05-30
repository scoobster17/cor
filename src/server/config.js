/**
 * Server config for Cor Scoresheet app
 */

/* DEPENDENCIES */

const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');

/* ************************************************************************** */

/* APP SETUP */

const app = express();

// express setup
app.use( express.static(__dirname + '/../../dist/app/'));

app.get('/', function(req, res) {
	res.sendFile( path.resolve('src/app/index.html') );
});

// http server setup
const server = http.Server(app);

// socket.io setup
const io = socketio(server);

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