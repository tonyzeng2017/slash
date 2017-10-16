const MetaDataManager = require("MetaDataManager");
const GameManager = require("GameManager");
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
        upgradeUI : cc.Node,
        detailUI: cc.Node,
        maxAttrUI:  cc.Node,
        attrItems: [cc.Node],
        btnUpgrade: cc.Node,
        audioUpgrade: cc.AudioClip,
        audioStart: cc.AudioClip,
        audioReturn: cc.AudioClip,
        audioStar: cc.AudioClip,
        newbieShowAttribute: cc.Node,
        newbieTapLeft: cc.Node,
        btnUpgradeLevel: cc.Node
    },

    // use this for initialization
    onLoad: function () {
        if(GameManager.instance.playerSceneIndex == 1){
            this.onLeft();
            GameManager.instance.playerSceneIndex = 0;
        }
        if(this.btnUpgradeLevel){
            this.btnUpgradeLevel.active = !UserDataManager.instance.getUserData().isBest();
        }
        this.btnUpgrade.active = UserDataManager.instance.getUserData().isAllAttrMax();

        this.newbieTapLeft.active = false;
        this.newbieShowAttribute.active = UserDataManager.instance.getNewbieData().isShowAttrLevelUp();
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
        this.btnUpgrade.active = UserDataManager.instance.getUserData().isAllAttrMax();
    },

    onBack:function(){
        // cc.director.loadScene('StartGame');
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
        this.btnUpgrade.active = UserDataManager.instance.getUserData().isAllAttrMax();
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
        this.detailUI.active = true;
    },
    
    hideDetail: function () {
        this.detailUI.active = false;
    }

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
