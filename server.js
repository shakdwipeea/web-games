var express = require('express')
var app = express();

var server = require('http').Server(app);
var io = require('socket.io')(server);

server.listen(8080);

app.use(express.static('assets'))

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function (socket) {
  
  socket.on('go-left', function () {
    socket.broadcast.emit('go-left');
  });

  socket.on('go-right', function () {
    socket.broadcast.emit('go-right');
  });

  socket.on('missile', function () {
    socket.broadcast.emit('missile');
  });

  socket.on('hit', function () {
    socket.broadcast.emit('hit');
  });

  socket.on('dead', function () {
    socket.broadcast.emit('dead');
  });
});

