const MetaDataManager = require("MetaDataManager");
var UserDataManager = require("UserDataManager");

cc.Class({
    extends: cc.Component,

    properties: {
        iconFrameNode: cc.Node,
        attrID: 1,
        textValue: cc.Label,
        textName: cc.Label,
        iconAttr: cc.Sprite,
        isMax: false
    },

    // use this for initialization
    onLoad: function () {
        // let star = UserDataManager.instance.getUserData().star;
        // let level = UserDataManager.instance.getUserData().getAttrLevel(this.attrID);
        // let propertyData = MetaDataManager.getPlayerPropertyByLevelAndID(level , this.attrID);
        let propertyData = UserDataManager.instance.getUserData().getCurrentPlayerAttr(this.attrID);
        if(this.isMax){
            propertyData = UserDataManager.instance.getUserData().getMaxPlayerAttr(this.attrID);
        }
        if(propertyData) {
            this.textValue.string = propertyData.PropertyValue;
        }
        let attrData = MetaDataManager.getAttributeDataByID(this.attrID);
        this.textName.string = attrData.PropertyName;

        var self = this;
        cc.loader.loadRes("tps/ui", cc.SpriteAtlas, function (err, atlas) {
            var frame = atlas.getSpriteFrame("battle-" + attrData.Pic);
            self.iconAttr.spriteFrame = frame;
        });

    }
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
