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
        btnSkip: cc.Node,
        btnNext: cc.Node
    },

    // use this for initialization
    onLoad: function () {
        this.initWord();
        this.playAnimation();
    },

    initWord: function(){
        var storyData = MetaDataManager.getStoryDataByID(this.storyID);
        var words = storyData.Word.split("|");
        for(var i = 0; i < this.labels.length; i++){    
            if(words[i]){
                this.labels[i].string = words[i];
            }else{
                this.labels[i].string = "";
            }
        }

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

                doDelay();
            }
        }

        for(var i = 0; i < this.animations.length; i++){
            this.animations[i].on("finished", finished, true);
        }

        if(this._words[count]){
            this.animations[count].play();
        }
    },

    onSkip: function(){
        this.node.stopAllActions();
        for(var i = 0; i < this.animations.length; i++){
            this.animations[i].stop();
            this.animations[i].node.width = 810;
        }

        this.btnNext.active = true;
        this.btnSkip.active = false;
    },

    onNext: function(){
        this.node.active = false;
        if(this._finishCallback){
            this._finishCallback();
        }
    }

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
