var TipsManager = cc.Class({
    extends: cc.Component,

    properties: {
        tipsPrefab: cc.Prefab
    },

    statics: {
        init: null
    },

    onLoad: function () {
        TipsManager.init = this;
        var screen = cc.view.getVisibleSize();
        this.node.x = screen.width / 2;
        this.node.y = screen.height / 2;
        cc.game.addPersistRootNode(this.node);
    },

    showTips: function (message) {
        var node = cc.instantiate(this.tipsPrefab);
        node.parent = this.node;
        node.position = cc.p(0, 0);
        //var label = node.getChildByName("label").getComponent(cc.Label);
        var text = message || "没有添加消息！";
        node.getComponent("Tips").setText(text);
    }
});
