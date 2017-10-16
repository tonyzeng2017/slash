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
        touchHandler: cc.Component.EventHandler
    },

    // use this for initialization
    onLoad: function () {
        // if(cc.sys.isMobile) {
            this.node.on(cc.Node.EventType.TOUCH_END, function(event){
                if(cc.sys.isMobile) {
                    event.stopPropagation();
                    cc.Component.EventHandler.emitEvents([this.touchHandler]);
                    cc.log("on guide touch mask end~~~~~~~~~");
                }
            }, this);
        // }else{
            this.node.on(cc.Node.EventType.MOUSE_UP, function(event){
                if(!cc.sys.isMobile) {
                    event.stopPropagation();
                    cc.Component.EventHandler.emitEvents([this.touchHandler]);
                    cc.log("on guide MOUSE_UP mask end~~~~~~~~~");
                }
            }, this);
        // }
    }
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {
    // },
});
