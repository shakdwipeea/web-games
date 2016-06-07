var Preload = function (game) {}

Preload.prototype.preload = function() {
	// load all sprite images
	this.game.load.image('aero', 'aeroplane.png');	
    this.game.load.image('missile', 'missile.png');
    this.game.load.image('redm', 'red_missile.png');

    // load crash music
    this.game.load.audio('exp', 'exp.mp3');
};

Preload.prototype.create = function() {
	// start the next state
	this.game.state.start('game');
};