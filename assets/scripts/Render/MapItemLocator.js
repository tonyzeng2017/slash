var UserDataManager = require("UserDataManager");
var GameManager = require("GameManager");

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
        scrollView: cc.ScrollView,
        btnLeft: cc.Node,
        btnRight: cc.Node,
        content: cc.Node
    },

    // use this for initialization
    onLoad: function () {
        // this.scrollView.node.on('scroll-to-left', this.onToLeft, this);
        // this.scrollView.node.on('scroll-to-right', this.onToRight, this);
        this.scrollView.node.on('scrolling', this.onScrolling, this);
        this.onScrolling();
    },

    // onToLeft: function(){
    //     cc.log("scroll to the left");
    // },
    //
    // onToRight: function(){
    //     cc.log("scroll to the right");
    // },

    onScrolling: function(){
        this.btnLeft.active = this.content.x < -640;
        this.btnRight.active = this.content.x > -640 - (this.node.width - 1280);
        // cc.log("on scrolling content x:%s", this.content.x);
    },

    getItemByStageID: function(stageID){
        for(let i = 0; i < this.mapItems.length; i++){
            var sID =  this.mapItems[i].getComponent("MapItemRenderer").stageID;
            if(sID == stageID){
                return this.mapItems[i];
            }
        }

        return null;
    },

    getMaxOpenItem: function(){
        var lastStage = 0;
        var selectedIndex = 0;
        for(let i = 0; i < this.mapItems.length; i++){
            var stageID =  this.mapItems[i].getComponent("MapItemRenderer").stageID;
            if (UserDataManager.instance.getUserData().isStageEnabled(stageID.toString()) && stageID > lastStage){
                lastStage = stageID;
                selectedIndex = i;
            }
        }

        return this.mapItems[selectedIndex];
    },

    start: function(){
        cc.log("mapItem start: %s, node size: %s", this.mapItems.length, this.node.width);
        var lastItem = this.getItemByStageID(GameManager.instance.curStageID);
        if(!lastItem){
            lastItem = this.getMaxOpenItem();
            cc.log("the selected item: %s", this.mapItems.indexOf(lastItem));
        }

        if(lastItem){
            var pageIndex = Math.floor(lastItem.x/cc.winSize.width);
            // cc.log("pageIndex: %s, winSize.x: %s, winSize.y: %s", pageIndex, cc.winSize.width, cc.winSize.height);
            // cc.log("last stageID : %s, itemX: %s, itemWidth: %s, nodeWidth: %s", lastStage, lastItem.x, lastItem.width, this.node.width);
            this.scrollView.scrollToOffset(cc.p(pageIndex * cc.winSize.width, 0), 0.0);
        }

        var maxOpenItem = this.getMaxOpenItem();
        if(maxOpenItem){
            maxOpenItem.getComponent("MapItemRenderer").showAnimation();
        }
    }

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
