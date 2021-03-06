var MetaDataManager = require("MetaDataManager");
// var CryptoJS = require("crypto-js");
var UserDataManager = require("UserDataManager");
var Constant = require("Constant");
var preLoadScenes = MetaDataManager.getPreLoadScenes();
const Types = require('Types');
var GameConfig = require("GameConfig");

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
        bar: cc.Node,
        barbg: cc.Node,
        textPercent: cc.Label
    },

    preloadScene: function(index){
        var self = this;

        this.node.runAction(cc.sequence(
            cc.delayTime(0.01 * index),
            cc.callFunc( function(){
                cc.log("%s preloaded~~~~~, index: %s", preLoadScenes[index], index);
                cc.director.preloadScene(preLoadScenes[index] , function(){
                    cc.log("%s preloaded~~~~~", preLoadScenes[index]);

                    self.updateProgress(index);
                    if(index ==  preLoadScenes.length - 1){
                        self.onLoadCompleted();
                    }
                });
            })
        ))
    },

    updateProgress: function(index){
        var metaCount = MetaDataManager.getMetaCount();
        cc.log("metaCount:  %s", metaCount);

        this.destProgress =  (index + 1  + metaCount)/(metaCount + preLoadScenes.length);
        this.textPercent.string = Math.ceil(this.destProgress*100) + "%";
        this.curProgress = this.bar.width/1120;
        this.timer = 0;
        this.isLerping = true;
    },
    
    onLoad: function(){
        // var self = this;
        // MetaDataManager.loadMetaData("Config" , function(data){
        //     cc.log("TDEnabled: %s", data.TDEnabled);
        // });
        // var fullName = jsb.fileUtils.fullPathFromRelativeFile("resources/SlashConfig.json");
        // cc.log("fullPathForFilename: %s", fullName); 
        // var fileContent = jsb.fileUtils.getStringFromFile(fullName);
        // cc.log("file content: %s", fileContent);
        // var config = JSON.parse(fileContent);

        var paths = jsb.fileUtils.getSearchPaths();
        for(var i = 0; i < paths; i ++){
            cc.log("search path: %s", paths[i]);
        }
    },

    onLoadCompleted: function(){
        this.isCompleted = true;
        this.loadingUI.active = false;
        this.btnStart.active = true;
        TD.getProxy().onEvent("game_load_completed", UserDataManager.instance.getUserData().getDCData());
    },

    // use this for initialization
    start: function () {
        var self = this;
        var size = cc.director.getVisibleSize();
        cc.log("width: %s, height: %s, tdDisabled: %s", size.width, size.height, GameConfig.self.tdDisabled);
        this.curProgress = 0;
        this.destProgress = 0;
        this.lerpDuration = 0.2;
        this.isLerping = false;
        this.timer = 0;

        TD.getProxy().onEvent("enter_game", UserDataManager.instance.getUserData().getDCData());
        // cc.Texture2D.defaultPixelFormat = cc.Texture2D.PIXEL_FORMAT_RGBA4444;

        cc.log("attribute type: %s, %s", Types.AttributeType.ATK_DURATION, Types.AttributeType.HP);
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
                // self.bar.width = 1120 * progress;
                self.textPercent.string = Math.ceil(progress*100) + "%";
                self.curProgress = self.bar.width/1120;
                self.destProgress = progress;
                self.timer = 0;
                self.isLerping = true;
            },

            this
        );

        var maxOpenStage = UserDataManager.instance.getUserData().getMaxOpenStage();
        cc.log("max openStage: %s", maxOpenStage);
        TD.getProxy().setAccountLevel(Number(maxOpenStage));
    },

        // called every frame, uncomment this function to activate update callback
    update: function (dt) {
        if (this.isLerping === false) {
            return;
        }
        this.timer += dt;
        if (this.timer >= this.lerpDuration) {
            this.timer = this.lerpDuration;
            this.isLerping = false;
        }
        var progress = cc.lerp(this.curProgress, this.destProgress, this.timer/this.lerpDuration);
        this.bar.width = 1120 * progress;

        if(progress >= 1.0){
            this.bar.active = false;
            this.textPercent.node.active = false;
            this.barbg.active = false;
        }
    }

});
