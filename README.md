# Pencil Backend

A simple express api that exposes data stores in mongoBD.
It uses the Array of Ancestors to model model Tree Structures.
More info can be found [here](https://docs.mongodb.com/manual/tutorial/model-tree-structures-with-ancestors-array/) 

#  Usage
clone the repo

#### Usage Seed Database
 ```sh
$ cd pencil-be
$ mv /.env.template /.env
$ npm install
$ node index.js
```
Remember to replace the environment variables with your values.

#### Start web app
 ```sh
$ cd pencil-be
$ mv /.env.template /.env
$ npm install
$ npm run start
```

### Sample request

https://pencil-be.herokuapp.com/search?q=Briefly describe the non-cyclical nature of energy flow

### Response

["157", "23", "83" ]

### Sample Query

await client.db('pencil-db').collection('questions')
    .find({ 'ancestors': 'My topic' }).toArray();

This returns all documents/questions that matches "My Topic"


### Accessing Mongo Atlas
email: <####>
password: <s####>

1. Once in Click on pencil-be-cluster cluster.
2. CLick on Collections
3. You will find questions and topics collections.

