var Boot = function (game) {}

Boot.prototype = {
	init: function (socket) {
		this.socket = socket;
	},
	preload: function () {
		//Load a loading png if you have it
	},
	create: function () {
		// Start the next state
		this.game.state.start('preload', true, false, this.socket);
	}
}