var IOUtil =  require("IOUtil");
const MetaDataManager = require("MetaDataManager");

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
        this._star = userData && userData.star ? userData.star : 1;
        this._gold = userData && userData.gold ? userData.gold : 0;
        this._openedStages = userData && userData.openedStages ? userData.openedStages : ["0"];
        // cc.log("user data model constructor22222222222~~~~~~~~");
        cc.log("user level and star :%s, %s " , this._levels, this._star);
    },

    isAttrMaxLevel: function(attrID){
        let level = this.getAttrLevel(attrID);
        var nextLevelData = MetaDataManager.getPlayerPropertyByLevelAndID(level + 1, attrID);
        if(!nextLevelData || nextLevelData && nextLevelData.PlayerStar > this.star){
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
        let minLevel = MetaDataManager.getMinLevelByStarAndID(this._star, attrID);
        if(curLevel <= minLevel){
            return false;
        }

        this._levels[Number(attrID) - 1] = curLevel - 1;
        this.saveData();

        return true;
    },

    addStar: function () {
        if(this._star >= MAX_STAR){
            return;
        }

        this._star++;
        for(let i = 1; i <= 6;  i++){
            let minLevel = MetaDataManager.getMinLevelByStarAndID(this._star, i);
            this.setAttrLevel(i, minLevel);
        }
        this.saveData();
    },

    setMaxLevel: function(){
        this._star = MAX_STAR;
        for(let i = 1; i <= 6;  i++){
            let maxLevel = MetaDataManager.getMaxLevelByStarAndID(this._star, i);
            this.setAttrLevel(i, maxLevel);
        }

        this.saveData();
    },

    addGold: function(count){
        cc.log("count: %s", count);
        count = count ? count : 0;
        this._gold += Number(count);
        this.saveData();
    },

    costGold: function(count){
        cc.log("count: %s", count);
        count = count ? count : 0;
        this._gold -= Number(count);
        this.saveData();
    },

    openStage: function(stage){
        if(this._openedStages.indexOf( stage.toString() ) < 0){
            this._openedStages.push(stage.toString());
            this.saveData();
            // cc.log("stage opened: %s", this._openedStages);
        }
    },

    isStageEnabled: function(stage){
        var stageData = MetaDataManager.getStageOpenDataByID(stage);
        var index =  this._openedStages.indexOf(stageData.Preconditions);

        return index >= 0;
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
            return Number(a) < Number(b);
        });
        
        return this._openedStages[0];
    },

    isStagePassed: function(stage){
        var index =  this._openedStages.indexOf(stage);
        return index >= 0;
    },

    isBest: function(){
        return this.isAllAttrMax() && this._star == MAX_STAR;
    },

    isAllAttrMax: function(){
        for(let i = 1; i <= 6; i++){
            var data = MetaDataManager.getPlayerPropertyByStarAndID(this._star, i);
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
            star: this._star,
            gold: this._gold,
            openedStages: this._openedStages
        }
    },

    getDCData: function () {
        return{
            star: this._star,
            health_LV: this._levels[0],
            hurt_radius_LV: this._levels[1],
            attack_distance_LV: this._levels[2],
            attack_duration_LV: this._levels[3],
            attack_interval_LV: this._levels[4],
            moving_speed_LV: this._levels[5],
        }
    },


    saveData(){
        IOUtil.writeData(dataKey, this.getData());
    }
});

module.exports = UserDataModel;
