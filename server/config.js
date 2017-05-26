/**
 * Server config for Cor Scoresheet app
 */

/* DEPENDENCIES */

var express = require('express');

/* ************************************************************************** */

/* APP SETUP */

var app = express();

app.use( express.static(__dirname + "/../app") );

app.get('/', function(req, res) {

});

/* ************************************************************************** */

/* SERVER */

var server = app.listen(6077, function() {

    var host = server.address().address;
    var port = server.address().port;

    console.log("Cor scorekeeper app listening @ http://%s:%s", host, port);

});