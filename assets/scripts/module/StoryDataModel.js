var IOUtil =  require("IOUtil");

var Story = cc.Class({

    properties: {
        storyID: "",
        enabled: false,
        opened: false,
    },

    ctor: function(data){
        this.storyID = data.storyID;
        this.enabled = data.enabled;
        this.opened = data.opened;
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

    getStory: function(id){
        if(this.stories[id]){
            return this.stories[id];
        }else{
            var story = new Story({
                storyID: id,
                enabled: false,
                opened: false,
            });

            this.stories[id] = story;
            return story;
        }
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
