var Game = function (game) {};

Game.prototype.init = function(socket) {
	
	// Missile goes up hence -ve
	this.missileSpeed = -120;

	// Initial player health
	this.health = 100;

	// is Game finished
	this.gameOver = false;

	// Player score
	this.score = 0;

	// Timer for increasing missiles
	this.counter = 1000;

	this.socket = socket;
};

Game.prototype.create = function() {

    //initially paused attribute is false
    this.game.paused = false;

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
    //this.missiles.enableBody = true;

    this.scoreText = this.game.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000' });

    //  We need to enable physics on the player
    this.game.physics.arcade.enable(this.player);

    //  Player physics properties.
    this.player.body.collideWorldBounds = true;

    //Set up missileSpeed
    this.missileTimer = this.game.time.events.loop(this.counter, this.updateMissiles, this);

    this.cursors = this.game.input.keyboard.createCursorKeys();

    //
    var spacebarKey = this.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    spacebarKey.onDown.add(this.managePause, this);
    
};

Game.prototype.managePause = function() {
    this.game.paused = (!this.game.paused) ? true : false;
};

Game.prototype.update = function() {
	//Reset velocity
    console.log("Hi")
	this.player.body.velocity.x = 0;

	if (this.cursors.left.isDown) {
		this.moveLeft();
	} else if (this.cursors.right.isDown) {
		this.moveRight();
	}

	this.game.physics.arcade.collide(this.player, this.missiles, null, this.collisonHandler.bind(this));
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

Game.prototype.collisonHandler = function(player, missile) {
	this.music.play();
	missile.kill();

	if (this.health <= 0) {
		player.kill();
		this.gameOver = true;
		this.game.state.start('over', false, false, this.score, this.socket);
	} else {
		this.health -= 20;
		this.mBar.width = this.health / 100;
	}

	//We dont want actual collisons
	return false;
};

Game.prototype.updateMissiles = function() {	
	this.createMissile();

	if (this.score > 0 && this.score % 20 === 0) {
		var n = this.counter - 200;

		// We dont want the intervals to go below 300ms
		this.counter = n > 300 ? n : 300;

		// update the timer 
		this.missileTimer.delay = this.counter;
	}

	if (this.score > 100) {
		// Next level. Launch Red Missile
		this.game.stage.backgroundColor = "#ffb3b3";
        this.createRedMissile();
	}
};

Game.prototype.createMissile = function() {
	var x = Math.random() * this.game.world.width;

    // Create a missile
    var missile = this.missiles.create(x, this.game.world.height , 'missile');
    this.game.physics.arcade.enable(missile);
    missile.body.velocity.y = this.missileSpeed;
    missile.checkWorldBounds = true;
    missile.outOfBoundsKill = true;

    var self = this;
    //Check when missile is passed successfully
    missile.events.onOutOfBounds.add(function () {
        self.score = self.gameOver ? self.score : self.score + 1;
        self.scoreText.text = "Score: " + self.score;
    });

    // slowly increase missile speed
   	this.missileSpeed -= 1;
};

Game.prototype.createRedMissile = function() {
	 var x = Math.random() * this.game.world.width;

    // Create a missile
    var missile = this.missiles.create(x, this.game.world.height , 'redm');
    this.game.physics.arcade.enable(missile);
    missile.body.velocity.y = this.missileSpeed * 1.2;
    missile.checkWorldBounds = true;
    missile.outOfBoundsKill = true;

    var self = this;
    //Check when missile is passed successfully
    missile.events.onOutOfBounds.add(function () {
    	// 2 points for Red Missile
        self.score = self.gameOver ? self.score : self.score + 2;
        self.scoreText.text = "Score: " + self.score;
    });
};
