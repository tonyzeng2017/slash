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

    getItemByType: function(type){
        var items = this.node.children;
        for(var i = 0; i < items.length; i++){
            var renderer = items[i].getComponent("PropItemRenderer");
            if(renderer.buffType == type){
                return renderer;
            }
        }

        return null;
    },

    addBuffItem(buffData){
        cc.log("buff data item count: %s", buffData.count);
        if(buffData.count == 1){
            var buffItem = cc.instantiate(this.propItem);
            buffItem.getComponent("PropItemRenderer").updateDisplay(buffData);
            this.node.addChild(buffItem);
        }else{
            var itemRenderer = this.getItemByType(buffData.ItemType);
            if(itemRenderer){
                itemRenderer.updateDisplay(buffData);
            }
        }
    }

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
