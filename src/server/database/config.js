"use strict";

var mongodb = require('mongodb');
var client = mongodb.MongoClient;
var _db; // underscore might be ES2015 for exclusive to this module

module.exports = {
    connect() {
        client.connect('mongodb://localhost:27017/cor', function(err, db) {
            if (err) {
                console.log("Error connecting to Mongo - check mongod connection");
                process.exit(1); // stops node
            }
            _db = db;
            console.log("Connected to Mongo");
        });
    },
    users() {
        return _db.collection('users');
    },
    chats() {
        return _db.collection('chats');
    },
    scores() {
        return _db.collection('scores');
    }
};