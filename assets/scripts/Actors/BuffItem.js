
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
        showNode: cc.Node,
        hideNode: cc.Node,

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
        // this.playHide();
    },

    playHide: function(){
        this.isPlayingHide = true;
        this.hideNode.active = true;
        this.showNode.active = false;
        var hideAnim = this.node.getComponent(cc.Animation);
        var self = this;

        var onHideFinish = function(){
            self.isPlayingHide = false;
            self.isReturned = true;
    
            hideAnim.off("finished", onHideFinish, false);
            cc.log("hide animation finished555~~~~~~~");
            self.game.poolMng.returnBuffItem(self.attributeID, self.node);
        };

        hideAnim.on("finished", onHideFinish, true);
        hideAnim.play();
    },

    onHideFinish: function(){

    },

    playShow: function(){
        this.isPlayingShow = true;
        var showAnim = this.node.getComponent(cc.Animation);
        var self = this;

        var onShowFinish = function(){
            self.isPlayingShow = false;
            cc.log("show animation finished444~~~~~~~");
            showAnim.off("finished", onShowFinish, false);
        };

        showAnim.on("finished", onShowFinish, true);
        showAnim.play();
        cc.log("playshow222~~~~~~~~~~~~~~~");
    },

    onShowFinish: function(){
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
