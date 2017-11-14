var GameManager = require("GameManager");
var UserDataManager = require("UserDataManager");
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
        // storeUI: cc.Prefeb
        storeUI: cc.Prefab,
        audioReturn: cc.AudioClip,
        audioTouch: cc.AudioClip,
        newbieEnterPlayer: cc.Node,
        textGold: cc.Label,
        story: cc.Prefab
    },

    // use this for initialization
    onLoad: function () {
        this._shopUI = cc.instantiate(this.storeUI);
        this._shopUI.x = 0;
        this._shopUI.y = 0;
        this._shopUI.active = false;
        this.node.addChild(this._shopUI);
        GameManager.instance.updateScene(Types.sceneType.NORMAL);

        if(this.newbieEnterPlayer){
            this.newbieEnterPlayer.active = UserDataManager.instance.getNewbieData().isShowAttrLevelUp();
        }

        this.updateGold();
        var self = this;
        this.node.on('gold_changed', function (event) {
            // event.stopPropagation();
            self.updateGold();
        });

        this.initStory();
    },

    initStory: function(){
           var entranceData = GameManager.instance.getCurEntranceData();
           if(GameManager.instance.storyEnabled(entranceData.Story)){
                var storyUI = cc.instantiate(this.story);
                storyUI.getComponent("StoryRenderer").setStoryAndCallback(entranceData.Story);
                this.node.addChild(storyUI);

                GameManager.instance.playStory(entranceData.Story);
           }
    },

    updateGold: function(){
        this.textGold.string = UserDataManager.instance.getUserData().gold;
    },

    // openStage: function(event, data){
    //     cc.log("goto open stage~: " + data.toString());
    //     GameManager.instance.curStageID = data;
    //     cc.director.loadScene('PlayerScene');
    // },

    onReturn: function(){
        //to clear the current stage;
        GameManager.instance.updateStage(-1, false);

        GameManager.instance.playSound(this.audioReturn, false, 1);
        cc.director.loadScene('EntranceGame');
    },

    onShop: function(){
        this._shopUI.getComponent("StoreUI").show();
        //GameManager.instance.playSound(this.audio, false, 1);
    },
    
    showPlayer: function () {
        cc.director.loadScene('PlayerScene');
        GameManager.instance.playSound(this.audioTouch, false, 1);
    }

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
