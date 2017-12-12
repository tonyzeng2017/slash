var UserDataManager = require("UserDataManager");
var Constant = require("Constant");
var GameManager = require("GameManager");
var PaymentProxy = require("PaymentProxy");
var MetaDataManager = require("MetaDataManager");

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
        attrItems: [cc.Node],
        playerUI: cc.Node,
        upgradeUI: cc.Node,
        audioBreak: cc.AudioClip,
        textCost: cc.Label
    },

    // use this for initialization
    onLoad: function () {
        this.buySuccessAni = this.node.getChildByName("game_win_ani");

        var itemData = MetaDataManager.getShopData()[Constant.instance.SHOPID_ALL_UPGRADE];
        this.textCost.string = "¥" + itemData.MoneyNum;
    },

    onBuySuccess: function () {
        if(this.buySuccessAni){
            this.buySuccessAni.active = true;
            let anim = this.buySuccessAni.getComponent(cc.Animation);
            anim.play();
            anim.on('finished',  this.onAniFinished, this);
        }else{
           cc.log("buy success animation missing~~");
        }
    },

    onAniFinished: function () {
        this.buySuccessAni.getComponent(cc.Animation).off('finished', this.onAniFinished, this);
        this.buySuccessAni.active = false;
        this.hide();
    },

    onBuy: function(){

        var self = this;
        var callbacks = {
            successCallback: function () {
                UserDataManager.instance.getUserData().setMaxLevel();
                self.updateAttrs();
                self.playerUI.getComponent("PlayerUI").updateAttrs();
                self.playerUI.getComponent("PlayerUI").updateButtons();
                self.playerUI.getComponent("PlayerUI").updatePlayer();
                self.upgradeUI.getComponent("UpgradeUI").updateAttrs();
                self.onBuySuccess();
            },

            failedCallback: function () {

            },

            cancelCallback: function(){

            }
        };

        var itemData = MetaDataManager.getShopData()[Constant.instance.SHOPID_ALL_UPGRADE];
        PaymentProxy.buyItem(
                itemData.ItemID,
                itemData.ItemName,
                itemData.ItemNum,
                itemData.MoneyNum,
                callbacks
        );

    },

    show: function(){
        this.node.active = true;
        this.updateAttrs();
        GameManager.instance.playSound(this.audioBreak, false, 1);
        this.node.getComponent(cc.Animation).play();
    },

    updateAttrs:function(){
        for(let i = 0; i < this.attrItems.length; i ++){
            this.attrItems[i].getComponent("AttributeRenderer").onLoad();
        }
    },

    hide: function(){
        this.node.active = false;
    }

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
