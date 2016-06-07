//Socket io connection
var socket = io.connect();

var game = new Phaser.Game(768, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update }, true);

var cursors,
    player,
    player2;

// Missile Phaser Groups
var missiles,
    enemyMissiles;

//Scores
var maxHealth = 100;

var playerHealth = maxHealth,
    player2Health = maxHealth;

//Health bars
var eBar,
    mbar;

function preload() {
	game.load.image('harry', 'harry.png');	
    game.load.image('missile', 'missile.png');
}

function create() {
    cursors = game.input.keyboard.createCursorKeys();

    //  We're going to be using physics, so enable the Arcade Physics system
    game.physics.startSystem(Phaser.Physics.ARCADE);

	// The player and its settings
    player = game.add.sprite(32, game.world.height - 150, 'harry');
    player2 = game.add.sprite(32, 35, 'harry');

    //enemy health bar
    eBar = game.add.graphics();
    eBar.lineStyle(7, 0x0000ff, 1);
    eBar.lineTo(game.width, 0);

    // my health bar
    mBar = game.add.graphics(0, game.world.height);
    mBar.lineStyle(7, 0x0000ff, 1);
    mBar.lineTo(game.width, 0);

    //Create missile phaser group
    missiles = game.add.group();

    // Enemy Missile group
    enemyMissiles = game.add.group();

    //  We need to enable physics on the player
    game.physics.arcade.enable(player);
    game.physics.arcade.enable(player2);

    //  Player physics properties. Give the little guy a slight bounce.
    player.body.bounce.y = 0.2;
    player.body.gravity.y = 300;
    player.body.collideWorldBounds = true;

    // 2nd Player props
    player2.body.collideWorldBounds = true;
}

function update() {
     //  Reset the players velocity (movement)
    player.body.velocity.x = 0;

    if (cursors.left.isDown)
    {
        //  Move to the left
        player.body.velocity.x = -150;
        player.x -= 20;

        socket.emit('go-left');

        //player.animations.play('left');
    }
    else if (cursors.right.isDown)
    {
        //  Move to the right
        player.body.velocity.x = 150;
        player.x += 20;

        socket.emit('go-right')
    }
    else
    {
        //  Stand still
        player.animations.stop();

        player.frame = 4;
    }

    if (cursors.up.isDown) {
        var missile = missiles.create(player.body.x, player.body.y  , 'missile');
        game.physics.arcade.enable(missile);
        missile.body.velocity.y = -120;

        socket.emit('missile');
    }

    //  Allow the player to jump if they are touching the ground.
    if (cursors.up.isDown && player.body.touching.down)
    {
        player.body.velocity.y = -350;
    }

    // When the missile hits the enemy
    game.physics.arcade.collide(player2, missiles, (p, m) => m.kill());

    // When enemy missile hits me
    game.physics.arcade.collide(player, enemyMissiles, (p, m) => {
        m.kill();

        if (playerHealth <= 0) {
            p.kill();
            socket.emit('dead');
        } else {
            playerHealth -= 3;

            var pHealth = playerHealth / maxHealth;
            mBar.width = pHealth;

            socket.emit('hit');
        }
    });    

    // When my missile hits enemy missile
    game.physics.arcade.collide(missiles, enemyMissiles, (m1, m2) => {
        console.log('Kill em all');
        m2.kill();
        m1.kill();
    });
}

//2nd player movement
socket.on('go-left', function () {
    //move 2nd player to left 

    player2.body.velocity.x = -150;
    player2.x -= 20;

     player2.body.velocity.x = 0;
});

socket.on('go-right', function () {
    //move 2nd Player to right
    player2.body.velocity.x = 150;
    player2.x += 20;

    player2.body.velocity.x = 0;
});

socket.on('missile', function () {
    var missile = enemyMissiles.create(player2.body.x, player2.body.y, 'missile');
    game.physics.arcade.enable(missile);
    missile.body.velocity.y = 120;
});

// Here the health status is monitored purely on client side
// Every player is responsible for maintaining his health state and
// conveying this to the other player
socket.on('hit', function () {
    console.log('Hit');
    player2Health -= 3;

    var pHealth = player2Health / maxHealth;
    eBar.width = pHealth;

});

socket.on('dead', function () {
    player2.kill();
})