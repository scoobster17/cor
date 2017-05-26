/**
 * Server config for Cor Scoresheet app
 */

/* DEPENDENCIES */

var http = require('http');
var express = require('express');
var socketio = require('socket.io');

/* ************************************************************************** */

/* APP SETUP */

var app = express();

// express setup
app.use( express.static(__dirname + "/../app") );

/*app.get('/', function(req, res) {

});*/

// http server setup
var server = http.Server(app);

// socket.io setup
var io = socketio(server);

/* ************************************************************************** */

/* SERVER */

server.listen(6077, function() {

    var host = server.address().address;
    var port = server.address().port;

    console.log("Cor scorekeeper app listening @ http://%s:%s", host, port);

});

/* ************************************************************************** */

/* SOCKET.IO EVENTS */

io.on('connection', function(socket) {
	socket.emit('news', { hello: 'world' });
	socket.on('my other event', function(data) {console.log(data)});
});