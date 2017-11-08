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
        max_height: {
            visible: false,
            default: 286
        },

        bottom: {
            visible: false,
            default: -87
        }
    },

    // use this for initialization
    onLoad: function () {
        this.gameDataModel = UserDataManager.instance.getGameData();
        this.showScore();
    },

    playAnim: function(){
        var currentScore = this.gameDataModel.getFinalScore();
        // var scoreLevel = this.gameDataModel.getScoreLevel();
        var maxScore = this.gameDataModel.getMaxLevelScore();

        var scaleY = Math.min(1, currentScore/maxScore);
        var barHeight = this.max_height *  scaleY;
        
        //this.arrowCurrent.y = this.bottom;//this.bottom + this.blueBar.height;
        this.arrowCurrent.runAction(cc.moveBy(0.5, cc.p(0, barHeight)));
        cc.log("scaleY: %s, barHeight: %s", scaleY, barHeight);
        var self = this;
        if(currentScore >= maxScore){
            this.blueBar.runAction(cc.spawn(cc.scaleTo(0.5, 1,  scaleY), 
                    cc.sequence(cc.delayTime(0.3), cc.spawn(cc.fadeOut(0.2), 
                                                            cc.callFunc(
                                                                function(){
                                                                    self.yellowBar.runAction(cc.fadeIn(0.2))
                                                                }
                                                              )))
            ));
        }else{
            this.blueBar.runAction(cc.scaleTo(0.5, 1,  scaleY));
        }
    },

    showScore: function(){
        var currentScore = this.gameDataModel.getFinalScore();
        var scoreLevel = this.gameDataModel.getScoreLevel();
        var maxScore = this.gameDataModel.getMaxLevelScore();
        this.txtHighest.string = maxScore;
        this.blueBar.scaleY = 0;//this.max_height *  Math.min(1, currentScore/maxScore);
        this.arrowCurrent.y = this.bottom;//this.bottom + this.blueBar.height;
        this.nextScoreNode.active = false;

        /*if(currentScore >= maxScore){
            this.nextScoreNode.active = false;
            //to play a animation;
            this.yellowBar.active = true;

        }else{
            this.nextScoreNode.active = false;
            this.yellowBar.active = false;
            // var nextLevelScore = this.gameDataModel.getScoreByLevel(scoreLevel + 1);
            // this.txtNext.string = nextLevelScore;
            // this.nextScoreNode.y = this.bottom + this.max_height * nextLevelScore/maxScore; 
        }*/
    }

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
