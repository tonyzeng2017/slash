var UserDataManager = require("UserDataManager");
const MetaDataManager = require("MetaDataManager");

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
        pgNode: cc.Node,
        attrID: 1
    },

    // use this for initialization
    onLoad: function () {
        let star = UserDataManager.instance.getUserData().star.value;
        let maxLevel = MetaDataManager.getMaxLevelByStarAndID(star, level);
        let level = UserDataManager.instance.getUserData().getAttrLevel(this.attrID);
        let count = Math.floor(10 * level/maxLevel );
        for(let i = 1; i <= 10; i++){
            let child = this.pgNode.getChildByName("battle-pg-" + i);
            child.active = i <= count;
        }
    }
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
