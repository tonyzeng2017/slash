
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
        attributeID: 0,

        isReturned: {
            visible: false,
            default: false
        },

        isPlayingShow: {
            visible: false,
            default: false
        },

        isPlayingHide: {
            visible: false,
            default: false
        }
    },

    init: function(game, buffData){
        this.game = game;
        this.buffData = buffData;
    },

    // use this for initialization
    onLoad: function () {
        this.playShow();
    },

    playHide: function(){
        this.isPlayingHide = true;
        this.node.getComponent(cc.Animation).play("buff_hide");
    },

    onHideFinish: function(){
        this.isPlayingHide = false;
        this.isReturned = true;
        this.game.poolMng.returnBuffItem(this.attributeID, this.node);
    },

    playShow: function(){
        this.isPlayingShow = true;
        this.node.getComponent(cc.Animation).play("buff_show");
        cc.log("playshow222~~~~~~~~~~~~~~~");
    },

    onShowFinish: function(){
        this.isPlayingShow = false;
        cc.log("animation finished444~~~~~~~");
        // this.buffAnimation.off("finish", this.onShowFinished, false);
    },

    // called every frame, uncomment this function to activate update callback
    update: function (dt) {
        if(this.isPlayingShow){
            return;
        }

        if(this.isPlayingHide){
            return;
        }

        if(this.isReturned){
            return;
        }

        let dist = cc.pDistance(this.game.player.node.position, this.node.position);
        if (dist < 50 && this.game.player.isAlive) {
            cc.log("going to play hide~~~~~~~~~~~");
            this.playHide();
        }

    },
});
