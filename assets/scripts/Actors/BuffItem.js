
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
        buffAnimation: cc.Animation,

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

    init: function(game){
        this.game = game;
    },

    // use this for initialization
    onLoad: function () {

    },

    playHide: function(){
        this.isPlayingHide = true;
        this.buffAnimation.play("hide");
        this.buffAnimation.on("finished", this.onHideFinished, true);
        this.game.poolMng.returnBuffItem(this.node);
    },

    onHideFinished: function(){
        this.isPlayingHide = false;
        this.isReturned = true;

        this.buffAnimation.off("finished", this.onHideFinished, false);
    },

    playShow: function(){
        this.isPlayingShow = true;
        this.buffAnimation.play("show");
        this.buffAnimation.on("finished", this.onShowFinished, true);
    },

    onShowFinished: function(){
        this.isPlayingShow = false;
        cc.log("animation finished444~~~~~~~");
        this.buffAnimation.off("finished", this.onShowFinished, false);
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
        if (dist < 35 && this.game.player.isAlive) {
            this.playHide();
        }

    },
});
