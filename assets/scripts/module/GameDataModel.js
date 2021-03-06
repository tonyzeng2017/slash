var MetaDataManager = require("MetaDataManager");
var GameManager = require("GameManager");
var IOUtil = require("IOUtil");
var Constant = require("Constant");
var dataKey = "GameDataModel";

const BuffData = cc.Class({
    name: 'BuffData',
    properties: {
        ItemType: 0,
        value: 0,
        delta: 0,
        count: 0
    },

    __ctor__: function(buffData){
        this.ItemType = buffData.ItemType;
        this.value = buffData.AddValue;
        this.count = 1;
        this.delta = buffData.AddValue;
    },

    add: function(buffData){
        this.value += buffData.AddValue;
        this.count += 1;
        this.delta = buffData.AddValue;
    }
});

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
        // let entranceData = MetaDataManager.getEntranceData(GameManager.instance.entranceID);
        return Math.round(this.totalScore); //entranceData.StageRewardValue;
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

    getLevelByScore: function(score, stageID){
        let stageData = MetaDataManager.getStageDataByID(stageID);

        // let scores = [stageData.D, stageData.C, stageData.B, stageData.A, stageData.S, stageData.SS, stageData.SSS];
        let scores = [stageData.C, stageData.B, stageData.A, stageData.S, stageData.SS, stageData.SSS];
        for(let i = 0; i < scores.length; i++){
            if(score < scores[i]){
                return i;
            }
        }

        return scores.length;
    },

    getScoreLevel: function(){
        let finalScore = this.getFinalScore();
        return this.getLevelByScore(finalScore, GameManager.instance.curStageID);
    },

    updateReward: function(){
        let stageData = MetaDataManager.getStageDataByID(GameManager.instance.curStageID);
        var stageRewardValue = stageData.RewardValue/100;
        //var ratingValue = MetaDataManager.getRatingData(this.getScoreLevel());
        let entranceData = MetaDataManager.getEntranceData(GameManager.instance.entranceID);
        this.totalReward = this.getFinalScore() * entranceData.StageRewardValue * stageRewardValue * Constant.instance.REWARD_RATIO; //(1 + ratingValue);
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
        var oneSlashData = MetaDataManager.getOneSlashDataByCount(oneSlashCount);

        var oneSlashScore = oneSlashData.CutScore;
        this.addScore(oneSlashScore);
    },

    updateHighestScore: function(){
        var curScore = this.getFinalScore();
        if(curScore > this.getStageHighestScore()){
            this.setStageHighestScore(curScore);
        }
    },

    addBuff: function(rawBuffData){
        cc.log("added the buff data");
        var buffType = rawBuffData.ItemType;
        var activeBuffCount = this.getBuffCount(buffType);
        var maxBuffCount = Constant.instance.getMaxBuffCount(buffType);
        cc.log("active buff count:%s, maxBuffCount: %s", activeBuffCount, maxBuffCount);
        if(activeBuffCount < maxBuffCount){
            if(!this.activeBuffData[buffType]){
                this.activeBuffData[buffType] = new BuffData(rawBuffData);
            }else{
                this.activeBuffData[buffType].add(rawBuffData);
            }

            this.updateBuffCreateTime();
            cc.log("added the buff data success");
            return this.activeBuffData[buffType];
        }else{
            cc.log("added the buff data failed");
            return false;
        }
    },

    getBuffCount: function(type){
        var buffData = this.activeBuffData[type];
        return buffData === undefined ? 0 : buffData.count;
    },

    getHighestScoreByStage: function(stageID){
        var score = this.highestScores[stageID];
        return  score ? score : 0;
    },

    getStageHighestScore: function(){
        return this.getHighestScoreByStage(GameManager.instance.curStageID);
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

