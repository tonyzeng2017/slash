cc.Class({
    extends: cc.Component,

    properties: {
        txtScore: cc.Label
    },

    init (game) {
        this.game = game;
        this.hide();
    },

    // use this for initialization
    show () {
        this.node.setPosition(0, 0);
        this.txtScore.string = this.game.player.totalScore;
    },

    hide () {
        this.node.x = 3000;
    },

    restart () {
        //this.game.restart();
        cc.director.loadScene('PlayerScene');
    }
});
