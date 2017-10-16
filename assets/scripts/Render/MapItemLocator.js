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
        mapItems: [cc.Node],
        scrollView: cc.ScrollView
    },

    // use this for initialization
    onLoad: function () {

    },

    start: function(){
        cc.log("mapItem start: %s, node size: %s", this.mapItems.length, this.node.width);
        var lastStage = 0;
        var lastItem;
        for(let i = 0; i < this.mapItems.length; i++){
            var stageID =  this.mapItems[i].getComponent("MapItemRenderer").stageID;
            if (UserDataManager.instance.getUserData().isStageEnabled(stageID.toString()) && stageID > lastStage){
                lastStage = stageID;
                lastItem = this.mapItems[i];
            }
            cc.log("stageID: %s", stageID);
        }

        if(lastItem){
            cc.log("last stageID : %s, itemX: %s, itemWidth: %s, nodeWidth: %s", lastStage, lastItem.x, lastItem.width, this.node.width);
            this.scrollView.scrollToOffset(cc.p(lastItem.x - lastItem.width/2, 0), 0.0);
            lastItem.getComponent("MapItemRenderer").showAnimation();
        }
    }

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
