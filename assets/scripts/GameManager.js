/**
 * Created by Administrator on 2017/7/7 0007.
 */
var IOUtil =  require("IOUtil");
var MetaDataManager = require("MetaDataManager");
var BG_MUSIC_NAME = require("Types").BG_MUSIC_NAME;

var dataKey = "gamePreference";
var GameManager = cc.Class({
    statics: {
        instance: null
    },

    properties: {
        isPaused: false,
        curStageID: -1,
        isBossStage: false,
        isMusicOn:  true,
        isSoundOn:  true,
        entranceID: 1,
        playerSceneIndex: 0,
        audioID_BGM: -1,

        //--0: 战斗外，1:战斗中的普通关，2:战斗中的boss关
        curSceneType: 0,

        //礼包倒计时时间戳
        lastTimeStamp: 0,

        //已播放的剧情动画
        playedStories: []
    },

    isStageInEntrance: function(){
        var entranceData = MetaDataManager.geEntranceData(this.entranceID);
        var stageNumber = Number(this.curStageID);
        return stageNumber >= entranceData.StageStart && stageNumber<= entranceData.StageEnd;
    },

    ctor: function(){
        let data = IOUtil.readData(dataKey);
        this.isMusicOn =  data.isMusicOn === undefined  ? true : data.isMusicOn;
        this.isSoundOn =  data.isSoundOn === undefined  ? true : data.isSoundOn;
        let count = data ? data.deadCount : 0;
        this.deadCount = count == undefined ? 0 : count;

        this.playedStories = data.playedStories ? data.playedStories : [];
        cc.audioEngine.setMaxAudioInstance(20);
    },

    updateStage: function(stageID, isBoss){
        this.curStageID = stageID;
        this.isBossStage = isBoss;
    },

    updateScene: function(sceneType){
        if(sceneType != this.curSceneType){
            this.curSceneType = sceneType;
            cc.audioEngine.stopAll();
            this.audioID_BGM = -1;
        }
        if(this.audioID_BGM < 0){
            this.playMusic();
            // cc.log("music played~~~~~~");
        }
    },

    pauseMusic: function(){
        cc.audioEngine.pause(this.audioID_BGM);
    },

    resumeMusic: function () {
        cc.audioEngine.resume(this.audioID_BGM);
    },

    setPaused: function(value){
        this.isPaused = value;
        if(value){
            //this.pauseMusic();
        }else{
            //this.resumeMusic();
        }
    },

    playMusic: function(){
        var self = this;
        if(this.isMusicOn){
            // this.audioID_BGM = cc.audioEngine.play(bgm, true , 1);
            var bg_music_name = BG_MUSIC_NAME[self.curSceneType];
            cc.loader.loadRes(bg_music_name, cc.AudioClip, function (err, audio) {
                // self.bg.spriteFrame = spriteFrame;
                self.audioID_BGM  = cc.audioEngine.play(audio, true, 1);
                cc.log("audioID_BGM: %s", self.audioID_BGM);
            });
        }

        cc.log("isMusicOn: %s", this.isMusicOn);
    },

    playSound: function(audioClip){
        if(this.isSoundOn){
            cc.audioEngine.play(audioClip, false , 1);
            cc.log("sound played~~~~~~~~~~");
        }
    },

    switchSound: function(value){
        this.isSoundOn = value;
        this.saveData();
    },

    switchMusic: function(value){
        this.isMusicOn = value;
        this.saveData();

        cc.log("isMusicOn: %s, value: %s", this.isMusicOn, value);
        if(value){
            if(this.audioID_BGM < 0){
                this.playMusic();
            }else {
                cc.audioEngine.resume(this.audioID_BGM);
            }
        }
        else{
            cc.audioEngine.pause(this.audioID_BGM);
        }
    },

    countDead: function(){
        this.deadCount++;
        this.saveData();
    },

    isFirstDead: function(){
        return this.deadCount == 0 || this.deadCount == undefined;
    },
    
    getCurStageData: function () {
        return MetaDataManager.getStageDataByID(this.curStageID);
    },

    getCurEntranceData: function () {
        return MetaDataManager.getEntranceData(this.entranceID);
    },

    resetTimeStamp: function(){
        var timeStamp = Math.round(new Date().getTime()/1000);
        this.lastTimeStamp = timeStamp;
        this.saveData();
    },

    storyEnabled: function(storyID){
        return Number(storyID) != -1 && this.playedStories.indexOf(storyID.toString()) <= 0; 
    },

    playStory: function(storyID){
        this.playedStories.push(storyID.toString());
        this.saveData();
    },

    saveData: function(){
        let data = {
            isMusicOn: this.isMusicOn,
            isSoundOn: this.isSoundOn,
            deadCount: this.deadCount,
            lastTimeStamp: this.lastTimeStamp,
            playedStories: this.playedStories
        };

        IOUtil.writeData(dataKey, data);
    }
});

GameManager.instance = new GameManager();
module.exports = GameManager;