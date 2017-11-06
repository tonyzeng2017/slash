var IOUtil = require("IOUtil")
var CryptoJS = require("crypto-js");
var Types = require("Types");
var GameManager = require("GameManager");
var UserDataManager = require("UserDataManager");

cc.Class({
    extends: cc.Component,

    properties: {
        // menuAnim: {
        //     default: null,
        //     type: cc.Animation
        // },
        // menuParticle: {
        //     default: null,
        //     type: cc.ParticleSystem
        // },
        btnGroup: {
            default: null,
            type: cc.Node
        },

        audioStart: cc.AudioClip,
        settingUI: cc.Prefab
    },

    // use this for initialization
    onLoad: function () {
        this.metaMng = this.node.getComponent("MetaDataMng");

        var width = cc.director.getWinSize().width/2;
        var height = cc.director.getWinSize().height/2;
        cc.log("homeUI onload: %s, %s~~~~~~~~~~~~~~~", width, height);
        GameManager.instance.updateScene(Types.sceneType.NORMAL);

        this.initSerttings();
    },

    initSerttings: function(){
        this._settingsUI = cc.instantiate(this.settingUI);
        this._settingsUI.x = 0;
        this._settingsUI.y = 0;
        this._settingsUI.active = false;
        this.node.addChild(this._settingsUI);
    },

    start: function () {
        // cc.eventManager.pauseTarget(this.btnGroup, true);
        // this.scheduleOnce(function() {
        //     this.menuAnim.play();
        //     this.menuParticle.enabled = false;
        // }.bind(this), 2);
        cc.log("animation name or arrow: %s", Types.ProjectileBrokeAnimation[Types.ProjectileType.Javelin]);
    },

    showParticle: function () {
        // this.menuParticle.enabled = true;
    },

    enableButtons: function () {
        cc.eventManager.resumeTarget(this.btnGroup, true);
    },

    playGame: function () {
        if(!this.metaMng.isCompleted){
            return;
        }
        GameManager.instance.playSound(this.audioStart, false, 1);

        cc.eventManager.pauseTarget(this.btnGroup, true);
        cc.director.loadScene('EntranceGame');
        TDProxy.onEvent("start_game", {});
        //G.analytics_plugin.logEvent("startGame", UserDataManager.instance.getUserData().getDCData());
    },

    showSettings: function(){
        this._settingsUI.getComponent("SettingsUI").show();
    }
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
