const MongoClient = require('mongodb').MongoClient
const mongoose = require('mongoose');
require('dotenv').config();

const username = process.env.MONGO_USERNAME;
const password = process.env.MONGO_PASSWORD;

const uri = `mongodb+srv://${username}:${password}@cluster1.hmyq7ox.mongodb.net`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

client.connect(err => {
  if (err) {
    console.log('Error connecting to database:', err);
  } else {
    console.log('Successfully connected to database!');
    const collection = client.db("test").collection("favorites");
    collection.findOne({}, (err, result) => {
      if (err) {
        console.log('Error querying database:', err);
      } else {
        console.log('Result:', result);
        client.close();
      }
    });
  }
});

mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true});
const db = mongoose.connection;
db.on('error', (error) => console.error(error));
db.once('open', () => console.log('Connected to Database'));