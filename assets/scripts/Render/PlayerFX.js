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
        changeSceneAnim: cc.Animation,
        inGameUI: cc.Node,
        story: cc.Prefab
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

            if(UserDataManager.instance.getNewbieData().isInGameFinished){
                self.inGameUI.active = false;
                self.changeSceneAnim.on("finished", function(){
                    self.startIntro();
                    self.inGameUI.active = true;
                    self.changeSceneAnim.node.active = false;
                });
                self.changeSceneAnim.play();
            }
            else{
                // UserDataManager.instance.getNewbieData().finishInGame();
                self.newBieAnim.node.active = true;
                self.newBieAnim.play();
                self.newBieAnim.on('finished',  function(){
                    self.newBieAnim.node.active = false;
                    self.startIntro();
                }, self);
            }
        }

        var stageData = GameManager.instance.getCurStageData();
        // if(GameManager.instance.storyEnabled(stageData.Story)){
        //      var storyUI = cc.instantiate(this.story);
        //      storyUI.x = cc.director.getWinSize().width/2;
        //      storyUI.y = cc.director.getWinSize().height/2;
        //      cc.log("storyID: %s", stageData.Story);
        //      storyUI.getComponent("StoryRenderer").setStoryAndCallback(stageData.Story, doPlayIntro);
        //      this.game.node.addChild(storyUI);

        //      GameManager.instance.playStory(stageData.Story);
        // }else{
        //      doPlayIntro();
        // }

        this.game.playStory(stageData.StoryStart,  doPlayIntro);
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
