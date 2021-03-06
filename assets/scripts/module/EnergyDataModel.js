var GameManager = require("GameManager");
var Constant = require("Constant")

var EnergyDataModel = cc.Class({

    name: 'EnergyDataModel',

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
        totalEnergy: 0,
    },

    ctor: function() {
        this.totalEnergy = 0;
    },

    addEnergy: function(energy){
        var stageData = GameManager.instance.getCurStageData();

        if(this.totalEnergy < Constant.instance.MAX_ENERGY ){
            this.totalEnergy += energy * stageData.StageEnergy/100;
            cc.log("total energy: %s, max energy: %s", this.totalEnergy, Constant.instance.MAX_ENERGY)
            if(this.totalEnergy >= Constant.instance.MAX_ENERGY){
                return true;
            }else{
                return false;
            }
        }else{
            return false
        }
    },

    isUniqueEnabled: function(){
        return this.totalEnergy >= Constant.instance.MAX_ENERGY;
    },

    useEnergy: function(){
        this.totalEnergy = 0;
    },

    clear: function(){
        this.totalEnergy = 0;
    }
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});

module.exports = EnergyDataModel;
