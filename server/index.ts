const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
const MongoClient = require('mongodb').MongoClient;
const uri = 'mongodb+srv://user:nXyW33882ppCYgWr@cluster0-9qyy7.azure.mongodb.net/test?retryWrites=true&w=majority';
let db: any;
app.use(cors());
app.use(bodyParser.json());
const ObjectID = require('mongodb').ObjectID;

MongoClient.connect(uri, {useNewUrlParser: true}, (err: any, client: any) => {
  if (err) {
    throw err;
  }
  db = client.db('blogposts');
});

let port = process.env.PORT || 8081;
if (app.listen(port)) {
  console.log("app up at port: " + port)
}
