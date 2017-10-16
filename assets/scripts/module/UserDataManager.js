var UserDataModel  = require("UserDataModel");
var GameDataModel = require("GameDataModel");
var NewBieDataModel = require("NewBieDataModel");

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
    }
});

UserDataManager.instance = new UserDataManager();
module.exports = UserDataManager;
