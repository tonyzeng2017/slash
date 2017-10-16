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
        text_total_reward: cc.Label,
        text_combo_reward: cc.Label,
        text_score_reward:  cc.Label,
        text_kill_reward:  cc.Label,
        isWin: false,
    },

    // use this for initialization
    onLoad: function () {
    },

    render: function(){
        var gameData = UserDataManager.instance.getGameData();
        gameData.updateReward();
        this.text_total_reward.string = gameData.getTotalReward(this.isWin);
        UserDataManager.instance.getUserData().addGold(gameData.getTotalReward(this.isWin));

        if(this.text_combo_reward){
            this.text_combo_reward.string = gameData.comboReward;
        }

        if(this.text_score_reward){
            this.text_score_reward.string = gameData.scoreReward;
        }

        if( this.text_kill_reward){
            this.text_kill_reward.string = gameData.slashReward;
        }
    }
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
