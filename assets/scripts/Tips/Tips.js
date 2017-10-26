cc.Class({

    extends: cc.Component,
    properties: {
        label: cc.Label,
    },

    setText: function(text){
        var label = this.node.getChildByName("label").getComponent(cc.Label);
        label.string = text;
    },
    
    // 做完动画后删除自身
    onFinish: function () {
        this.node.destroy();
        cc.log("tip destroyed~~~~~");
    }
});
