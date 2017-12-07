var MetaDataManager = require("MetaDataManager")

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

        animations: [cc.Animation],
        labels: [cc.Label],
        storyID: cc.String,

        skipTimeStamp: {
            default: 0,
            visible: false
        },
        
        loadedTimeStamp: {
            default: 0,
            visible: false
        },

        bgNormal: cc.Node,
        bgRecall: cc.Node
    },

    // use this for initialization
    onLoad: function () {
        this.initWord();
        this.playAnimation();
        this.loadedTimeStamp = new Date().getTime();
    },

    initWord: function(){
        var storyData = MetaDataManager.getStoryDataByID(this.storyID);
        this.bgNormal.active = storyData.IsRecall == 0;
        this.bgRecall.active = storyData.IsRecall == 1;

        if(this.bgNormal.active){
            this.bgNormal.runAction(cc.fadeIn(0.5));
        }

        if(this.bgRecall.active){
            this.bgRecall.runAction(cc.fadeIn(0.5));
        }

        var words = storyData.Word.split("|");
        for(var i = 0; i < this.labels.length; i++){    
            if(words[i]){
                this.labels[i].string = words[i];
            }else{
                this.labels[i].string = "";
            }
        }

        this._animationFinished = false;
        this._words = words;
    },

    setStoryAndCallback: function(storyID, finishCallback){
        this.storyID = storyID;
        this._finishCallback = finishCallback;
    },

    playAnimation: function(){
        var self = this;
        var count = 0;

        var doDelay = function(){

            self.node.runAction(cc.sequence(cc.delayTime(1), cc.callFunc(
                function(){     
                    self.node.active = false;
                    if(self._finishCallback){
                        self._finishCallback();
                    }
                })));
        };

        var finished = function(){
            cc.log("animation finished: %s", count);
            count++;
            if(self.animations[count] && self._words[count]){
                self.animations[count].play();
            }else{
                for(var i = 0; i < self.animations.length; i++){ 
                    self.animations[i].off("finished", finished, true);
                }

                this._animationFinished = true;
                doDelay();
            }
        }

        for(var i = 0; i < this.animations.length; i++){
            this.animations[i].on("finished", finished, true);
        }

        if(this._words[count]){
            this.animations[count].play();
            cc.log("animation played~~~~~~~~");
        }
    },

    onSkip: function(){
        this.node.stopAllActions();
        for(var i = 0; i < this.animations.length; i++){
            this.animations[i].stop();
            this.animations[i].node.width = 810;
        }
        this.skipTimeStamp = new Date().getTime();

        cc.log("animation skipped~~~~~~~~~~~");
    },

    onNext: function(){
        this.node.active = false;
        if(this._finishCallback){
            this._finishCallback();
        }
    },

    onGlobalTap: function(event){
        cc.log("event.target: %s", event.target.toString());
        if(event.target != this.bgNormal && event.target != this.bgRecall){
            return;
        }
        var now = new Date().getTime();
        if(now - this.loadedTimeStamp < 1000){
            // cc.log("time not enough, back~~");
            return;
        }

        if(this._animationFinished){
            this.onNext();
        }else{
            if(this.skipTimeStamp == 0){
                this.onSkip();
            }else{

                if(now - this.skipTimeStamp >= 1000){
                    this.onNext();
                }
            }
        }
    }

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
