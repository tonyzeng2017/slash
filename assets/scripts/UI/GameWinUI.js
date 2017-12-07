var UserDataManager = require("UserDataManager");
var GameManager = require("GameManager");

cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //    default: null,      // The default value will be used only when the component attaching
        //                           to a node for the first time
        //    url: cc.Texture2D,  // optional, default is typeof default
        //    serializable: true, // optional, default is true
        //    visible: true,      // optional, default is true
        //    displayName: 'Foo', // optional
        //    readonly: false,    // optional, default is false
        // },
        // ...
        nodeLevels: [cc.Node],
        scoreDetail: cc.Node,
        newbieLevelUp: cc.Node,
        audioTouch: cc.AudioClip,
        isAniFinished: {
            visible: false,
            default: false
        },
        sword: cc.Node,
    },

    init: function(game){
        this._game = game;
    },

    // use this for initialization
    onLoad: function () {
        this._scoreRenderer = this.node.getComponent("PanelScoreRenderer");
        this._rewardRenderer = this.node.getComponent("PanelRewardRenderer");
        this._swordRenderer = this.sword.getComponent("SwordScoreRenderer");
        this.newbieLevelUp.active = !UserDataManager.instance.getNewbieData().isAttrLevelUpFinished;
    },

    start: function(){
        this.node.getComponent(cc.Animation).on('finished',  this.onFinished, this);
    },

    onFinished: function(){
        this.isAniFinished = true;
        this.node.getComponent(cc.Animation).off("finished", this.onFinished, this);
    },

    render: function(){
        // this.text_total_score.string = UserDataManager.instance.getGameData().totalScore;
        this._scoreRenderer.render();
        this._rewardRenderer.render();

        let scoreLevel = UserDataManager.instance.getGameData().getScoreLevel();
        for(var i = 0 ; i < this.nodeLevels.length; i++ ){
            this.nodeLevels[i].active = scoreLevel == i;

            /*if(this.nodeLevels[i].active){
                this.nodeLevels[i].scaleX = 1.5;
                this.nodeLevels[i].scaleY = 1.5;
                // let scaleB = cc.ScaleTo(0.5, 1.5, 1.5).easing(cc.easeQuinticActionOut());
                let scaleAction = cc.scaleTo(0.4,  0.6, 0.6).easing(cc.easeQuinticActionOut());
                let scaleTo = cc.sequence(cc.delayTime(0.0), scaleAction);
                this.nodeLevels[i].runAction(scaleTo);
            }*/
        }
    },

    show: function(){
        var width = cc.director.getWinSize().width/2;
        var height = cc.director.getWinSize().height/2;
        this.node.x = width;
        this.node.y = height;
        this.node.active = true;
        // this.node.getComponent("PanelScoreRenderer").render();
        this.render();
        cc.log("game win panel show~~~~~~~~~~~~~~~~~");
    },

    onHome: function(){
        if(!this.isAniFinished){
            return;
        }
        var touched = false;
        if(!touched){
            touched = true;
            cc.director.loadScene("MapGame" + GameManager.instance.entranceID, function(){
                touched = false;  
            });
        }
        GameManager.instance.playSound(this.audioTouch);
    },

    onRestart: function(){
        if(!this.isAniFinished){
            return;
        }

        cc.director.loadScene("PlayGame");
        GameManager.instance.playSound(this.audioTouch);
    },

    hide: function(){
        this.node.active = false;
        this.node.x = 2000;
        GameManager.instance.playSound(this.audioTouch);
    },

    toogleDetail: function(){
        this.scoreDetail.active = !this.scoreDetail.active;
        GameManager.instance.playSound(this.audioTouch);
    },

    onPlayScore: function(){
        cc.log("start to play score~~~~~~~~~");
        this._swordRenderer.playAnim();
    },
    
    onNewbieLevelUp: function () {
        UserDataManager.instance.getNewbieData().isNewBieLevelUpStarted = true;
        this.onHome();
    }
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
