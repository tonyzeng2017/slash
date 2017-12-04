const MetaDataManager = require("MetaDataManager");
var UserDataManager = require("UserDataManager");
var ShaderUtil = require("ShaderUtil");
var GameManager = require("GameManager");
var TipsManager = require("TipsManager");

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
        entranceID: 1,
        text_name: cc.Label,
        name_bg: cc.Sprite,
        bg: cc.Sprite,
        lock: cc.Sprite,
        seal:cc.Animation,
        audio: cc.AudioClip,
        newbieEnterGame: cc.Node
    },

    // use this for initialization
    onLoad: function () {
        if(this.newbieEnterGame){
            this.newbieEnterGame.active = !UserDataManager.instance.getNewbieData().isEnterGameFinished;
            // cc.log("this.newbieEnterGame.active: %s", this.newbieEnterGame.active)

            if(this.newbieEnterGame.active){
                TDProxy.onMissionBegin("step_enter_game1");
            }
        }

        var entranceData = MetaDataManager.getEntranceData(this.entranceID);
         // var entranceData = MetaDataManager.getEntranceData(this.entranceID);
         this.text_name.string = entranceData.MapName;

         let isEntranceEnable = UserDataManager.instance.getUserData().isEntraceEnabled(this.entranceID);
         cc.log("stageStart: %s, isOpen: %s", entranceData.StageStart, isEntranceEnable);
         this.lock.node.active = !isEntranceEnable;
         this.text_name.node.active = isEntranceEnable;
         this.name_bg.node.active = isEntranceEnable;

         let isEntranceOpened = UserDataManager.instance.getUserData().isEntranceOpened(this.entranceID);
         if(isEntranceEnable && !isEntranceOpened){
             this.seal.play();
             cc.log("todo: play the opend animation on entrance: %s", this.entranceID);
             UserDataManager.instance.getUserData().openEntrance(this.entranceID);
         }

         if(!isEntranceEnable){
             ShaderUtil.setShader(this.bg, "gray");
             var self = this;
            //  if(cc.sys.isMobile){
                 this.node.on(cc.Node.EventType.TOUCH_END, function (event) {
                     console.log('Mouse down entrance: %s', self.entranceID);
                     if(entranceData.OpenStar == 0){
                        TipsManager.init.showTips("通关前一关" );
                     }else{
                        TipsManager.init.showTips("通关前一关，并且人物属性达到" + entranceData.OpenStar + "星" );
                     }
                 }, self);
            //  }else{
            //      this.node.on(cc.Node.EventType.MOUSE_UP, function (event) {
            //          console.log('Mouse down entrance: %s', self.entranceID);
            //          TipsManager.init.showTips("通关前一关，并且人物属性达到" + entranceData.OpenStar + "星" );
            //      }, self);
            //  }
         }else{
             var self = this;
            //  if(cc.sys.isMobile){
                 this.node.on(cc.Node.EventType.TOUCH_END, function (event) {
                     if(event.target != self.node){
                         return;
                     }
                     console.log('TOUCH_END entrance: %s', self.entranceID);
                     self.onEnter();
                 }, self);
            //  }else{
            //      this.node.on(cc.Node.EventType.MOUSE_UP, function (event) {
            //          if(event.target != self.node){
            //              return;
            //          }
            //          console.log('Mouse down entrance: %s', self.entranceID);
            //          self.onEnter();
            //      }, self);
            //  }
         }
    },

    onEnter: function(){
        GameManager.instance.entranceID = this.entranceID;
        if(this.audio){
            GameManager.instance.playSound(this.audio, false, 1);
        }
        cc.director.loadScene('MapGame' + this.entranceID);
    },
    
    onNewbieEnterGame: function () {
        UserDataManager.instance.getNewbieData().isEnterGameStarted = true;
        this.onEnter();
        TDProxy.onMissionCompleted("step_enter_game1");
        // G.analytics_plugin.finishTask({
        //     Task_Id:  "enter_game",
        //     Task_Type: (TaskType.GUIDE_LINE).toString()
        // });
    }

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
