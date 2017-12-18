var IOUtil =  require("IOUtil");
const MetaDataManager = require("MetaDataManager");
var Constant = require("Constant");

var dataKey = "UserDataModel";
var MAX_STAR = 6;

var UserDataModel = cc.Class({
    name: 'UserDataModel',
    properties: {
        levels: [cc.Integer],

        star: {
            get: function(){
                return this._star;
            }
        },

        gold: {
            get: function(){
                return this._gold;
            }
        },

        openedStages: [cc.String]
    },

    ctor: function() {
        var userData = IOUtil.readData(dataKey);
        this._levels = userData && userData.levels ? userData.levels : [0, 0, 0, 0, 0, 0];
        this._star = new  EncryptNumber(userData && userData.star ? userData.star : 1);
        this._gold = new EncryptNumber(userData && userData.gold ? userData.gold : 0);
        this._openedStages = userData && userData.openedStages ? userData.openedStages : ["0"];
        // cc.log("user data model constructor22222222222~~~~~~~~");
        this._reviveCount = userData && userData.reviveCount ? userData.reviveCount : 0;
        this._openedEntrances = userData && userData.openedEntrances ? userData.openedEntrances : {"1": false};
        cc.log("user level and star :%s, %s " , this._levels, this._star.value);
    },

    addRevive: function(){
        this._reviveCount++;
        this.saveData();
    },

    canReviveFree: function(){
        cc.log("revive count: %s, maxCount: %s", this._reviveCount, Constant.instance.MAX_FREE_REVIVE);
        return this._reviveCount < Constant.instance.MAX_FREE_REVIVE;
    },

    isAttrMaxLevel: function(attrID){
        let level = this.getAttrLevel(attrID);
        var nextLevelData = MetaDataManager.getPlayerPropertyByLevelAndID(level + 1, attrID);
        if(!nextLevelData || nextLevelData && nextLevelData.PlayerStar > this.star.value){
            // cc.log("attrID: %s ,next level: %s",attrID,  JSON.stringify(nextLevelData));
            //cc.log("next level star: %s, current star: %s, current level: %s", nextLevelData.PlayerStar, this.star, level);
            return true;
        }

        return false;
    },

    getAttrLevel: function(attrID){
        return this._levels[ Number(attrID) - 1 ];
    },

    getPrePlayerAttr: function(attrID){
        let level = this.getAttrLevel(attrID);
        return MetaDataManager.getPlayerPropertyByLevelAndID(level - 1, attrID);
    },

    getCurrentPlayerAttr: function(attrID){
        let level = this.getAttrLevel(attrID);
        return MetaDataManager.getPlayerPropertyByLevelAndID(level, attrID);
    },

    getMaxPlayerAttr: function(attrID){
        let maxLevel = MetaDataManager.getMaxLevelByStarAndID(MAX_STAR, attrID);
        return MetaDataManager.getPlayerPropertyByLevelAndID(maxLevel, attrID);
    },

    setAttrLevel:function(attrID, level){
        this._levels[Number(attrID) - 1] = level;
        this.saveData();
    },

    addLevel: function(attrID){
        if(this.isAttrMaxLevel(attrID)){
            return;
        }

        let curLevel = this.getAttrLevel(attrID);
        this._levels[Number(attrID) - 1] = curLevel + 1;
        this.saveData();
    },

    subLevel: function(attrID){
        let curLevel = this.getAttrLevel(attrID);
        let minLevel = MetaDataManager.getMinLevelByStarAndID(this._star.value, attrID);
        if(curLevel <= minLevel){
            return false;
        }

        this._levels[Number(attrID) - 1] = curLevel - 1;
        this.saveData();

        return true;
    },

    addStar: function () {
        if(this._star.value >= MAX_STAR){
            return;
        }

        this._star.add(1);
        for(let i = 1; i <= 6;  i++){
            let minLevel = MetaDataManager.getMinLevelByStarAndID(this._star.value, i);
            this.setAttrLevel(i, minLevel);
        }
        this.saveData();
    },

    isMaxStar: function(){
        cc.log("star: %s", this.star.value)
        return this.star.value == MAX_STAR;
    },

    setMaxLevel: function(){
        this._star.value = MAX_STAR;
        for(let i = 1; i <= 6;  i++){
            let maxLevel = MetaDataManager.getMaxLevelByStarAndID(this._star.value, i);
            this.setAttrLevel(i, maxLevel);
        }

        this.saveData();
    },

    addGold: function(count){
        cc.log("count: %s", count);
        count = count ? count : 0;
        this._gold.add(Number(count));
        this.saveData();
    },

    costGold: function(count){
        cc.log("count: %s", count);
        count = count ? count : 0;
        this._gold.sub(Number(count));
        this.saveData();
    },

    openStage: function(stage){
        if(this._openedStages.indexOf( stage.toString() ) < 0){
            this._openedStages.push(stage.toString());

            var allEntrances = MetaDataManager.getAllEntrances();
            for(var eID in allEntrances){
                if(this._openedEntrances[eID] === undefined && this.isEntraceEnabled(eID)){
                    this._openedEntrances[eID] = false;
                }
            }

            this.saveData();
            // cc.log("stage opened: %s", this._openedStages);
        }
    },

    isEntranceOpened: function(entranceID){
        return this._openedEntrances[entranceID]
    },

    openEntrance: function(entranceID){
        this._openedEntrances[entranceID] = true;
        this.saveData();
    },

    isStageEnabled: function(stage){
        var stageData = MetaDataManager.getStageOpenDataByID(stage);
        var index =  this._openedStages.indexOf(stageData.Preconditions);

        return index >= 0;
    },

    isEntraceEnabled: function(entranceID){
        var entranceData = MetaDataManager.getEntranceData(entranceID);
        let isStageOpen = this.isStageEnabled(entranceData.StageStart);

        cc.log("openStar: %s", entranceData.OpenStar);
        return isStageOpen && this._star.value >= Number(entranceData.OpenStar);
    },

    getTopStageInEntrance: function(entranceID){
        var entranceData = MetaDataManager.geEntranceData(entranceID);
        for(let i = entranceData.StageEnd; i >= entranceData.StageStart; i--){
            if(this.isStageEnabled(i.toString())){
                return i;
            }
        }

        return entranceData.StageStart;
    },

    getMaxOpenStage: function(){
        this._openedStages.sort(function(a, b){
            return Number(b) - Number(a); 
        });
        
        return this._openedStages[0];
    },

    isStagePassed: function(stage){
        var index =  this._openedStages.indexOf(stage);
        return index >= 0;
    },

    toMaxEnable: function(){
        return this.isAllAttrMax() && this._star.value == MAX_STAR;
    },

    starUpEnable: function(){
        return this.isAllAttrMax() && this._star.value < MAX_STAR;
    },

    isAllAttrMax: function(){
        for(let i = 1; i <= 6; i++){
            var data = MetaDataManager.getPlayerPropertyByStarAndID(this._star.value, i);
            let itemActive = data.DisplayPosition == 1;
            let isMax = this.isAttrMaxLevel(i);
            if(!isMax && itemActive){
                cc.log("all attr should be max level~~~~~~~~~~~~");
                return false;
            }
        }

        return true;
    },

    getData(){
        return {
            levels: this._levels,
            star: this._star.value,
            gold: this._gold.value,
            openedStages: this._openedStages,
            openedEntrances: this._openedEntrances
        }
    },

    getDCData: function () {
        return{
            star: this._star.value,
            health_LV: this._levels[0],
            hurt_radius_LV: this._levels[1],
            attack_distance_LV: this._levels[2],
            attack_duration_LV: this._levels[3],
            attack_interval_LV: this._levels[4],
            moving_speed_LV: this._levels[5],
            reviveCount: this._reviveCount
        }
    },


    saveData(){
        IOUtil.writeData(dataKey, this.getData());
    }
});

module.exports = UserDataModel;
