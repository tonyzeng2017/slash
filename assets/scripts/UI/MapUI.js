var GameManager = require("GameManager");
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
        // storeUI: cc.Prefeb
        storeUI: cc.Prefab,
        audioReturn: cc.AudioClip,
        newbieEnterPlayer: cc.Node
    },

    // use this for initialization
    onLoad: function () {
        this._shopUI = cc.instantiate(this.storeUI);
        this._shopUI.x = 0;
        this._shopUI.y = 0;
        this._shopUI.active = false;
        this.node.addChild(this._shopUI);

        if(this.newbieEnterPlayer){
            this.newbieEnterPlayer.active = UserDataManager.instance.getNewbieData().isShowAttrLevelUp();
        }
    },

    openStage: function(event, data){
        cc.log("goto open stage~: " + data.toString());
        GameManager.instance.curStageID = data;
        cc.director.loadScene('PlayerScene');
    },

    onReturn: function(){
        GameManager.instance.playSound(this.audioReturn, false, 1);
        cc.director.loadScene('EntranceGame');
    },

    onShop: function(){
        this._shopUI.getComponent("StoreUI").show();
        //GameManager.instance.playSound(this.audio, false, 1);
    },
    
    showPlayer: function () {
        cc.director.loadScene('PlayerScene');
    }

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
