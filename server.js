const express = require('express');
const mongodb = require('mongodb');
const app = express();
const port = 3001;

const mongoClient = mongodb.MongoClient,
  URL = 'mongodb://cboard:cboard@ds159200.mlab.com:59200/cboard';

var createDocuments = function(db, callback) {
     var collection = db.collection("jduser");
     collection.insert([
    {firstname : "Rams",lastname: "Posa",emailid: "rams@journaldev.com"}, 
    {firstname : "Mani",lastname: "Nulu",emailid: "mani@journaldev.com"},  
    {firstname : "Bhargs",lastname: "Nulu",emailid: "Bhargs@journaldev.com"}, 
    ], function(err, result) {
    callback(result);
      });
}

/**
 * Example request uncomment to test. (since this part will only be available in the dev mode and not be deployed.)
 */
// app.get('/', (request, response) => {
//   response.send('Hello from express');
// })

/**
 * Starts the server at the above mentioned port.
 */
app.listen(port, (err) => {
  if (err) {
    return console.log('something bad happened', err);
  }

  console.log(`server is listening on ${port}`);
})

/**
 * Example request to demo how to connect to mongo and make api's. can be use as reference. 
 */
// app.get('/testPathMongo', (request, response) => {
//   mongoClient.connect(URL, function(err, db) {
//       createDocuments(db, function() {
//         db.close();
//       });
//       response.send('Mission successfull');
//   });

// })