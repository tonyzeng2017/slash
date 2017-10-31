var UserDataManager = require("UserDataManager");

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
        stars_dark: [cc.Node],
        stars_light: [cc.Node],
    },

    // use this for initialization
    onLoad: function () {
        let star = UserDataManager.instance.getUserData().star;
        this.showStar(star);

        cc.log("updated the star: %s", star);
    },

    showStar(star){
        for(let i = 0; i < 6; i++ ){
            this.stars_dark[i].active = i > star-1;
            this.stars_light[i].active = i <= star-1;
        }
    },

    // resignStars: function(){
    //     for(let i = 0; i < 6; i++ ) {
    //         this.stars_dark[i].setPosition(- 403 + 700 * (i+1)/6, -287);
    //         this.stars_light[i].setPosition( - 403 + 700 * (i+1)/6, -287);
    //     }
    // }

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
