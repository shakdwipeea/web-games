var express = require('express')
var app = express();

var server = require('http').Server(app);
var io = require('socket.io')(server);

var fs = require('fs');
var total = fs.readFileSync('total');

// set the port of our application
// process.env.PORT lets the port be set by Heroku
var port = process.env.PORT || 8080;

server.listen(port);

var scores = JSON.parse(fs.readFileSync('scores.json'));

app.use(express.static('assets'))

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function (socket) {

  function sendTop() {
    var topScores = getTopScores();
    socket.broadcast.emit('top', topScores);
  }
  
  socket.on('submit', function (score) {
    total++;
    scores.push(score);
    sendTop();
    saveScore();
  });

  sendTop();
  
});

function getTopScores() {
  scores.sort((a, b) => b.value - a.value);
  return scores.slice(0, 10);
}

function saveScore() {
  fs.writeFileSync('scores.json', JSON.stringify(scores));
  fs.writeFileSync('total', total);
}
