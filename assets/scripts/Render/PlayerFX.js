var UserDataManager = require("UserDataManager");
var GameManager = require("GameManager");
const Types = require('Types');

cc.Class({
    extends: cc.Component,

    properties: {
        introAnim: cc.Animation,
        reviveAnim: cc.Animation,
        // newBieAnim: cc.Animation,
        audioIntro: cc.AudioClip,
        audioRevive: cc.AudioClip,
        changeSceneAnim: cc.Animation,
        inGameUI: cc.Node,
        story: cc.Prefab,
        newbie: cc.Prefab,
    },

    // use this for initialization
    init (game) {
        this.game = game;
        this.introAnim.node.active = false;
        this.reviveAnim.node.active = false;
    },

    playIntro: function(){
        var self = this;
        var doPlayIntro = function() {
            self.inGameUI.active = false;
            self.changeSceneAnim.on("finished", function(){
                self.startIntro();
                self.inGameUI.active = true;
                self.changeSceneAnim.node.active = false;
            });
            self.changeSceneAnim.play();

            if(GameManager.instance.isBossStage){
                GameManager.instance.updateScene(Types.sceneType.BATTLE_BOSS);
            }else{
                GameManager.instance.updateScene(Types.sceneType.BATTLE_NORMAL);
            }
        }

        var stageData = GameManager.instance.getCurStageData();
        this.game.playStory(stageData.StoryStart,  doPlayIntro);
    },

    startIntro(){
        this.introAnim.node.active = true;
        if(UserDataManager.instance.getUserData().isMaxStar()){
            this.introAnim.play('start1');
        }else{
            this.introAnim.play('start');
        }
        GameManager.instance.playSound(this.audioIntro, false, 1);
    },

    playRevive () {
        this.reviveAnim.node.active = true;
        this.reviveAnim.node.setPosition(this.game.player.node.position);
        if(UserDataManager.instance.getUserData().isMaxStar()){
            this.reviveAnim.play('revive1');
        }else{
            this.reviveAnim.play('revive2');
        }
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
