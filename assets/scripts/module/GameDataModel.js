var MetaDataManager = require("MetaDataManager");
var GameManager = require("GameManager");
var IOUtil = require("IOUtil");
var Constant = require("Constant");
var dataKey = "GameDataModel";

var GameDataModel = cc.Class({
    name: 'GameDataModel',
    properties: {
        totalScore: 0,
        highestScores: 0,
        highestCombo: 0,
        highestSlashCount: 0,
        killedCount:  0,
        comboReward: 0,
        scoreReward: 0,
        killReward: 0,
        slashReward: 0,
        totalReward: 0,
        reviveCount: 0,
        slashCount: 0,
        max_score_level: 6,
        lastCreateBuffTime: 0,
        activeBuffData: null
    },

    getTotalReward: function(isWin){
        if(isWin){
            return Math.round(this.totalReward);
        }else{
            return Math.round(this.totalReward * Constant.instance.FAILED_SCORE_RATIO);
        }
    },

    addKillCount: function(){
        this.killedCount++;
    },

    updateCombo: function(comboCount){
        if (comboCount > this.highestCombo){
            this.highestCombo = comboCount;
        }
    },

    updateSlashCount: function (slashCount) {
        if(slashCount > this.highestSlashCount){
            this.highestSlashCount = slashCount;
        }
    },

    addScore: function(score){
        this.totalScore += score;
        cc.log("total score: %s, %s", this.totalScore, score);
        this.updateHighestScore();
    },

    getFinalScore: function(){
        let entranceData = MetaDataManager.getEntranceData(GameManager.instance.entranceID);
        return Math.round(this.totalScore * entranceData.StageRewardValue);
    },

    getScoreByLevel: function(level){
        let stageData = MetaDataManager.getStageDataByID(GameManager.instance.curStageID);
        let scores = [stageData.D, stageData.C, stageData.B, stageData.A, stageData.S, stageData.SS, stageData.SSS];

        return scores[level];
    },

    isBuffTimeReached: function(){
        cc.log("time diff: %s, interval: %s", Date.now() - this.lastCreateBuffTime, Constant.instance.MIN_BUFF_INTERVAL);
        return Date.now() - this.lastCreateBuffTime >= Constant.instance.MIN_BUFF_INTERVAL
    },

    updateBuffCreateTime: function(){
        this.lastCreateBuffTime = Date.now();
    },

    isMaxLevel: function(level){
        return level == this.max_score_level;
    },

    getMaxLevelScore: function(){
        return this.getScoreByLevel(this.max_score_level);
    },

    getScoreLevel: function(){
        let stageData = MetaDataManager.getStageDataByID(GameManager.instance.curStageID);
        let finalScore = this.getFinalScore();

        // let scores = [stageData.D, stageData.C, stageData.B, stageData.A, stageData.S, stageData.SS, stageData.SSS];
        let scores = [stageData.C, stageData.B, stageData.A, stageData.S, stageData.SS, stageData.SSS];
        for(let i = 0; i < scores.length; i++){
            if(finalScore <= scores[i]){
                return i;
            }
        }

        return scores.length - 1;
    },

    updateReward: function(){
        let stageData = MetaDataManager.getStageDataByID(GameManager.instance.curStageID);
        var stageRewardValue = stageData.RewardValue/100;
        //var ratingValue = MetaDataManager.getRatingData(this.getScoreLevel());

        this.totalReward = this.getFinalScore() * stageRewardValue * Constant.instance.REWARD_RATIO; //(1 + ratingValue);
        /*this.scoreReward = Math.ceil( Constant.instance.marks[scoreLevel] / 1000 * stageData.BasicReward );
        this.comboReward = Math.ceil( Constant.instance.comboRewardRatio / 1000 * this.highestCombo ) ;
        this.killReward = Math.ceil( Constant.instance.killsRewardRatio / 1000 * this.killedCount );
        this.slashReward = Math.ceil( Constant.instance.slashRewardRatio/1000 * this.highestSlashCount );*/
    },

    addComboScore: function(comboCount){
        let comboScore =  MetaDataManager.getComboScore(comboCount);
        this.addScore(comboScore);
        cc.log("total score : %s, %s", this.totalScore, comboScore);
    },

    addOneSlashScore: function (oneSlashCount) {
        var oneSlashScore = MetaDataManager.getOneSlashDataByCount(oneSlashCount);
        this.addScore(oneSlashScore);
    },

    updateHighestScore: function(){
        var curScore = this.getFinalScore();
        if(curScore > this.getStageHighestScore()){
            this.setStageHighestScore(curScore);
        }
    },

    addBuff: function(buffData){
        var buffType = buffData.ItemType;
        var activeBuffCount = this.getBuffCount(buffType);
        var maxBuffCount = Constant.instance.getMaxBuffCount(buffType);
        if(activeBuffCount < maxBuffCount){
            if(!this.activeBuffData[buffType]){
                this.activeBuffData[buffType] = [];
            }
            this.activeBuffData[buffType].push(buffData);
            this.updateBuffCreateTime();
            return true;
        }else{
            return false;
        }
    },

    getBuffCount: function(type){
        var buffs = this.activeBuffData[type];
        return buffs === undefined ? 0 : buffs.length;
    },

    getStageHighestScore: function(){
        var score = this.highestScores[ GameManager.instance.curStageID ];
        return  score ? score : 0;
    },

    setStageHighestScore: function(score){
        this.highestScores[ GameManager.instance.curStageID ] = score;
        this.saveData();
    },

    addRevive: function(){
        this.reviveCount++;
    },

    getReviveCount: function(){
        return this.reviveCount;
    },

    addSlash: function(){
        this.slashCount++;
    },

    getData: function(){
        return {
            highestScores: this.highestScores
        };
    },

    saveData(){
        IOUtil.writeData(dataKey, this.getData());
    },

    clear: function(){
        this.totalScore = 0;
        // this.highestScore = 0;
        this.highestCombo = 0;
        this.highestSlashCount = 0;
        this.comboReward = 0;
        this.scoreReward = 0;
        this.killReward = 0;
        this.killedCount = 0;
        this.slashReward = 0;
        this.reviveCount = 0;
        this.activeBuffData = {};
    },

    ctor: function() {
        var gameData = IOUtil.readData(dataKey);
        this.highestScores = gameData && gameData.highestScores ? gameData.highestScores : {};
        this.activeBuffData = {};
    }
});

module.exports = GameDataModel;

