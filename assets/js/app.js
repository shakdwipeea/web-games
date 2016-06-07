(function () {
	//Socket io connection
	var socket = io.connect();
	var game = new Phaser.Game(768, 600, Phaser.AUTO, '');

	// Add all the states in the game
	game.state.add('boot', Boot);
	game.state.add('preload', Preload);
	game.state.add('game', Game);
	//game.state.add('over', Over);

	// Start the first state
	game.state.start('boot');
})();