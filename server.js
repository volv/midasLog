// express setup
const path = require('path'); 
const express = require('express');
const bodyParser = require("body-parser");
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.static(path.join(__dirname, './dist'))); // Check /dist for names files
app.use(bodyParser.urlencoded({ extended: true })); // Take json and such
app.use(bodyParser.json()); // and such

// socket.io setup
const http = require('http').Server(app); 
const io = require('socket.io')(http);

// mongoDB setup
const MongoClient = require('mongodb').MongoClient;
const mongoURL = "mongodb://localhost:27017/midas";

const assert = require('assert');

app.listen(8080, () => console.log('Express Listening on port 8080'));
http.listen(3000, () => console.log('Socket.io listening on port 3000'));

MongoClient.connect(mongoURL, function(err, db) {
  assert.equal(null, err);
  app.db = db;
  console.log("Connected to MongoDB on", mongoURL);
});

// Things to /volvpost trigger io update
app.post('/volvpost', (req, res) => { 
  io.emit('update', JSON.stringify(req.body));
  res.send("Cheers");
});

// Anything that doesn't exist in /dist goes to app.html
app.get('*', (req, res) => { 
  res.sendFile(__dirname + '/dist/app.html');
});

// Initial data of all saved messages sent to client. Couldn't make .find().map() work
io.on('connection', function(socket){ 
  let initialData = [];
  app.db.collection("messages").find({}, function(err, result) {
    result.forEach(function(doc) {
      initialData.push(doc);
    }, (data)=> io.emit("startup", initialData))
  })

  socket.on("updateDB", updateDB);
});

function updateDB(data) {
  data.forEach((each, i) => {
    let {timeStamp, userName, message} = each;
    app.db.collection('messages').update( 
      {
        "timeStamp": timeStamp,
        "userName": userName,
        "message": message
      },{
        "timeStamp": timeStamp,
        "userName": userName,
        "message": message
      },{
        upsert: true
      }, function(err, result) {
      //assert.equal(err, null);
      console.log(`${i} - Modified: ${result.nModified}, Upserted: ${result.nUpserted}, ${result}`);
    });
  })
  console.log("Waiting");
};




// var insertDocument = function(db, callback) {
//   midasMessages.forEach(each => {
//     let {timeStamp, userName, message} = each;
//     db.collection('messages').update( 
//       {
//         "timeStamp": timeStamp,
//         "userName": userName,
//         "message": message
//       },{
//         "timeStamp": timeStamp,
//         "userName": userName,
//         "message": message
//       },{
//         upsert: true
//       }, function(err, result) {
//       assert.equal(err, null);
//       console.log(result.result);
//       //callback(); // Closing DB in main code
//     });
//   })
// };