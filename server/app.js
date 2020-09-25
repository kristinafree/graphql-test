const express = require('express')
const { graphqlHTTP } = require('express-graphql')
const schema = require('../schema/schema')
const mongoose = require('mongoose')

const app = express()
const port = 3005

// mongoose.connect('mongodb+srv://krisisei222:123456@graph.io963.gcp.mongodb.net/Graph?retryWrites=true&w=majority', {useNewUrlParser: true})

app.use('/graphql', graphqlHTTP({
    schema,
    graphiql: true
}) )

const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://krisisei222:kris123@graph.io963.gcp.mongodb.net/Graph?retryWrites=true&w=majority";
const client = new MongoClient(uri, {useUnifiedTopology: true} );
client.connect(err => {
  const collection = client.db("Graph").collection("directors", "movies");
  // perform actions on the collection object
  client.close();
});

// const dbConnection = mongoose.connection
// dbConnection.on('error', err => console.log(`Connection error: ${err} `))
// dbConnection.once('open', () => console.log('Connected to DB!'))

app.listen(port, err => {
    err ? console.log(error) : console.log('Server started')
})
