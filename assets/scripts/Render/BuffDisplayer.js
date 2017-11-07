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
        propItem: cc.Prefab
    },

    // use this for initialization
    onLoad: function () {
        this.node.removeAllChildren();   
    },

    addBuffItem(buffType){
        var buffItem = cc.instantiate(this.propItem);
        buffItem.getComponent("PropItemRenderer").updateDisplay(buffType);
        this.node.addChild(buffItem);
    }

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
