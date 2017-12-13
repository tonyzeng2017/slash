var MetaDataManager = require("MetaDataManager");
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
        title: cc.Label,
        itemNormal: cc.Sprite,
        itemDisable: cc.Node,
        itemFrames: [cc.SpriteFrame],
        openAnim: cc.Animation,
        title_disable: cc.Label
    },

    // use this for initialization
    onLoad: function () {

    },

    getStoryID: function(){
        return this._storyData.storyID;
    },

    init: function(storyData){
        this._storyData = storyData;
    },

    initNode: function(){
        var rawData = this._storyData.getRawData();
        if(!rawData){
            return;
        }

        this.title.string = rawData.Name;
        this.title_disable.string = rawData.Name;
        cc.log("story name: %s", rawData.Name);

        this.itemNormal.node.active = this._storyData.opened;
        this.itemDisable.active = !this._storyData.opened;

        if(this.itemNormal.node.active){
            this.itemNormal.spriteFrame = this.itemFrames[Number(rawData.Pic) - 1];
        }
    },

    render: function(){
        var onOpened = function(){
            UserDataManager.instance.getStoryData().openStory(this._storyData.storyID);
            this.openAnim.off("finished", onOpened, true);
            this.initNode();
        };

        this.initNode();
        if(this._storyData.enabled && !this._storyData.opened){
            this.openAnim.play();
            this.openAnim.on("finished", onOpened.bind(this), true);
        }
    }
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
