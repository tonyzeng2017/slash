var UserDataManager = require("UserDataManager");
var MetaDataManager = require("MetaDataManager");
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

        playerUI: cc.Node,
        // starBar: cc.Node,
        attrItemRenderers: [cc.Node],
        btnStar: cc.Node,
        audioStar: cc.AudioClip,
        audioPlayer: cc.AudioClip,
        newbieLevelUps: [cc.Node],
        newbieStarUps: [cc.Node],
        starup_ani: cc.Node,
        iconStarMax: cc.Node
    },

    // use this for initialization
    onLoad: function () {
        let star = UserDataManager.instance.getUserData().star.value;
        // this.starBar.width = 700 * star / 6 ;

        // let starRenderer = this.getComponent("StarRenderer");
        // starRenderer.resignStars();

        this.updateItemRenderers();
        this.btnStar.active = this.isButtonStarVisible();
        this.iconStarMax.active = UserDataManager.instance.getUserData().isMaxStar();
        this.node.dispatchEvent( new cc.Event.EventCustom('level_changed', true));
    },

    start: function(){
        var self = this;
        this.node.on('level_changed', function (event) {
            event.stopPropagation();
            self.btnStar.active = self.isButtonStarVisible();

            if(self.isButtonStarVisible() && !UserDataManager.instance.getNewbieData().isStarUpFinished){
                self.newbieStarUps[0].active = true;
            }
        });
        //this.node.on("level_changed", test);
    },

    updateAttrs: function(){
        for(let i = 0; i < 6; i++){
            this.attrItemRenderers[i].getComponent("AttributeItemRenderer").onLoad();
        }
        this.onLoad();
        this.node.getComponent("StarRenderer").onLoad();
    },

    updateItemRenderers: function(){
        let star = UserDataManager.instance.getUserData().star.value;
        let activeCount = 0;
        let startY = this.attrItemRenderers[0].y;
        for(let i = 1; i <= 6; i++) {
            cc.log("star: %s, ID: %s", star, i);
            var data = MetaDataManager.getPlayerPropertyByStarAndID(star, i);
            this.attrItemRenderers[i - 1].active = data.DisplayPosition == 1;
            if (this.attrItemRenderers[i - 1].active) {
                this.attrItemRenderers[i - 1].y = startY - 85 * activeCount;
                activeCount++;
            }
        }
    },

    isButtonStarVisible: function(){
        return UserDataManager.instance.getUserData().starUpEnable();
    },

    refresh: function(){
        for(let i = 0; i < 6; i++){
            this.attrItemRenderers[i].getComponent("AttributeItemRenderer").onLoad();
        }

        this.onLoad();
        this.node.getComponent("StarRenderer").onLoad();
        cc.log("start to add star~~~~~~~");
    },

    onStar: function(){
        cc.log("star upgrade~~~~~~~~~~~")
        if(!this.isButtonStarVisible()){
            return;
        }

        GameManager.instance.playSound(this.audioStar, false, 1);
        UserDataManager.instance.getUserData().addStar();
        this.refresh();
        this.node.getComponent("StarRenderer").playStar();

        this.starup_ani.active = true;
        let anim = this.starup_ani.getComponent(cc.Animation);
        anim.play();
        anim.on('finished',  this.onAniFinished, this);
    },

    onAniFinished: function () {
        this.starup_ani.getComponent(cc.Animation).off('finished', this.onAniFinished, this);
        this.starup_ani.active = false;
    },

    onRight: function(){
        GameManager.instance.playSound(this.audioPlayer, false, 1);
        this.hide();
        var playerUIScript =  this.playerUI.getComponent("PlayerUI");
        playerUIScript.show();
    },

    show: function () {
        if(this._isShowing){
            return;
        }

        this._isShowing = true;
        let moveCB = cc.callFunc(function() {
            this.newbieLevelUps[0].active = UserDataManager.instance.getNewbieData().isShowAttrLevelUp();
            this._isShowing = false;
        }.bind(this));
        let moveAction = cc.moveTo(0.5,  cc.p(0, 0)).easing(cc.easeQuinticActionOut());
        let action = cc.sequence(moveAction, moveCB);
        this.node.runAction(action);
    },

    showWithoutAnimation: function () {

    },

    hide: function () {
        let moveAction = cc.moveTo(0.5,  cc.p(2000, 0)).easing(cc.easeQuinticActionOut());
        // let delay = cc.delayTime(this.atkStun/1000);
        // let callback = cc.callFunc(this.onAtkFinished, this);
        this.node.runAction(moveAction);
    },
    
    onNewbieLevelUp1: function () {
        this.newbieLevelUps[0].active = false;
        this.newbieLevelUps[1].active = true;
    },

    onNewbieLevelUp2: function () {
        this.newbieLevelUps[1].active = false;
        this.newbieLevelUps[2].active = true;
        this.attrItemRenderers[0].getComponent("AttributeItemRenderer").onLevelUp();
    },

    onNewbieLevelUp3: function () {
        this.newbieLevelUps[2].active = false;
        this.newbieLevelUps[3].active = true;
        // this.attrItemRenderers[0].getComponent("AttributeItemRenderer").onLevelDown();
    },

    onNewbieLevelUp4: function () {
        this.newbieLevelUps[3].active = false;
        UserDataManager.instance.getNewbieData().finishAttrLevelUp();
        this.onRight();
    },
    
    onNewbieStarUp1: function () {
        this.newbieStarUps[0].active = false;
        this.newbieStarUps[1].active = true;
    },

    onNewBieStarUp2: function () {
        UserDataManager.instance.getNewbieData().finishStarUp();
        this.newbieStarUps[1].active = false;
        this.onStar();
    }

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
