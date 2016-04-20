var game = new Phaser.Gamevar game = new Phaser.Game(window.innerWidth * window.devicePixelRatio, window.innerHeight * window.devicePixelRatio, Phaser.CANVAS, '');

this.game.state.add('startMenu', startMenu);
this.game.state.add('level1', level1);
this.game.state.add('level2', level2);
this.game.state.add('gameOver', gameOver);
this.game.state.start('startMenu');
