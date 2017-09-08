const express = require('express');
const path = require('path');
const bodyParser = require("body-parser");
const cors = require('cors')

const app = express();
const port = process.env.PORT || 8080;

var http = require('http').Server(app);
var io = require('socket.io')(http);

app.set('port', port);
app.use(cors());
app.use(express.static(path.join(__dirname, './dist')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.post('/volvpost', (req, res) => {
  io.emit('update', JSON.stringify(req.body));
  res.send("Cheers");
});

app.get('*', (req, res) => {
  res.sendFile(__dirname + '/dist/app.html');
});

io.on('connection', function(socket){
  //console.log('a user connected');
});

app.listen(port, () => console.log('Express Listening on port ', port));
http.listen(3000, () => console.log('Socket.io listening on port 3000'));




