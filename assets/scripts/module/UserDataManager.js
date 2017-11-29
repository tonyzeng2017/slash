var UserDataModel  = require("UserDataModel");
var GameDataModel = require("GameDataModel");
var NewBieDataModel = require("NewBieDataModel");
var EnergyDataModel = require("EnergyDataModel");
var StoryDataModel = require("StoryDataModel");

var UserDataManager = cc.Class({
    statics: {
        instance: null
    },

    getUserData:function(){
        if(!this._userData){
            this._userData = new UserDataModel();
            cc.log("user data model created~~~~~~~~~~");
        }

        return this._userData;
    },

    getGameData: function(){
        if(!this._gameData){
            this._gameData = new GameDataModel();
            cc.log("game data model created~~~~~~~~~");
        }

        return this._gameData;
    },

    getNewbieData: function(){
        if(!this._newBieData){
            this._newBieData = new NewBieDataModel();
            cc.log("game data model created~~~~~~~~~");
        }

        return this._newBieData;
    },

    getEnergyData: function(){
        if(!this._energyData){
            this._energyData = new EnergyDataModel();
            cc.log("energy data model");
        }

        return this._energyData;
    },

    getStoryData: function(){
        if(!this._storyData){
            this._storyData = new StoryDataModel();
        }

        return this._storyData;
    },
});

UserDataManager.instance = new UserDataManager();
module.exports = UserDataManager;
