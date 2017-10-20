var MetaDataManager = require("MetaDataManager");
var GameManager = require("GameManager");
var IOUtil = require("IOUtil");
var Constant = require("Constant");
var dataKey = "GameDataModel";

var GameDataModel = cc.Class({
    name: 'GameDataModel',
    properties: {
        totalScore: 0,
        highestScore: 0,
        highestCombo: 0,
        highestSlashCount: 0,
        killedCount:  0,
        comboReward: 0,
        scoreReward: 0,
        killReward: 0,
        slashReward: 0,
        totalReward: 0,
        reviveCount: 0,
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
        return Math.round(this.totalScore * entranceData.StageRewardValue/100);
    },

    getScoreLevel: function(){
        let stageData = MetaDataManager.getStageDataByID(GameManager.instance.curStageID);
        let finalScore = this.getFinalScore();

        let scores = [stageData.D, stageData.C, stageData.B, stageData.A, stageData.S, stageData.SS, stageData.SSS];
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
        var ratingValue = MetaDataManager.getRatingData(this.getScoreLevel());

        this.totalReward = this.getFinalScore() * stageRewardValue * (1 + ratingValue);
        /*this.scoreReward = Math.ceil( Constant.instance.marks[scoreLevel] / 1000 * stageData.BasicReward );
        this.comboReward = Math.ceil( Constant.instance.comboRewardRatio / 1000 * this.highestCombo ) ;
        this.killReward = Math.ceil( Constant.instance.killsRewardRatio / 1000 * this.killedCount );
        this.slashReward = Math.ceil( Constant.instance.slashRewardRatio/1000 * this.highestSlashCount );*/
    },

    addComboScore: function(comboCount){
        let comboScore =  MetaDataManager.getComboScore(comboCount);
        this.totalScore += comboScore;
        this.updateHighestScore();
        cc.log("total score : %s, %s", this.totalScore, comboScore);
    },

    addOneSlashScore: function (oneSlashCount) {
        var oneSlashScore = MetaDataManager.getOneSlashDataByCount(oneSlashCount);
        this.addScore(oneSlashScore);
    },

    updateHighestScore: function(){
        if(this.totalScore > this.highestScore){
            this.highestScore = this.totalScore;
        }
    },

    addRevive: function(){
        this.reviveCount++;
    },

    getReviveCount: function(){
        return this.reviveCount;
    },

    getData: function(){
        return {
            highestScore: this.highestScore
        };
    },

    saveData(){
        IOUtil.writeData(dataKey, this.getData());
    },

    clear: function(){
        this.totalScore = 0;
        this.highestScore = 0;
        this.highestCombo = 0;
        this.highestSlashCount = 0;
        this.comboReward = 0;
        this.scoreReward = 0;
        this.killReward = 0;
        this.killedCount = 0;
        this.slashReward = 0;
        this.reviveCount = 0;
    },

    ctor: function() {
        var gameData = IOUtil.readData(dataKey);
        this.highestScore = gameData && gameData.highestScore ? gameData.highestScore : 0;
    }
});

module.exports = GameDataModel;

