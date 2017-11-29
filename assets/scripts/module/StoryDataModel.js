var IOUtil =  require("IOUtil");
var MetaDataManager = require("MetaDataManager");

var Story = cc.Class({

    properties: {
        storyID: "0",
        enabled: false,
        opened: false,
    },

    ctor: function(data){
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
        stories: null
    },

    ctor: function(){
        var storyData = IOUtil.readData(this.name);
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
        if(this.stories[id]){
            return this.stories[id];
        }else{
            this.stories[id] = this.createDefault(id);
            return story;
        }
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
            sortedStories.sort(function(a, b){
                return Number(a.storyID) < Number(b.storyID);
            })
            lastIndex = Number(sortedStories[sortedStories.length - 1].storyID);
        }
        var nextStory = MetaDataManager.getStoryDataByID(lastIndex + 1);
        if(nextStory){
            var newStory = this.createDefault(lastIndex + 1);
            sortedStories.push(newStory);
        }

        return sortedStories;
    },

    getData: function(){
        var data = {};
        for(var id in this.stories){
            data[id] = this.stories[id].getData();
        }

        return data;
    },

    saveData: function(){
        IOUtil.writeData(this.name, this.getData());
    }
});
