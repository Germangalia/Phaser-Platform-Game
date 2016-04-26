var startMenu = {

    preload : function() {
        //load image botton
        this.game.load.image('menu', 'assets/playnow.png');
    },

    create: function() {
        //Background color
        this.game.stage.backgroundColor = 0xbada55;
        //Text
        this.text = this.game.add.text(350, 50, 'Hello Phaser!', { fontSize: '50px', fill: '#000' });
        // Create button to start
        this.add.button(360, 150, 'menu', this.startGame, this);

        //Scale
        this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        this.scale.pageAlignHorizontally = true;
        //this.scale.pageAlignVertically = true;
        this.scale.updateLayout();


    },

    startGame: function () {
        // Start game
        this.state.start('level1');
    },

    gofull: function() {

        if (game.scale.isFullScreen)
        {
            game.scale.stopFullScreen();
        }
        else
        {
            game.scale.startFullScreen(false);
        }

    }

};
