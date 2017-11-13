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

        animations: [cc.Animation],
        labels: [cc.Label]
    },

    // use this for initialization
    onLoad: function () {
        var self = this;
        var count = 0;
        var finished = function(){
            cc.log("animation finished: %s", count);
            count++;
            if(self.animations[count]){
                self.animations[count].play();
            }
        }

        for(var i = 0; i < this.animations.length; i++){
            this.animations[i].on("finished", finished, true);
        }

        this.animations[count].play();
    }

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
