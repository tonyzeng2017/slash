var MetaDataManager = require("MetaDataManager");
var UserDataManager = require("UserDataManager");
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
        storeItemPrefeb: cc.Prefab,
        scrollViewContent: cc.Node,
        scrollView: cc.ScrollView,
        textGold: cc.Label,
        audioShop: cc.AudioClip,
        audioShopClose: cc.AudioClip,
        buySuccessAni: cc.Node,
        arrow_left: cc.Node,
        arrow_right: cc.Node
    },

    // use this for initialization
    start: function () {
        this.scrollView.node.on('scrolling', this.onScrolling, this);
        this.onScrolling();
    },

    onScrolling: function(){
        this.arrow_left.active = this.scrollViewContent.x < -435;
        this.arrow_right.active = this.scrollViewContent.x > -435-(this.scrollViewContent.width - 870)
        // cc.log("on scrolling content x:%s", this.content.x);
    },

    // use this for initialization
    onLoad: function () {
        let   ITEM_WIDTH = 195;
        let   MARGIN_X = 15;
        let   GAP_WIDTH = 20;

        let shopData = MetaDataManager.getShopData();
        let itemsArray = [];
        for(var key in shopData){
            if(shopData[key].ShopType == 0){
                itemsArray.push(shopData[key]);
            }
        }

        cc.log("items length: %s", itemsArray.length);
        let len = itemsArray.length;
        for(let i = 0; i < len; i++){
            let item = cc.instantiate(this.storeItemPrefeb);
            item.x = MARGIN_X + ITEM_WIDTH/2 + i * (ITEM_WIDTH + GAP_WIDTH);
            item.y = 250;
            item.getComponent("StoreItemRenderer").render(itemsArray[i]);
            this.scrollViewContent.addChild(item);
        }
        this.scrollViewContent.width = MARGIN_X + (ITEM_WIDTH + GAP_WIDTH) * len;

        var self = this;
        this.node.on('gold_changed', function (event) {
            // event.stopPropagation();
            self.updateGold();
        });

        this.node.on("buy_success", function (event) {
            event.stopPropagation();
            self.onBuySuccess();
        });
        this.updateGold();
    },
    
    onBuySuccess: function () {
        this.buySuccessAni.active = true;
        let anim = this.buySuccessAni.getComponent(cc.Animation);
        anim.play();
        anim.on('finished',  this.onAniFinished, this);
    },

    onAniFinished: function () {
        this.buySuccessAni.getComponent(cc.Animation).off('finished', this.onAniFinished, this);
        this.buySuccessAni.active = false;
    },

    onClose: function(){
        this.node.active = false;
        GameManager.instance.playSound(this.audioShopClose, false, 1);
    },

    updateGold: function(){
        this.textGold.string = UserDataManager.instance.getUserData().gold.value;
    },

    show: function(){
        this.node.active = true;
        this.node.getComponent(cc.Animation).play();
        GameManager.instance.playSound(this.audioShop, false, 1);
        cc.log("storeUI show called~~~~~~~~~~~~~, audio: %s", this.audioShop);
        TD.getProxy().onEvent("enter_shop", "");
    }

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
