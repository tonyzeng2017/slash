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

        txtHighest: cc.Label,
        txtNext: cc.Label,
        blueBar: cc.Node,
        yellowBar: cc.Node,
        arrowCurrent: cc.Node,
        nextScoreNode: cc.Node,
        max_height: 286,
    },

    // use this for initialization
    onLoad: function () {
        this.gameDataModel = UserDataManager.instance.getGameData();
        this.showScore();
    },

    showScore: function(){
        var currentScore = this.gameDataModel.getFinalScore();
        var scoreLevel = this.gameDataModel.getScoreLevel();
        var maxScore = this.gameDataModel.getMaxLevelScore();
        this.txtHighest.string = maxScore;
        this.blueBar.height = this.max_height *  Math.min(1, currentScore/maxScore);
        this.arrowCurrent.y = this.blueBar.y + this.blueBar.height;

        if(this.gameDataModel.isMaxLevel(scoreLevel)){
            this.nextScoreNode.active = false;
            //to play a animation;
            this.yellowBar.active = true;
            this.blueBar.active = false;
        }else{
            this.nextScoreNode.active = true;
            var nextLevelScore = this.gameDataModel.getScoreByLevel(scoreLevel + 1);

            this.txtNext.string = nextLevelScore;
            this.nextScoreNode.y = this.blueBar.y + this.max_height * nextLevelScore/maxScore; 
        }


    }

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
