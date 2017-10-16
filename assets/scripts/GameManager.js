/**
 * Created by Administrator on 2017/7/7 0007.
 */
var IOUtil =  require("IOUtil");
var dataKey = "gamePreference";
var MetaDataManager = require("MetaDataManager");

var GameManager = cc.Class({
    statics: {
        instance: null
    },

    properties: {
        isPaused: false,
        curStageID: 0,
        isMusicOn:  true,
        isSoundOn:  true,
        entranceID: 1,
        playerSceneIndex: 0,
        audioID_BGM: 0,
    },

    isStageInEntrance: function(){
        var entranceData = MetaDataManager.geEntranceData(this.entranceID);
        var stageNumber = Number(this.curStageID);
        return stageNumber >= entranceData.StageStart && stageNumber<= entranceData.StageEnd;
    },

    ctor: function(){
        let data = IOUtil.readData(dataKey);
        this.isMusicOn = data ? data.isMusicOn : false;
        this.isSoundOn = data ? data.isSoundOn : false;
        let count = data ? data.deadCount : 0;
        this.deadCount = count == undefined ? 0 : count;
    },
 
    playMusic: function(){
        var self = this;
        if(this.isMusicOn){
            // this.audioID_BGM = cc.audioEngine.play(bgm, true , 1);
            cc.loader.loadRes("bg_music/bgm_main", cc.AudioClip, function (err, audio) {
                // self.bg.spriteFrame = spriteFrame;
                self.audioID_BGM  = cc.audioEngine.play(audio, true, 1);
            });
        }

        cc.log("isMusicOn: %s", this.isMusicOn);
    },

    playSound: function(audioClip){
        if(this.isSoundOn){
            cc.audioEngine.play(audioClip, false , 1);
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
            if(this.audioID_BGM == 0){
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

    saveData: function(){
        let data = {
            isMusicOn: this.isMusicOn,
            isSoundOn: this.isSoundOn,
            deadCount: this.deadCount
        };

        IOUtil.writeData(dataKey, data);
    }
});

GameManager.instance = new GameManager();
module.exports = GameManager;