var MetaDataManager = require("MetaDataManager");
var PaymentProxy = require("PaymentProxy");
var Constant = require("Constant");
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

        txtPrice: cc.Label,
        btnPayRevive: cc.Node,
        btnFreeRevive: cc.Node
    },

    init:function(game){
        this._game = game;
        var width = cc.director.getWinSize().width/2;
        var height = cc.director.getWinSize().height/2;
        this.node.x = width;
        this.node.y = height;
    },

    onClose: function(){
        this.hide();
        this._game.gameOver(false);
    },

    hide: function(){
        this.node.active = false;
    },
    // use this for initialization
    onLoad: function () {
        this._itemData = MetaDataManager.getShopData()[Constant.instance.SHOPID_REVIVE];
        this.txtPrice.string = this._itemData.MoneyNum;

        this.updateState();
    },

    updateState: function(){
        var canReviveFree = UserDataManager.instance.getUserData().canReviveFree();
        this.btnPayRevive.active = !canReviveFree;
        this.btnFreeRevive.active = canReviveFree;
    },

    onAdRevive: function(){
        this.hide();
        this._game.revive();
    },

    onPayRevive: function(){

        var self = this;
        var callbacks = {
            successCallback: function () {
                cc.log("pay revive success~~~~~~~~~~");
                self.hide();
                self._game.revive();
            },

            failedCallback: function () {

            },

            cancelCallback: function(){

            }
        };

        PaymentProxy.buyItem(
            this._itemData.ItemID,
            this._itemData.ItemName,
            this._itemData.ItemNum,
            this._itemData.MoneyNum,
            callbacks
        );
    },

    onFreeRevive: function(){
        cc.log("free revive success~~~~~~~~~~");
        this.hide();
        this._game.revive();
    },

    show: function(){
        this.node.active = true;
    }
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
