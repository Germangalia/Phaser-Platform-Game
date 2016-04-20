var game = new Phaser.Game("100%", "100%", Phaser.CANVAS, '');

this.game.state.add('startMenu', startMenu);
this.game.state.add('level1', level1);
this.game.state.add('level2', level2);
this.game.state.add('gameOver', gameOver);
this.game.state.start('startMenu');
