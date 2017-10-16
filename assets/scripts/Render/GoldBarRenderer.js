var UserDataManager = require("UserDataManager");

cc.Class({
    extends: cc.Component,

    properties: {
        txtGold: cc.Label,
        storeUI: cc.Node
    },

    // use this for initialization
    onLoad: function () {
        this.updateGold();
    },

    onAddGold:function(){
        this.storeUI.getComponent("StoreUI").show();
    },

    updateGold: function(){
        let gold = UserDataManager.instance.getUserData().gold;
        this.txtGold.string = gold;
        cc.log("the user gold: %s", gold);
    }
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
