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
        storeUI: cc.Node,
        playerUI: cc.Node,
        upgradeUI: cc.Node
    },

    // use this for initialization
    onLoad: function () {
        var self = this;
        this.node.on('gold_changed', function (event) {
            event.stopPropagation();
            self.updateGold();
        });

        cc.log("canvas gold changed~~~~~~~~~~~~~")
    },

    updateGold: function(){
        this.storeUI.getComponent("StoreUI").updateGold();
        this.playerUI.getComponent("GoldBarRenderer").updateGold();
        this.upgradeUI.getComponent("GoldBarRenderer").updateGold();
    }
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
