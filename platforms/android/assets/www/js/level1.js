var level1 = {
    preload: function() {
        this.game.load.image('sky', 'assets/sky.png');
        this.game.load.image('ground', 'assets/platform.png');
        this.game.load.image('star', 'assets/star.png');
        this.game.load.image('tiles', 'assets/forest.png');
        this.game.load.spritesheet('dude', 'assets/dude.png', 32, 48);

        game.load.spritesheet('explosio', 'assets/explosion.png', 128, 128);

        this.game.load.image('live', 'assets/hearth.png');

        game.load.image('fire', 'assets/fire.png');
        game.load.image("jump","assets/jump.png");
        game.load.image('bottonright', 'assets/right.png');
        game.load.image('bottonleft', 'assets/left.png');

        game.load.image('bullet', 'assets/shoot.png');
        game.load.image("enemy","assets/asteroid2.png");
        game.load.image('rain', 'assets/blue_ball.png');
        game.load.image('blood', 'assets/ball-tlb.png');

        this.game.load.tilemap('tilemap', 'assets/forest.json', null, Phaser.Tilemap.TILED_JSON);
        this.game.load.image('Forest', 'assets/FreeTileset/png/BG/BG.png');
        this.game.load.image('Platforms', 'assets/FreeTileset/png/Tiles/1.png');
        this.game.load.image('Platforms2', 'assets/FreeTileset/png/Tiles/3.png');
        this.game.load.image('Stone', 'assets/FreeTileset/png/Object/Stone.png');
        this.game.load.image('Tree_2', 'assets/FreeTileset/png/Object/Tree_2.png');

        this.game.load.audio('dead', ['assets/dead.wav', 'assets/dead.mp3']);
        this.game.load.audio('dust', ['assets/dust.wav', 'assets/dust.mp3']);
        this.game.load.audio('jump', ['assets/jump.wav', 'assets/jump.mp3']);
        this.game.load.audio('coin', ['assets/coin.wav', 'assets/coin.mp3']);
        this.game.load.audio('laser', ['assets/laser.mp3']);
        this.game.load.audio('music', ['assets/musicgame.mp3']);
        this.game.load.audio('rain', ['assets/rain.mp3']);

        this.player;
        this.enemy;
        this.platforms;
        this.cursors;
        this.stars;
        this.score = 0;
        this.scoreText;

        this.max = 0;
        this.front_emitter;
        this.mid_emitter;
        this.back_emitter;
        this.update_interval = 4 * 60;
        this.i = 0;

        this.bullets;

        this.fireRate = 100;
        this.nextFire = 0;
    },

    create: function() {
        //Added physics
        this.game.physics.startSystem(Phaser.Physics.ARCADE);

        //Add map
        this.addMap();

        //Scale
        this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        this.scale.pageAlignHorizontally = true;
        //this.scale.pageAlignVertically = true;
        this.scale.updateLayout();


        //Add sound
        this.addSound();

        //Add player
        this.addPlayer();

        //Added stars
        this.addStars();

        //Add rain
        this.addRain();

        //add explosion
        this.addExplosion();

        //Print lives score
        this.addLives();

        //Player shoot
        this.createBullets();

        //Add enemy
        this.addEnemy();

        //Add blood particles
        this.createParticles();

        //Add texts and points
        this.createTexts();

        //  Our controls.
        this.cursors = this.game.input.keyboard.createCursorKeys();

        //Detected device
        if (!game.device.desktop)
            this.addMobileInputs();
    },

    update: function() {

        this.game.physics.arcade.collide(this.player, this.platformsLayer);
        this.game.physics.arcade.collide(this.stars, this.platformsLayer);
        //  Checks to see if the player overlaps with any of the stars, if he does call the collectStar function
        this.game.physics.arcade.overlap(this.player, this.stars, this.collectStar, null, this);
        this.game.physics.arcade.overlap(this.player, this.enemy, this.deadPlayer, null, this);
        this.game.physics.arcade.overlap(this.bullets, this.enemy, this.deadEnemy, null, this);
        //  Reset the players velocity (movement)
        this.player.body.velocity.x = 0;
        if (this.cursors.left.isDown || this.moveLeft)
        {
            //  Move to the left
            this.player.body.velocity.x = -150;
            this.player.animations.play('left');
        }
        else if (this.cursors.right.isDown || this.moveRight)
        {
            //  Move to the right
            this.player.body.velocity.x = 150;
            this.player.animations.play('right');
        }
        else
        {
            //  Stand still
            this.player.animations.stop();
            this.player.frame = 4;
        }

        //  Allow the player to jump if they are touching the ground.
        if (this.cursors.up.isDown )
        {
            this.game.sound.mute = false;
            this.jump();

        }
        //Shoot a player weapon
        if (game.input.activePointer.isDown && game.input.activePointer.y < 250)
        {
            this.fire();
        }

        //Move enemys
        this.enemyMove();

        //Mobile controls
        this.selectMobileControls();


        this.inputs();

        if ( this.player.position.x > 3000){
            this.music.stop();
            this.game.state.start('level2');
        }
    },

    inputs: function() {
    },

    addMap: function(){
        //Added background and platforms
        //this.game.add.sprite(0, 0, 'sky');
        this.map = this.game.add.tilemap('tilemap');
        this.map.addTilesetImage('Forest');
        this.map.addTilesetImage('Platforms');
        this.map.addTilesetImage('Platforms2');
        this.map.addTilesetImage('Stone');
        this.map.addTilesetImage('Tree_2');
        //Add Layers for platforms and background
        this.backgroundLayer = this.map.createLayer('Background');
        this.platformsLayer = this.map.createLayer('Platforms');
        //Add collision to platforms
        this.map.setCollisionBetween(1, 2000, true, 'Platforms');
        //Change map size
        this.backgroundLayer.resizeWorld();
    },

    addSound: function(){
        //Added sounds
        //this.game.sound.mute = true;
        this.music = this.game.add.audio('music', 0.5);
        this.music.play();
        this.rain = this.game.add.audio('rain', 1);
        this.rain.play();
        this.deadSound = this.game.add.audio('dead', 0.1);
        this.jumpSound = this.game.add.audio('jump', 0.1);
        this.dustSound = this.game.add.audio('dust', 0.1);
        this.coinSound = this.game.add.audio('coin', 0.1);
        this.laser = this.game.add.audio('laser', 0.1);
    },

    createTexts: function(){
        //  The score
        this.scoreText = this.game.add.text(16, 16, 'score: 0', { fontSize: '32px', fill: '#000' });
        this.scoreText.fixedToCamera = true;
        // The level
        this.levelText = this.game.add.text(16, 5, 'Level 1', { fontSize: '14px', fill: '#000' });
        this.levelText.fixedToCamera = true;
    },

    addPlayer: function(){
        //Added player and enable pysics
        this.player = game.add.sprite(1, this.game.world.height - 450, 'dude');
        this.game.physics.arcade.enable(this.player);

        //Camera
        this.game.camera.follow(this.player);

        //  Player physics properties. Give the little guy a slight bounce.
        this.player.body.bounce.y = 0.2;
        this.player.body.gravity.y = 300;
        this.player.body.collideWorldBounds = true;
        //  Our two animations, walking left and right.
        this.player.animations.add('left', [0, 1, 2, 3], 10, true);
        this.player.animations.add('right', [5, 6, 7, 8], 10, true);
    },

    jump: function(){
        //Only jamp in floor
        if (this.player.body.onFloor()){
            this.player.body.velocity.y = -350;
            this.jumpSound.play();
        }
    },

    addStars: function(){
        this.stars = this.game.add.group();
        //  We will enable physics for any star that is created in this group
        this.stars.enableBody = true;
        this.starsNum = 30;
        for (var i = 0; i < this.starsNum; i++)
        {
            //  Create a star inside of the 'stars' group
            this.star = this.stars.create(i * 200, 0, 'star');
            //  Let gravity do its thing
            this.star.body.gravity.y = 100;
            //  This just gives each star a slightly random bounce value
            this.star.body.bounce.y = 0.7 + Math.random() * 0.2;
        }
    },

    collectStar: function (player, star) {
        this.game.sound.mute = false;
        // Removes the star from the screen with tween
        this.game.sound.mute = false;
        star.body.enable = false;
        game.add.tween(star.scale).to({x:0}, 150).start();
        game.add.tween(star).to({y:150}, 150).start();
        this.coinSound.play();

        //  Add and update the score
        this.score += 10;
        this.scoreText.text = 'Score: ' + this.score;
        this.coinSound.play();
        //console.log(this.player.body.x)
    },

    reset: function(){
        this.player.scale.setTo(0, 0);
        this.game.add.tween(this.player.scale).to({x:1, y:1}, 300).start();
        this.player.reset(1, this.game.world.height -195);

        this.score = 0;
        this.scoreText.text = 'Score: 0';

        this.enemy.removeAll();
        this.addEnemy();

        this.stars.removeAll();
        this.addStars();
    },

    addLives: function(){
        this.playerDead = false;
        this.lives = 3;
        this.remainingLives = game.add.group();
        this.livesText = this.game.add.text(16, 60, '', { font: '34px Arial', fill: '' });
        for (var i = 0; i < 3; i++)
        {
            this.firstaid = this.remainingLives.create(50 + (30 * i), 80, 'live');
            this.firstaid.anchor.setTo(0.5, 0.5);
            this.firstaid.alpha = 0.4;
        }

        this.livesText.fixedToCamera = true;
        this.remainingLives.fixedToCamera = true;
    },

    deadPlayer: function (){
        this.exp.x = this.player.x;
        this.exp.y = this.player.y + 10;
        this.exp.start(true, 500, null, 20);
        this.shakeEffect(this.enemy);
        this.deadSound.play();
        this.lives--;
        this.remainingLives.removeChildAt(this.lives);
        if (this.lives == 0){
            this.playerDead = true;
        }
        if (this.playerDead) {
            this.music.stop();
            this.game.state.start('gameOver');

        } else {
            this.reset();
        }
    },

    createBullets: function(){
        this.bullets = game.add.group();
        this.bullets.enableBody = true;
        this.bullets.physicsBodyType = Phaser.Physics.ARCADE;

        this.bullets.createMultiple(50, 'bullet');
    },

    addRain: function(){
        this.emitter = game.add.emitter(game.world.centerX, 0, 500);
        this.emitter.enableBody = true;
        this.emitter.width = game.world.width;
        //this.emitter.angle = 30; // uncomment to set an angle for the rain.
        this.emitter.makeParticles('rain');
        this.emitter.minParticleScale = 0.1;
        this.emitter.maxParticleScale = 0.3;
        this.emitter.setYSpeed(300, 500);
        this.emitter.setXSpeed(-5, 5);
        this.emitter.minRotation = 0;
        this.emitter.maxRotation = 0;
        this.emitter.start(false, 1600, 5, 0);
    },

    addEnemy: function (){

        this.enemy = this.game.add.group();
        this.enemy.enableBody = true;

        this.enemy1 = this.enemy.create(400, 40, 'enemy');
        this.enemy2 = this.enemy.create(1800, 50, 'enemy');

//            this.enemy1.body.gravity.y = 300;
        this.enemy1.body.velocity.x = 80;
//            this.enemy2.body.gravity.y = 300;
        this.enemy2.body.velocity.x = 80;

    },

    enemyMove: function(){
        if (parseInt(this.enemy1.body.x) > 470 ) { this.enemy1.body.velocity.x = -80; }
        if (parseInt(this.enemy1.body.x) < 320 ) { this.enemy1.body.velocity.x = 80; }
        if (parseInt(this.enemy2.body.x) > 1960 ) { this.enemy2.body.velocity.x = -80; }
        if (parseInt(this.enemy2.body.x) < 1770 ) { this.enemy2.body.velocity.x = 80; }
    },

    fire: function(){
        if (game.time.now > this.nextFire && this.bullets.countDead() > 0)
        {
            this.nextFire = game.time.now + this.fireRate;
            this.bullet = this.bullets.getFirstDead();
            this.bullet.reset(this.player.x + 10, this.player.y + 30 );
            game.physics.arcade.moveToPointer(this.bullet, 300);
            this.laser.play();
        }
    },

    deadEnemy: function(bullet, enemy){

        this.deadSound.play();

        //  When a bullet hits an alien we kill them both
        bullet.kill();
        enemy.kill();

        this.explosion = this.explosions.getFirstExists(false);
        this.explosion.reset(enemy.body.x, enemy.body.y);
        this.explosion.play('explosio', 10, false, true);
    },

    addExplosion: function(){
        this.explosions = this.game.add.group();
        this.explosions.createMultiple(30, 'explosio');
        this.explosions.forEach(this.createExplosion, this);
    },

    createExplosion: function(explosion) {
        explosion.anchor.x = 0.5;
        explosion.anchor.y = 0.5;
        explosion.animations.add('explosio');
        this.dustSound.play();
    },

    createParticles: function() {
        this.exp = game.add.emitter(0, 0, 15);
        this.exp.makeParticles('blood');
        this.exp.minParticleScale = 0.1;
        this.exp.maxParticleScale = 0.2;
        this.exp.setYSpeed(-150, 150);
        this.exp.setXSpeed(-350, 350);
        this.exp.gravity = 150;
    },

    shakeEffect: function(g) {
        var move = 100;
        var time = 500;

        this.game.add.tween(g)
            .to({y:"-"+move}, time).to({y:"+"+move*2}, time*2).to({y:"-"+move}, time)
            .to({y:"-"+move}, time).to({y:"+"+move*2}, time*2).to({y:"-"+move}, time)
            .to({y:"-"+move/2}, time).to({y:"+"+move}, time*2).to({y:"-"+move/2}, time)
            .start();

        this.game.add.tween(g)
            .to({x:"-"+move}, time).to({x:"+"+move*2}, time*2).to({x:"-"+move}, time)
            .to({x:"-"+move}, time).to({x:"+"+move*2}, time*2).to({x:"-"+move}, time)
            .to({x:"-"+move/2}, time).to({x:"+"+move}, time*2).to({x:"-"+move/2}, time)
            .start();
    },

    selectMobileControls: function(g) {
        //Detect mobile device
        if (!game.device.desktop){
            this.jumpButton = game.add.sprite(800, 255, 'jump');
            this.jumpButton.fixedToCamera = true;
            this.jumpButton.inputEnabled = true;
            this.jumpButton.events.onInputDown.add(this.jump, this);
            this.jumpButton.alpha = 0.5;

            this.shootButton = game.add.sprite(900, 255, 'fire');
            this.shootButton.fixedToCamera = true;
            this.shootButton.inputEnabled = true;
            this.shootButton.events.onInputDown.add(this.fire, this);
            this.shootButton.alpha = 0.5;

            this.moveLeft = false;
            this.moveRight = false;

            this.leftButton = game.add.sprite(10, 255, 'bottonleft');
            this.leftButton.fixedToCamera = true;
            this.leftButton.inputEnabled = true;
            this.leftButton.events.onInputOver.add(function(){this.moveLeft=true;}, this);
            this.leftButton.events.onInputOut.add(function(){this.moveLeft=false;}, this);
            this.leftButton.events.onInputDown.add(function(){this.moveLeft=true;}, this);
            this.leftButton.events.onInputUp.add(function(){this.moveLeft=false;}, this);
            this.leftButton.alpha = 0.5;

            this.rightButton = game.add.sprite(110, 255, 'bottonright');
            this.rightButton.fixedToCamera = true;
            this.rightButton.inputEnabled = true;
            this.rightButton.events.onInputOver.add(function(){this.moveRight=true;}, this);
            this.rightButton.events.onInputOut.add(function(){this.moveRight=false;}, this);
            this.rightButton.events.onInputDown.add(function(){this.moveRight=true;}, this);
            this.rightButton.events.onInputUp.add(function(){this.moveRight=false;}, this);
            this.rightButton.alpha = 0.5;
        }
    },

    gofull: function() {

        if (game.scale.isFullScreen) {
            game.scale.stopFullScreen();
        }
        else {
            game.scale.startFullScreen(false);
        }
    }
};
