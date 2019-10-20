"use strict";
var express = require('express');
var cors = require('cors');
var bodyParser = require('body-parser');
var app = express();
var MongoClient = require('mongodb').MongoClient;
var uri = 'mongodb+srv://user:nXyW33882ppCYgWr@cluster0-9qyy7.azure.mongodb.net/test?retryWrites=true&w=majority';
var db;
app.use(cors());
app.use(bodyParser.json());
var ObjectID = require('mongodb').ObjectID;
MongoClient.connect(uri, { useNewUrlParser: true }, function (err, client) {
    if (err) {
        throw err;
    }
    db = client.db('blogposts');
});
var port = process.env.PORT || 8081;
if (app.listen(port)) {
    console.log("app up at port: " + port);
}
