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