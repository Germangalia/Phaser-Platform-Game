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
    },

    startGame: function () {
        // Start game
        this.state.start('level1');
    }

};
