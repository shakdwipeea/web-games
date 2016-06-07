//Socket io connection
var socket = io.connect();

var game = new Phaser.Game(768, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update });

var cursors,
    player;

// Missile Phaser Groups
var missiles;

//Initial normal missile velocity
var umis = -120;

var maxHealth = 100;

var gameOver = false;

//Scores
var playerHealth = maxHealth;
var score = 0;

var scoreText;

//Health bar
var mBar;

var expSound;


function preload() {
	game.load.image('aero', 'aeroplane.png');	
    game.load.image('missile', 'missile.png');
    game.load.image('redm', 'red_missile.png');

    game.load.audio('exp', 'exp.mp3');
}

function create() {
    cursors = game.input.keyboard.createCursorKeys();

    game.stage.backgroundColor = "#fff";

    //  We're going to be using physics, so enable the Arcade Physics system
    game.physics.startSystem(Phaser.Physics.ARCADE);

    //Add explosion sound to game
    music = game.add.audio('exp');

	// The player and its settings
    player = game.add.sprite(70, game.world.height / 2 - 150, 'aero');

    // my health bar
    mBar = game.add.graphics(0, game.world.height);
    mBar.lineStyle(7, 0x0000ff, 1);
    mBar.lineTo(game.width, 0);

    //Create missile phaser group
    missiles = game.add.group();

    scoreText = game.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000' });

    //  We need to enable physics on the player
    game.physics.arcade.enable(player);

    //  Player physics properties.
    player.body.collideWorldBounds = true;
}

function update() {
     //  Reset the players velocity (movement)
    player.body.velocity.x = 0;

    if (cursors.left.isDown)
    {
        //  Move to the left
        player.body.velocity.x = -100;
        player.x -= 5;
    }
    else if (cursors.right.isDown)
    {
        //  Move to the right
        player.body.velocity.x = 100;
        player.x += 5;
    }
    else
    {
        //  Stand still
        player.animations.stop();

        player.frame = 4;
    }

    // When enemy missile hits me
    game.physics.arcade.collide(player, missiles, null, (p, m) => {
        music.play();
        m.kill();

        if (playerHealth <= 0) {
            p.kill();
            gameOver = true;
            saveScore();
        } else {
            playerHealth -= 20;

            var pHealth = playerHealth / maxHealth;
            mBar.width = pHealth;
        }
        return false;
    });    

}

function saveScore() {
    socket.emit('submit', {
        value: score,
        name: document.getElementById('name').value
    });
}

function createMissile() {
    var x = Math.random() * game.world.width;

    // Create a missile
    var missile = missiles.create(x, game.world.height , 'missile');
    game.physics.arcade.enable(missile);
    missile.body.velocity.y = umis;
    missile.checkWorldBounds = true;
    missile.outOfBoundsKill = true;

    //Check when missile is passed successfully
    missile.events.onOutOfBounds.add(function () {
        score = gameOver ? score : score + 1;
        scoreText.text = "Score: " + score;
    });

   // umis -= 5;
}


function createRedMissile() {
    var x = Math.random() * game.world.width;

    // Create a missile
    var missile = missiles.create(x, game.world.height , 'redm');
    game.physics.arcade.enable(missile);
    missile.body.velocity.y = umis * 1.2;
    missile.checkWorldBounds = true;
    missile.outOfBoundsKill = true;

    //Check when missile is passed successfully
    missile.events.onOutOfBounds.add(function () {
        score = gameOver ? score : score + 2;
        scoreText.text = "Score: " + score;
    });
}

var counter = 1000;
var mHandler = function () {
    createMissile();
    


    if (score != 0 && score % 20 === 0) {
        var n = counter - 200;
        counter = n > 300 ? n : 300;
        clearInterval(missileInt);
        missileInt = setInterval(mHandler, counter);
    }

    if (score > 100) {
        game.stage.backgroundColor = "#ffb3b3";
        createRedMissile();
    }

}
var missileInt = setInterval(mHandler, counter);

socket.on('top', function (scores) {
    displayScore(scores); 
});

function displayScore(scores) {
    var high = document.getElementById('high');
    var table = document.createElement('table');

    for (var i = 0; i < scores.length; i++) {
        var row = table.insertRow(i);

        var cell1 = row.insertCell(0);
        cell1.innerHTML = scores[i].name;

        var cell2 = row.insertCell(1);
        cell2.innerHTML = scores[i].value;
    }

    high.innerHTML = "";
    high.appendChild(table);
}
