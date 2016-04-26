game = new Phaser.Game(1000, 320, Phaser.AUTO, 'Game');

this.game.state.add('startMenu', startMenu);
this.game.state.add('boot', boot);
this.game.state.add('level1', level1);
this.game.state.add('level2', level2);
this.game.state.add('gameOver', gameOver);
this.game.state.start('boot');
