var MetaDataManager = require("MetaDataManager");
// var CryptoJS = require("crypto-js");
var UserDataManager = require("UserDataManager");
var Constant = require("Constant");
var preLoadScenes = ["EntranceGame","MapGame1", "PlayGame"];

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
        loadingUI: cc.Node,
    },

    preloadScene: function(index){
        var self = this;

        this.node.runAction(cc.sequence(
            cc.delayTime(0.01 * index),
            cc.callFunc( function(){
                cc.log("%s preloaded~~~~~, index: %s", preLoadScenes[index], index);
                cc.director.preloadScene(preLoadScenes[index] , function(){
                    cc.log("%s preloaded~~~~~", preLoadScenes[index]);

                    if(index ==  0){
                        self.onLoadCompleted();
                    }
                });
            })
        ))
    },

    onLoadCompleted: function(){
        this.isCompleted = true;
        this.loadingUI.active = false;
        this.btnStart.active = true;
        TDProxy.onEvent("game_load_completed", UserDataManager.instance.getUserData().getDCData());
    },

    // use this for initialization
    onLoad: function () {
        var self = this;

        TDProxy.onEvent("enter_game", UserDataManager.instance.getUserData().getDCData());
        // cc.Texture2D.defaultPixelFormat = cc.Texture2D.PIXEL_FORMAT_RGBA4444;

        cc.log("texture format: %s", cc.Texture2D.defaultPixelFormat);
        MetaDataManager.loadData(
            function () {
                Constant.instance.init();

                for(var i = 0; i < preLoadScenes.length; i++){
                    self.preloadScene(i);
                }

                // self.onLoadCompleted();
            },

            function (progress) {
                cc.log("loading progress: %s", progress);
            },

            this
        );

        var maxOpenStage = UserDataManager.instance.getUserData().getMaxOpenStage();
        cc.log("max openStage: %s", maxOpenStage);
        TDProxy.setAccountLevel(Number(maxOpenStage));

    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
