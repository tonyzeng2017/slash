var GameManager = require("GameManager");
var Types = require("Types");

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

        settingUI: cc.Prefab,
        storyUI: cc.Prefab
    },

    // use this for initialization
    onLoad: function () {
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

    showSettings: function(){
        this._settingsUI.getComponent("SettingsUI").show();
    },

    showStory: function(){
        var storyUI = cc.instantiate(this.storyUI);
        this.node.addChild(storyUI);
    }

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
