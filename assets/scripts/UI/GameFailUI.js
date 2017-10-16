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
        // };

        audioTouch: cc.AudioClip
    },

    // use this for initialization
    onLoad: function () {
        this._rewardRenderer = this.node.getComponent("PanelRewardRenderer");
    },

    init: function(game){
        this._game = game;
    },

    goUpgrade: function(){
        GameManager.instance.playSound(this.audioTouch);
        GameManager.instance.playerSceneIndex = 1;
        cc.director.loadScene("PlayerScene");
    },

    onHome: function(){
        GameManager.instance.playSound(this.audioTouch, false, 1);
        cc.director.loadScene("MapGame" + GameManager.instance.entranceID);
        cc.log("game fail map game~~~~~~~~~");
    },

    onRestart: function(){
        GameManager.instance.playSound(this.audioTouch, false, 1);
        cc.director.loadScene("PlayGame");
        cc.log("game fail play game~~~~~~~~~~~~~~");
    },

    show: function(){
        // cc.log("this is a item revived~~~~~~~~~");
        this.node.active = true;
        var hw = cc.director.getWinSize().width/2;
        var hh = cc.director.getWinSize().height/2;
        this.node.x = hw;
        this.node.y = hh;
        this._rewardRenderer.render();
    }
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
