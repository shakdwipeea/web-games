var Game = function (game) {};

Game.prototype.init = function() {
	
	// Missile goes up hence -ve
	this.missileSpeed = -120;

	// Initial player health
	this.health = 100;

	// is Game finished
	this.gameOver = false;

	// Player score
	this.score = 0;
};

Game.prototype.create = function() {
	this.cursors = this.game.input.keyboard.createCursorKeys();

    this.game.stage.backgroundColor = "#fff";

    //  We're going to be using physics, so enable the Arcade Physics system
    this.game.physics.startSystem(Phaser.Physics.ARCADE);

    //Add explosion sound to game
    this.music = this.game.add.audio('exp');

	// The player and its settings
    this.player = this.game.add.sprite(70, this.game.world.height / 2 - 150, 'aero');

    // my health bar
    this.mBar = this.game.add.graphics(0, this.game.world.height);
    this.mBar.lineStyle(7, 0x0000ff, 1);
    this.mBar.lineTo(this.game.width, 0);

    //Create missile phaser group
    this.missiles = this.game.add.group();

    this.scoreText = this.game.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000' });

    //  We need to enable physics on the player
    this.game.physics.arcade.enable(this.player);

    //  Player physics properties.
    this.player.body.collideWorldBounds = true;

};

Game.prototype.update = function() {
	//Reset velocity
	this.player.body.velocity.x = 0;

	if (this.cursors.left.isDown) {
		this.moveLeft();
	} else if (this.cursors.right.isDown) {
		this.moveRight();
	}
};

Game.prototype.moveLeft = function() {
	//  Move to the left
    this.player.body.velocity.x = -100;
    this.player.x -= 5;
};

Game.prototype.moveRight = function() {
	//  Move to the right
    this.player.body.velocity.x = 100;
    this.player.x += 5;
};