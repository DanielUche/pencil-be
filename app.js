const express = require('express');
const { MongoClient } = require('mongodb');
const app = express();
const port = 3000;

const { DB_CONNECTION_STRING } = process.env;
const client = new MongoClient(DB_CONNECTION_STRING,
  {
    useUnifiedTopology: true,
    useNewUrlParser: true
  });

const databaseConnection = async () => {
  await client.connect();
  console.log("Connection Successfull");
}

databaseConnection();

app.get('/', (req, res) => res.send("OK"));

app.get('/search', async (req, res) => {
  const { query } = req;
  if (!query.hasOwnProperty('q')) {
    return res.json({
      msg: 'query params not found'
    });
  }
  const result = await client.db('pencil-db').collection('questions')
    .find({ 'ancestors': query.q }).toArray();
  return res.send(result.map((data) => data._id));
})

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`)
})