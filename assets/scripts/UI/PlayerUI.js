const MetaDataManager = require("MetaDataManager");
const GameManager = require("GameManager");
var UserDataManager = require("UserDataManager");
var Types = require("Types");
var Constant = require("Constant");

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
        upgradeUI : cc.Node,
        detailUI: cc.Node,
        maxAttrUI:  cc.Node,
        attrItems: [cc.Node],
        audioUpgrade: cc.AudioClip,
        audioStart: cc.AudioClip,
        audioReturn: cc.AudioClip,
        audioStar: cc.AudioClip,
        audioTouch: cc.AudioClip,
        newbieShowAttribute: cc.Node,
        newbieTapLeft: cc.Node,
        btnUpgradeMax: cc.Node,
        btnUpgradeStar: cc.Node,
        labelCD: cc.Label
    },

    // use this for initialization
    onLoad: function () {
        GameManager.instance.updateScene(Types.sceneType.NORMAL);

        if(GameManager.instance.playerSceneIndex == 1){
            this.onLeft();
            GameManager.instance.playerSceneIndex = 0;
        }

        this.updateButtons();
        this.newbieTapLeft.active = false;
        this.newbieShowAttribute.active = UserDataManager.instance.getNewbieData().isShowAttrLevelUp();
    },

    updateButtons: function(){
        this.btnUpgradeMax.active = !UserDataManager.instance.getUserData().toMaxEnable();
        this.btnUpgradeStar.active = UserDataManager.instance.getUserData().starUpEnable();
    },

    start: function(){
        var timeStamp = GameManager.instance.lastTimeStamp;
        if(timeStamp == 0){
            GameManager.instance.resetTimeStamp();
        }

        if(this.btnUpgradeMax.active){
            this.schedule(this.countdown, 1.0);
            this.countdown();
        }
    },

    countdown: function(){
        var now = Math.round(new Date().getTime()/1000);
        var cdSecs =  Constant.instance.CD_DURATION + GameManager.instance.lastTimeStamp - now;
        if(cdSecs <= 0){
            GameManager.instance.resetTimeStamp();
        }

        this.updateCD(cdSecs);
    },

    updateCD: function(secs){
        var formatNumber = function(num){
            return num < 10 ? "0" + num : new String(num);
        }

        var hours = Math.floor(secs/3600);
        secs = secs%3600;
        var mins = Math.floor(secs/60);
        secs = secs%60;

        this.labelCD.string = formatNumber(hours)+ ":"+ formatNumber(mins) +":" + formatNumber(secs);
    },

    onBreak: function(){
        this.maxAttrUI.getComponent("MaxAttrUI").show();
    },

    onStart: function(){
        GameManager.instance.playSound(this.audioStart, false, 1);
        cc.director.loadScene('PlayGame');
    },

    onStarUpgrade:function(){
        if(!UserDataManager.instance.getUserData().isAllAttrMax()){
            return;
        }

        var upgradeUIScript =  this.upgradeUI.getComponent("UpgradeUI");
        upgradeUIScript.onStar();

        this.node.getComponent("StarRenderer").onLoad();
        this.updateButtons();
    },

    onBack:function(){
        this.unschedule(this.countdown);

        GameManager.instance.playSound(this.audioReturn, false, 1);
        cc.director.loadScene('MapGame' + GameManager.instance.entranceID);
    },

    onLeft: function(){
        this.hide();
        var upgradeUIScript =  this.upgradeUI.getComponent("UpgradeUI");
        upgradeUIScript.show();
        GameManager.instance.playSound(this.audioUpgrade, false, 1);
    },

    updateAttrs: function(){
        this.node.getComponent("StarRenderer").onLoad();

        for(let i = 0; i < this.attrItems.length; i ++){
            this.attrItems[i].getComponent("AttributeRenderer").onLoad();
        }
    },

    hide:function () {
        let moveAction = cc.moveTo(0.5,  cc.p(-2000, 0)).easing(cc.easeQuinticActionOut());
        // let delay = cc.delayTime(this.atkStun/1000);
        // let callback = cc.callFunc(this.onAtkFinished, this);
        this.node.runAction(moveAction);
    },

    show: function () {
        let moveAction = cc.moveTo(0.5,  cc.p(0, 0)).easing(cc.easeQuinticActionOut());
        // let delay = cc.delayTime(this.atkStun/1000);
        // let callback = cc.callFunc(this.onAtkFinished, this);
        this.node.runAction(moveAction);
        this.updateAttrs();
        this.updateButtons();
    },

    onNewbieAttrFinished: function () {
        this.newbieShowAttribute.active = false;
        this.newbieTapLeft.active = true;
        cc.log("onNewbieAttrFinished called~~~~~~~~~~~~~");
    },
    
    onNewbieTapLeft: function () {
        // this.hide();
        // var upgradeUIScript =  this.upgradeUI.getComponent("UpgradeUI");
        // upgradeUIScript.show();
        this.newbieTapLeft.active = false;
        this.onLeft();
        cc.log("onNewbieTapLeft called~~~~~~~~~~");
    },
    
    showDetail: function () {
        this.detailUI.getComponent("CommonUI").show();
    },
    
    hideDetail: function () {
        this.detailUI.getComponent("CommonUI").hide();
    }

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
