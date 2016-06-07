var Over = function (game) {};

Over.prototype.init = function(score, socket) {
	this.score = score;
	this.socket = socket;
};

Over.prototype.create = function() {
	this.socket.emit('submit', {
		value: this.score,
		name: document.getElementById('name').value || 'Default'
	});
};