
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
        flyNode: cc.Node,

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

    playFly: function(){

        var self = this;
        var onFlyFinished = function(){
            self.flyNode.active = false;
            self.game.player.addBuff(self.buffData);
            self.game.poolMng.returnBuffItem(self.attributeID, self.node);
            cc.log("fly finished~~~~~~~~~~~~~");
        };

        var targetPos = this.game.inGameUI.buffDisplay.position;
        if(this.attributeID == 0){//if it is life.
            targetPos = this.game.inGameUI.txt_life.node.parent.position;
            // targetPos = this.game.inGameUI.txt_life.node.convertToWorldSpace(cc.v2(0, 0));
        }

        let dir = cc.pSub(targetPos, this.node.position);
        let rad = cc.pToAngle(dir);
        let deg = cc.radiansToDegrees(rad);
        this.node.rotation = 90 - deg;

        this.flyNode.active = true;
        var flyAnimation = this.node.getComponent(cc.Animation);
        flyAnimation.play();

        var distance = cc.pDistance(targetPos, this.node.position);
        var duration = 1.0 * distance/cc.director.getWinSize().width;
        this.node.runAction(cc.sequence(cc.moveTo(duration, targetPos),  cc.callFunc(onFlyFinished)));
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
            self.hideNode.active = false;
            hideAnim.off("finished", onHideFinish, false);
            // cc.log("hide animation finished555~~~~~~~");
            self.playFly();
        };

        hideAnim.on("finished", onHideFinish, true);
        hideAnim.play();
    },

    playShow: function(){
        this.isPlayingShow = true;
        var showAnim = this.node.getComponent(cc.Animation);
        var self = this;

        var onShowFinish = function(){
            self.isPlayingShow = false;
            // cc.log("show animation finished444~~~~~~~");
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
