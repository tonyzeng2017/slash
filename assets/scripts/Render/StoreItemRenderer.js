var UserDataManager = require("UserDataManager");
var GameManager = require("GameManager");
var PaymentProxy = require("PaymentProxy");
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
        // ...
        textName: cc.Label,
        textCount: cc.Label,
        textPrice: cc.Label,
        iconItem: cc.Sprite,
        audioBuy: cc.AudioClip
    },

    // use this for initialization
    onLoad: function () {

    },

    render: function(data){
        this._itemData = data;
        this.textName.string = data.ItemName;
        this.textCount.string = data.ItemNum;
        this.textPrice.string = "￥" + data.MoneyNum;

        var self = this;
        // 加载 SpriteAtlas（图集），并且获取其中的一个 SpriteFrame
        // 注意 atlas 资源文件（plist）通常会和一个同名的图片文件（png）放在一个目录下, 所以需要在第二个参数指定资源类型
        cc.loader.loadRes("tps/ui", cc.SpriteAtlas, function (err, atlas) {
            var frame = atlas.getSpriteFrame(self._itemData.Pic);
            cc.log("store item rendered pic: %s", self._itemData.Pic);
            self.iconItem.spriteFrame = frame;
            cc.loader.setAutoReleaseRecursively(atlas, true);
        });
    },

    onBuy: function(){

        var self = this;
        var callbacks = {
               successCallback: function () {
                   UserDataManager.instance.getUserData().addGold(self._itemData.ItemNum);
                   GameManager.instance.playSound(self.audioBuy, false, 1);
                   self.node.dispatchEvent( new cc.Event.EventCustom('gold_changed', true));
                   self.node.dispatchEvent( new cc.Event.EventCustom('buy_success', true));
               },

               failedCallback: function () {
                   TipsManager.init.showTips("购买失败~");
               },

               cancelCallback: function(){
                   TipsManager.init.showTips("取消购买~");
               }
        };

        PaymentProxy.buyItem(
                                this._itemData.ItemID,
                                this._itemData.ItemName,
                                this._itemData.ItemNum,
                                this._itemData.MoneyNum,
                                callbacks
                            );
    }
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
