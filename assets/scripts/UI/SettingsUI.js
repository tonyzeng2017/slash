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
        btnMusicOff: cc.Node,
        btnMusicOn: cc.Node,
        btnSoundOff: cc.Node,
        btnSoundOn: cc.Node,
        audioTouch: cc.AudioClip
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

    onMusicOn: function(){
        GameManager.instance.playSound(this.audioTouch, false, 1);
        GameManager.instance.switchMusic(true);

        // this.btnMusicOff.active = true;
        // this.btnMusicOn.active = false;
        this.updateButtons();
    },

    onMusicOff: function(){
        GameManager.instance.playSound(this.audioTouch, false, 1);
        GameManager.instance.switchMusic(false);

        // this.btnMusicOff.active = false;
        // this.btnMusicOn.active = true;
        this.updateButtons();
    },

    onSoundOn: function(){
        GameManager.instance.playSound(this.audioTouch, false, 1);
        GameManager.instance.switchSound(true);

        // this.btnSoundOff.active = true;
        // this.btnSoundOn.active = false;
        this.updateButtons();
    },

    onSoundOff: function(){
        GameManager.instance.playSound(this.audioTouch, false, 1);
        GameManager.instance.switchSound(false);

        // this.btnSoundOff.active = false;
        // this.btnSoundOn.active = true;
        this.updateButtons();
    },

    show: function () {
        GameManager.instance.playSound(this.audioTouch);
        this.node.active = true;
        this.node.getComponent(cc.Animation).play();
    },

    hide: function () {
        var self = this;
        let hideCB = cc.callFunc(function() {
            self.node.active = false;
        }.bind(this));

        this.node.runAction(hideCB);
        GameManager.instance.playSound(this.audioTouch);
    }

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
