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
        text_total_score: cc.Label,
        text_highest_score: cc.Label,
        text_kills: cc.Label,
        text_highest_combo: cc.Label
    },

    // use this for initialization
    onLoad: function () {
        // this.text_total_score = this.panel.getChildByName("text_total_score");
        // this.text_highest_score = this.panel.getChildByName("text_highest_score");
        // this.text_highest_combo = this.panel.getChildByName("text_highest_combo");
        // this.text_kills = this.panel.getChildByName("text_kills");
    },

    render: function(){
        this.text_total_score.string = UserDataManager.instance.getGameData().totalScore;
        this.text_highest_score.string = UserDataManager.instance.getGameData().highestScore;
        this.text_highest_combo.string = UserDataManager.instance.getGameData().highestCombo;
        this.text_kills.string = UserDataManager.instance.getGameData().highestSlashCount;
        // this.text_highest_score.string = "0";
        // this.text_highest_combo = "0";
        // this.text_kills.string = "0";
        cc.log("game win score updated~~~~~~~~~~~~~~ score: %s", this.text_total_score.string );
    }

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
