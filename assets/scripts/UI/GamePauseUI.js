var GameManager = require("GameManager");
var UserDataManager = require("UserDataManager");

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
        btnMusicOff: cc.Node,
        btnMusicOn: cc.Node,
        btnSoundOff: cc.Node,
        btnSoundOn: cc.Node,
        spCD: cc.Sprite,
        audio: cc.AudioClip,
        audioTick: cc.AudioClip,
        start_ui: cc.Node,
        end_ui: cc.Node,
    },

    init: function(game){
        this._game = game;
    },

    // use this for initialization
    onLoad: function () {
        this.updateButtons();
    },

    updateButtons: function(){
        this.btnMusicOff.active = !GameManager.instance.isMusicOn;
        this.btnMusicOn.active = GameManager.instance.isMusicOn;
        this.btnSoundOff.active = !GameManager.instance.isSoundOn;
        this.btnSoundOn.active = GameManager.instance.isSoundOn;
    },

    show:function(){
        this.node.active = true;
        this.start_ui.active = true;
        this.end_ui.active = false;
        var width = cc.director.getWinSize().width/2;
        var height = cc.director.getWinSize().height/2;
        this.node.x = width;
        this.node.y = height;
        this.start_ui.getComponent(cc.Animation).play();
    },

    hide: function(){
        this.node.active = false;
        GameManager.instance.playSound(this.audio, false, 1);
    },

    onResume: function(){
        this.start_ui.active = false;
        this.end_ui.active = true;
        GameManager.instance.playSound(this.audio, false, 1);
        this.end_ui.getComponent(cc.Animation).play();

        this.spCD.node.active = true;
        let anim = this.spCD.getComponent(cc.Animation);
        anim.play ('cd');
        anim.on('finished',  this.onFinished, this);
        //anim.on('tick',  this.onTick, this);
        GameManager.instance.playSound(this.audioTick, false, 1);
    },

    onTick: function(){
        // this.spCD.getComponent(cc.Animation).off('tick', this.onTick, this);
        GameManager.instance.playSound(this.audioTick, false, 1);
        cc.log("onTick~~~~~");
    },

    onFinished: function(){
        // GameManager.instance.playSound(this.audioTick, false, 1);
        this.spCD.getComponent(cc.Animation).off('finished', this.onFinished, this);
        GameManager.instance.setPaused(false);
        this.hide();
        cc.log("onTick finished~~~~~");
    },

    onMusicOn: function(){
        GameManager.instance.playSound(this.audio, false, 1);
        GameManager.instance.switchMusic(true);

        // this.btnMusicOff.active = true;
        // this.btnMusicOn.active = false;
        this.updateButtons();
    },

    onMusicOff: function(){
        GameManager.instance.playSound(this.audio, false, 1);
        GameManager.instance.switchMusic(false);

        // this.btnMusicOff.active = false;
        // this.btnMusicOn.active = true;
        this.updateButtons();
    },

    onSoundOn: function(){
        GameManager.instance.playSound(this.audio, false, 1);
        GameManager.instance.switchSound(true);

        // this.btnSoundOff.active = true;
        // this.btnSoundOn.active = false;
        this.updateButtons();
    },

    onSoundOff: function(){
        GameManager.instance.playSound(this.audio, false, 1);
        GameManager.instance.switchSound(false);

        // this.btnSoundOff.active = false;
        // this.btnSoundOn.active = true;
        this.updateButtons();
    },

    onRestart: function(){
        GameManager.instance.playSound(this.audio, false, 1);
        UserDataManager.instance.getGameData().clear();
        UserDataManager.instance.getEnergyData().clear();
        GameManager.instance.setPaused(false);
        cc.director.loadScene('PlayGame');
    },

    onHome: function(){
        GameManager.instance.playSound(this.audio, false, 1);
        cc.director.loadScene('MapGame' + GameManager.instance.entranceID);
    }
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
