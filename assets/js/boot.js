var Boot = function (game) {}

Boot.prototype = {
	preload: function () {
		//Load a loading png if you have it
	},
	create: function () {
		// Start the next state
		this.game.state.start('preload');
	}
}