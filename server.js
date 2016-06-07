var express = require('express')
var app = express();

var server = require('http').Server(app);
var io = require('socket.io')(server);

var fs = require('fs');
var total = fs.readFileSync('total');

server.listen(8080);

var scores = JSON.parse(fs.readFileSync('scores.json'));

app.use(express.static('assets'))

app.get('/', function (req, res) {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function (socket) {

  function sendTop() {
    var topScores = getTopScores();
    socket.emit('top', topScores);
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
