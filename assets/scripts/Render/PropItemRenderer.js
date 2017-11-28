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
        frames: [cc.SpriteFrame],
        displayText: cc.Label,
        icon: cc.Sprite,

        buffType: {
            visible: false,
            default: 1
        }
    }, 

    // use this for initialization
    onLoad: function () {
        
    },

    updateDisplay(buffData){
        this.buffType = buffData.ItemType;
        var item = MetaDataManager.getBuffItemByType(this.buffType);
        this.icon.spriteFrame = this.frames[this.buffType - 1];

        var displayStr = MetaDataManager.getBuffDisplayData(this.buffType, buffData.count);
        this.displayText.string = displayStr;
    }

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
