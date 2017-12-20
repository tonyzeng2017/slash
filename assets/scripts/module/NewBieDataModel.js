var IOUtil = require("IOUtil");
var dataKey = "NewBieDataModel";

var NewBieDataModel = cc.Class({
    name: 'NewBieDataModel',
    properties: {
        isInGameFinished: false,

        isAttrLevelUpFinished: false,
        isNewBieLevelUpStarted: false,

        isEnterGameFinished: false,
        isEnterGameStarted: false,

        isStarUpFinished: false,
        isStarUpStarted: false
    },

    getData: function(){
        return {
            isInGameFinished: this.isInGameFinished,
            isAttrLevelUpFinished: this.isAttrLevelUpFinished,
            isEnterGameFinished: this.isEnterGameFinished,
            isStarUpFinished: this.isStarUpFinished
        };
    },

    isShowAttrLevelUp: function () {
        return !this.isAttrLevelUpFinished && this.isNewBieLevelUpStarted;
    },

    isShowEnterGame: function () {
        return !this.isEnterGameFinished && this.isEnterGameStarted;
    },

    isShowStarUp: function () {
        return !this.isStarUpFinished && this.isStarUpStarted;
    },

    saveData(){
        IOUtil.writeData(dataKey, this.getData());
    },

    finishEnterGame(){
        this.isEnterGameFinished = true;
        this.isEnterGameStarted = false;
        this.saveData();
    },

    finishInGame(){
        this.isInGameFinished = true;
        this.saveData();
    },

    finishStarUp(){
        this.isStarUpFinished = true;
        this.isStarUpStarted = false;
        this.saveData();
    },

    finishAttrLevelUp: function () {
        this.isAttrLevelUpFinished = true;
        this.isNewBieLevelUpStarted = false;
        this.saveData();
    },

    ctor: function() {
        var newbieData = IOUtil.readData(dataKey);
        this.isInGameFinished = false;//newbieData ? newbieData.isInGameFinished : false;
        this.isAttrLevelUpFinished = false;//newbieData ? newbieData.isAttrLevelUpFinished: false;
        this.isEnterGameFinished = newbieData ? newbieData.isEnterGameFinished: false;
        this.isStarUpFinished = false;//newbieData ? newbieData.isStarUpFinished : false;
    }
});

module.exports = NewBieDataModel;


