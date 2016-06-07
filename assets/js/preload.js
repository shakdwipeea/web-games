var Preload = function (game) {}

Preload.prototype.init = function(socket) {
	this.socket = socket;
};

Preload.prototype.preload = function() {
	// load all sprite images
	this.game.load.image('aero', 'aeroplane.png');	
    this.game.load.image('missile', 'missile.png');
    this.game.load.image('redm', 'red_missile.png');

    // load crash music
    this.game.load.audio('exp', 'exp.mp3');
};

Preload.prototype.create = function() {
	document.getElementById('start').addEventListener('click', this.handleStartGame.bind(this));

	var name = this.getName();
	if (name) {
			this.saveName(name);
			this.startGame();
	}
	
};

Preload.prototype.handleStartGame = function() {
	var name = this.getName();

	if (name === "") {
		alert('Enter Name before starting game');
	} else {
		this.saveName(name);
		this.startGame();
	}
};

Preload.prototype.saveName = function(name) {
	localStorage.setItem('name', name);
	Template.displayName(name);
};

Preload.prototype.getName = function() {
	return document.getElementById('name').value || localStorage.getItem('name');
};

Preload.prototype.startGame = function() {
	// start the next state
	this.game.state.start('game', true, false, this.socket);
};