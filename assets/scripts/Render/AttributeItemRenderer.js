const MetaDataManager = require("MetaDataManager");
const GameManager = require("GameManager");
var UserDataManager = require("UserDataManager");
var AttributeName = require("Types").AttributeName;
var TipsManager = require("TipsManager");

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
        attrID: 1,
        pgNode: cc.Node,
        textCost: cc.Label,
        textName: cc.Label,
        textValue: cc.Label,
        iconAttr: cc.Sprite,
        nodeIconFrames: cc.Node,
        audioAdd: cc.AudioClip,
        audioSub: cc.AudioClip
    },

    // use this for initialization
    onLoad: function () {
        this.spMaxLevel = this.node.getChildByName("battle-label_max");
        this.iconCost = this.node.getChildByName("battle-shop-icon_product");

        let star = UserDataManager.instance.getUserData().star;
        let level = UserDataManager.instance.getUserData().getAttrLevel(this.attrID);
        let propertyData = MetaDataManager.getPlayerPropertyByLevelAndID(level , this.attrID);
        if(propertyData) {
            this.textValue.string = propertyData.PropertyValue;
        }
        let attrData = MetaDataManager.getAttributeDataByID(this.attrID);
        this.textName.string = attrData.PropertyName;
        let iconFrames = this.nodeIconFrames.getComponent("AttrIconFrames").iconFrames;
        this.iconAttr.spriteFrame = iconFrames[this.attrID - 1];

        let data = UserDataManager.instance.getUserData().getCurrentPlayerAttr(this.attrID);
        let isMaxLevel = UserDataManager.instance.getUserData().isAttrMaxLevel(this.attrID);
        if(isMaxLevel){
            this.iconCost.active = false;
            this.textCost.node.active = false;
            this.spMaxLevel.active = true;
            this.textCost.string = "";
        }else{
            this.iconCost.active = true;
            this.textCost.node.active = true;
            this.spMaxLevel.active = false;
            this.textCost.string = data.cost;
        }
        //cc.log("attrID: %s, isMaxLevel: %s, cost: %s, textCostActive: %s", this.attrID, isMaxLevel, data.cost, this.textCost.active);
        this.updateProgress();
    },

    updateProgress:function(){
        let star = UserDataManager.instance.getUserData().star;
        let maxLevel = MetaDataManager.getMaxLevelByStarAndID(star, this.attrID);
        let minLevel = MetaDataManager.getMinLevelByStarAndID(star, this.attrID);
        let level = UserDataManager.instance.getUserData().getAttrLevel(this.attrID);
        let count = Math.floor(10 * (level - minLevel) /(maxLevel - minLevel ));
        cc.log("progress count: %s", count);
        for(let i = 1; i <= 10; i++){
            let child = this.pgNode.getChildByName("battle-pg-" + i);
            child.active = i <= count;
        }
    },

    onLevelUp:function(){
        cc.log("attribute level up~~");
        if(UserDataManager.instance.getUserData().isAttrMaxLevel(this.attrID)){
            TipsManager.init.showTips("属性已满级~");
            return;
        }

        let data = UserDataManager.instance.getUserData().getCurrentPlayerAttr(this.attrID);
        let gold = UserDataManager.instance.getUserData().gold;
        if(gold >= data.cost){
            UserDataManager.instance.getUserData().addLevel(this.attrID);
            UserDataManager.instance.getUserData().costGold(data.cost);
            this.node.dispatchEvent( new cc.Event.EventCustom('gold_changed', true));
            this.node.dispatchEvent( new cc.Event.EventCustom('level_changed', true));
            this.onLoad();
            GameManager.instance.playSound(this.audioAdd, false, 1);

            let dataUP = UserDataManager.instance.getUserData().getCurrentPlayerAttr(this.attrID);
            var dcAttrName = AttributeName[this.attrID - 1] + "_up";
            TD.getProxy().onEvent(dcAttrName, {number: dataUP.PropertyValue - data.PropertyValue});
        }else{
            TipsManager.init.showTips("灵石不足~");
        }
    },
    
    onLevelDown:function () {
		let star = UserDataManager.instance.getUserData().star;
		let curLevel = UserDataManager.instance.getUserData().getAttrLevel(this.attrID);
        let minLevel = MetaDataManager.getMinLevelByStarAndID(star, this.attrID);
        if(curLevel <= minLevel){
            return false;
        }
        
        let curData = UserDataManager.instance.getUserData().getCurrentPlayerAttr(this.attrID);
		let data = UserDataManager.instance.getUserData().getPrePlayerAttr(this.attrID);
		let cost = data && data.cost ? data.cost : 0;
		UserDataManager.instance.getUserData().addGold(cost);
		this.node.dispatchEvent( new cc.Event.EventCustom('gold_changed', true));
        
		UserDataManager.instance.getUserData().subLevel(this.attrID);
		this.node.dispatchEvent( new cc.Event.EventCustom('level_changed', true));
        this.onLoad();

        var dcAttrName = AttributeName[this.attrID - 1] + "_down";
        TD.getProxy().onEvent(dcAttrName, {number: curData.PropertyValue - data.PropertyValue});

        GameManager.instance.playSound(this.audioSub, false, 1);
    }
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
