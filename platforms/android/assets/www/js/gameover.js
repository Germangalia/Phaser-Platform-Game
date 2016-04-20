var gameOver = {

    preload : function() {
        // Load image botton
        this.game.load.image('restart', 'assets/restart.png');
    },

    create : function() {
        //Background color
        this.game.stage.backgroundColor = 0xbada55;
        //Text
        this.text = this.game.add.text(350, 50, 'Game Over!', { fontSize: '50px', fill: '#000' });
        // Create button to restart
        this.add.button(360, 150, 'restart', this.startGame, this);

        // Maintain aspect ratio
        this.game.scale.fullScreenScaleMode = Phaser.ScaleManager.EXACT_FIT;
        //this.game.scale.stopFullScreen();

    },

    startGame: function () {
        // Restat.
        this.state.start('level1');
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
