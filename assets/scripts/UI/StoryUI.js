var UserDataManager  =  require("UserDataManager");

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
        pageView: cc.PageView,
        content: cc.Node,
        scaleDiff: 0.2,
        story: cc.Prefab,
        storyItem: cc.Prefab
    },

    // use this for initialization
    onLoad: function () {
        var stories = UserDataManager.instance.getStoryData().getDisplayStories();
        var defaultStoryID = UserDataManager.instance.getStoryData().defaultStoryID;

        cc.log("default storyID: %s", defaultStoryID);

        var defaultIndex = 0;
        for(var i = 0; i < stories.length; i++){
            var item = cc.instantiate(this.storyItem);
            item.getComponent("StoryItemRenderer").init(stories[i]);
            item.getComponent("StoryItemRenderer").render();
            // this.content.addChild(item);
            this.pageView.insertPage(item, i);
            if(stories[i].storyID == defaultStoryID){
                defaultIndex = i;
            }
            cc.log("pushed storyID: %s", stories[i].storyID);
        }

        // this.node.runAction(cc.callFunc(function(){
        //     cc.log("default index: %s", defaultIndex);
        //     this.pageView.setCurrentPageIndex(defaultIndex);
        // }.bind(this)));
    },

    // use this for initialization
    start: function () {
        this.pageView.node.on('scrolling', this.onScrolling, this);
        this.pageView.node.on('page-turning', this.onTurning, this);
        this.curIndex = this.pageView.getCurrentPageIndex();
        this.curPosX = this.content.x;
        this.initScale();
        this.initListeners();
    },

    initScale: function(){
        var pages = this.pageView.getPages();
        cc.log("story pages count: %s", pages.length);
        for(var i = 0; i < pages.length; i++){
            var scale = this.getPageScale(i);
            pages[i].children[0].runAction(cc.scaleTo(0.1, scale));
            // pages[i].children[0].scale = scale;
        }
    },

    initListeners: function(){
        var pages = this.pageView.getPages();
        for(var i = 0; i< pages.length; i++){
            pages[i].on(cc.Node.EventType.TOUCH_END, this.onItemTouch.bind(this));
            // pages[i].on(cc.Node.EventType.MOUSE_UP, this.onItemTouch.bind(this));
        }
    }, 

    onItemTouch: function(event){
        this.node.runAction(cc.callFunc(function(){
            event.stopPropagationImmediate();
            // var index = this.pageView.getPages().indexOf(event.target);
            // cc.log("the index: %s", index)
            var storyID = event.target.getComponent("StoryItemRenderer").getStoryID();

            if(UserDataManager.instance.getStoryData().isStoryEnabled(storyID)){
                var storyUI = cc.instantiate(this.story);
                storyUI.getComponent("StoryRenderer").setStoryAndCallback(storyID, function(){
                    storyUI.removeFromParent();
                });
                this.node.addChild(storyUI);
                cc.log("the page is turning~~~~~: %s", storyID);
                UserDataManager.instance.getStoryData().setCurStory(storyID);
            }
        }.bind(this)));
    },

    getPageScale: function(index){
        var scale = 1 - Math.abs(index - this.curIndex) * this.scaleDiff;
        return Math.max(0, scale);
    },

    onTurning: function(){
        this.curIndex = this.pageView.getCurrentPageIndex();
        this.curPosX = this.content.x;
        this.initScale();
    },
    
    onScrolling: function(){
        // cc.log("on scrolling content x:%s", this.content.x);
        var pages = this.pageView.getPages();
        for(var i = 0; i < pages.length; i++){
            var page = pages[i];
            var item = page.children[0];
            var baseScale = this.getPageScale(i);

            if(this.curIndex == i){
                var offset = Math.abs(this.content.x  - this.curPosX);
                item.scale = baseScale - this.scaleDiff * offset/page.width;
            }else{
                var direction = i < this.curIndex ? 1 : -1;
                var offset = (this.content.x  - this.curPosX)
                item.scale = baseScale + direction * this.scaleDiff * offset / page.width;
            }
        }
    },

    onReturn: function(event){
        this.node.runAction(cc.callFunc(function(){
            cc.eventManager.pauseTarget(event.target, true);
            event.stopPropagationImmediate();
            this.node.active = false;
            this.node.removeFromParent();
        }.bind(this)));
    },
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
