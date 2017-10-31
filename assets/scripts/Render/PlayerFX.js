var UserDataManager = require("UserDataManager");
var GameManager = require("GameManager");

cc.Class({
    extends: cc.Component,

    properties: {
        introAnim: cc.Animation,
        reviveAnim: cc.Animation,
        newBieAnim: cc.Animation,
        audioIntro: cc.AudioClip,
        audioRevive: cc.AudioClip,
    },

    // use this for initialization
    init (game) {
        this.game = game;
        this.introAnim.node.active = false;
        this.reviveAnim.node.active = false;
    },

    playIntro () {
        if(UserDataManager.instance.getNewbieData().isInGameFinished){
            this.startIntro();
        }
        else{
            var self = this;
            // UserDataManager.instance.getNewbieData().finishInGame();
            this.newBieAnim.node.active = true;
            this.newBieAnim.play();
            this.newBieAnim.on('finished',  function(){
                self.newBieAnim.node.active = false;
                self.startIntro();
            }, self);
        }
    },

    startIntro(){
        this.introAnim.node.active = true;
        this.introAnim.play('start');
        GameManager.instance.playSound(this.audioIntro, false, 1);
    },

    playRevive () {
        this.reviveAnim.node.active = true;
        this.reviveAnim.node.setPosition(this.game.player.node.position);
        this.reviveAnim.play('revive2');
        GameManager.instance.playSound(this.audioRevive, false, 1);
    },

    introFinish () {
        this.game.playerReady(false);
        this.introAnim.node.active = false;
    },

    reviveFinish () {
        this.game.playerReady(true);
        this.reviveAnim.node.active = false;
    },
    
    reviveKill () { // kill all enemies
        this.game.clearAllFoes();
        cc.log("revive killed all~~~~~~~~~~~");
    }
});
