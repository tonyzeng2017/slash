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
        globalTouchHandler: cc.Component.EventHandler
    },

    // use this for initialization
    onLoad: function () {

        // if(cc.sys.isMobile) {
            this.node.on(cc.Node.EventType.TOUCH_END, function(event){
                if(cc.sys.isMobile) {
                    cc.log("on global touch mask end~~~~~~~~~");
                    event.stopPropagation();
                    cc.Component.EventHandler.emitEvents([this.globalTouchHandler], event);
                }
            }, this);
        // }else{
            this.node.on(cc.Node.EventType.MOUSE_UP, function(event){
                if(!cc.sys.isMobile){
                    cc.log("on global MOUSE_UP mask end~~~~~~~~~");
                    event.stopPropagation();
                    cc.Component.EventHandler.emitEvents([this.globalTouchHandler], event);
                }
            }, this);
        // }
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
