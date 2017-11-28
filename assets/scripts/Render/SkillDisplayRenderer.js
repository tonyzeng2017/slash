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
        total_height: 72,
        firstEnabledAnim: cc.Animation,
        enabledAnim: cc.Animation,
        releaseAnim: cc.Animation
    },

    init: function(game){
        this.game = game;
    },

    // use this for initialization
    onLoad: function () {
        this.updateEnergy(false);
    },

    onUseEnergy: function(){
        var energyDataModel = UserDataManager.instance.getEnergyData();
        if(!energyDataModel.isUniqueEnabled()){
            return;
        }

        this.game.releaseSkills();
        energyDataModel.useEnergy();
        this.updateEnergy();
        
        this.releaseAnim.node.active = true;
        this.releaseAnim.play();

        this.firstEnabledAnim.node.active = false;
        this.enabledAnim.node.active = false;
    },

    updateEnergy: function(isFirstFull){
        var energyDataModel = UserDataManager.instance.getEnergyData();
        var totalEnergy = energyDataModel.totalEnergy;
        var percent = totalEnergy / Constant.instance.MAX_ENERGY;

        if(isFirstFull){
            this.firstEnabledAnim.node.active = true;
            this.firstEnabledAnim.play();

            this.enabledAnim.node.active = true;
            this.enabledAnim.play();

            cc.log("energy is full~~~~~~~~~`");
        }

        this.mask.height = this.total_height * percent;
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
