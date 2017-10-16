var MetaDataManager = require("MetaDataManager");
// var CryptoJS = require("crypto-js");
var UserDataManager = require("UserDataManager");
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
        isCompleted: false,
        btnStart: cc.Node,
        loadingUI: cc.Node
    },

    // use this for initialization
    onLoad: function () {
        var self = this;

        TDProxy.onEvent("enter_game", UserDataManager.instance.getUserData().getDCData());

        MetaDataManager.loadData(
            function(){
                Constant.instance.init();
                self.isCompleted = true;
                self.loadingUI.active = false;
                self.btnStart.active = true;
                TDProxy.onEvent("game_load_completed", UserDataManager.instance.getUserData().getDCData());
            },

            function(progress){
                cc.log("loading progress: %s", progress);
            }
        );

        var maxOpenStage = UserDataManager.instance.getUserData().getMaxOpenStage();
        cc.log("max openStage: %s", maxOpenStage);
        TDProxy.setAccountLevel(Number(maxOpenStage));

    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
