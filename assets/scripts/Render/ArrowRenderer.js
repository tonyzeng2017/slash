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
    },

    // use this for initialization
    onLoad: function () {
        let move1 = cc.moveBy(0.3, 5, 0).easing(cc.easeQuinticActionOut());
        let move2 = cc.moveBy(0.3, -5, 0).easing(cc.easeQuinticActionOut());
        if(!cc.sys.isBrowser){
            this.node.runAction(cc.RepeatForever(cc.sequence(move1, move2)));
        }
    }
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
