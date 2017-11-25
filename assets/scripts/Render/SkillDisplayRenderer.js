var UserDataManager = require("UserDataManager")
var Constant = require("Constant")

cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //    default: null,      // The default value will be used only when the component attaching
        //                           to a node for the first time
        //    url: cc.Texture2D,  // optional, default is typeof default
        //    serializable: true, // optional, default is true
        //    visible: true,      // optional, default is true
        //    displayName: 'Foo', // optional
        //    readonly: false,    // optional, default is false
        // },
        // ...
        mask: cc.Node,
        total_height: 72
    },

    init: function(game){
        this.game = game;
    },

    // use this for initialization
    onLoad: function () {
        this.updateEnergy();
    },

    onUseEnergy: function(){
        var energyDataModel = UserDataManager.instance.getEnergyData();
        if(!energyDataModel.isUniqueEnabled()){
            return;
        }

        this.game.releaseSkills();
        energyDataModel.useEnergy();
        this.updateEnergy();
    },

    updateEnergy: function(){
        var energyDataModel = UserDataManager.instance.getEnergyData();
        var totalEnergy = energyDataModel.totalEnergy;
        var percent = totalEnergy / Constant.instance.MAX_ENERGY;

        this.mask.height = this.total_height * percent;
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
