var IOUtil =  require("IOUtil");
var MetaDataManager = require("MetaDataManager");

var Story = cc.Class({

    properties: {
        storyID: "0",
        enabled: false,
        opened: false,
    },

    __ctor__: function(data){
        this.storyID = data.storyID;
        this.enabled = data.enabled;
        this.opened = data.opened;
    },

    getRawData: function(){
        var rawData = MetaDataManager.getStoryDataByID(this.storyID);
        return rawData;
    },

    active: function(){
        this.enabled = true;
    },

    open: function(){
        this.opened = true;
    },

    getData: function(){
        return {
            storyID: this.storyID,
            enabled: this.enabled,
            opened: this.opened
        }
    }
})

const dataKey = "StoryDataModel"

cc.Class({
    name: "StoryDataModel",
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
        stories: null,
        defaultStoryID: "1"
    },

    fakeData: function(){
        var data = { defaultStoryID: "1" } ;
        data.storyData = {};

        for(var i = 1; i < 18; i ++){
            data.storyData[i.toString()] = {
                storyID: i.toString(),
                enabled: true,
                opened: false
             };
        }

        return data;
    },

    ctor: function(){
        var data = IOUtil.readData(dataKey);
        this.defaultStoryID = data.defaultStoryID ? data.defaultStoryID : "1";

        var storyData = data.storyData;
        this.stories = {};
        for(var key in storyData){
            var story = new Story(storyData[key]);
            this.stories[key] = story;
        }
    },

    canPlay: function(id){
        if(Number(id) == -1){
            return false;
        }else{
            return !this.isStoryEnabled(id);
        }
    },

    isStoryEnabled: function(id){
        var story = this.getStory(id);
        return story && story.enabled;
    },

    activeStory: function(id){
        var story = this.getStory(id);
        story.active();
        this.saveData();
    },

    openStory: function(id){
        var story = this.getStory(id);
        story.open();
        this.saveData();
    },  

    isStoryOpened: function(id){
        var story = this.getStory(id);
        return story && story.opened;
    },

    createDefault: function(id){
        var story = new Story({
            storyID: id.toString(),
            enabled: false,
            opened: false,
        });

        return story;
    },

    getStory: function(id){
        if(!this.stories[id]){
            this.stories[id] = this.createDefault(id);
        }

        return this.stories[id];
    },

    setCurStory: function(storyID){
        this.defaultStoryID = storyID;
        this.saveData();
    },

    getDisplayStories: function(){
        var sortedStories = [];
        for(var key in this.stories){
            var story = this.stories[key];
            if(story.enabled){
                sortedStories.push(story);
            }
        }
        var lastIndex = 0;
        if(sortedStories.length > 0){
            //升序
            sortedStories.sort(function(a, b){
                return Number(a.storyID) > Number(b.storyID);
            });
            lastIndex = Number(sortedStories[sortedStories.length - 1].storyID);
        }
        var nextStory = MetaDataManager.getStoryDataByID(lastIndex + 1);
        cc.log("lastIndex: %s", lastIndex);
        if(nextStory){
            var newStory = this.createDefault(lastIndex + 1);
            sortedStories.push(newStory);
        }
        // for(var i = 0; i < sortedStories.length; i ++){
        //     cc.log("storyID: %s", sortedStories[i].storyID);
        // }
        cc.log("sorted stories: %s", sortedStories.length);
        return sortedStories;
    },

    hasStoryInStage: function(stageID){
        var stageData = MetaDataManager.getStageDataByID(stageID);
        return stageData.StoryStart != -1 || stageData.StoryComplete != -1; 
    },

    getData: function(){
        var data = { defaultStoryID: this.defaultStoryID } ;
        data.storyData = {};
        for(var id in this.stories){
            data.storyData[id] = this.stories[id].getData();
        }

        return data;
    },

    saveData: function(){
        IOUtil.writeData(dataKey, this.getData());
    }
});
