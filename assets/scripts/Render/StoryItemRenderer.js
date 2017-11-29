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
    },

    // use this for initialization
    onLoad: function () {

    },

    render: function(storyData){
        var rawData = storyData.getRawData();
        if(!rawData){
            return;
        }

        this.title.string = rawData.Name;
        cc.log("story name: %s", rawData.Name);

        var onOpened = function(){
            UserDataManager.instance.getStoryData().openStory(storyData.storyID);
            
        };

        this.itemNormal.active = storyData.opened;
        this.itemDisable.active = !storyData.opened;
        if(storyData.enabled && !storyData.opened){
            this.openAnim.play();
            this.openAnim.on("finished", onOpened, true);
        }
    }
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
