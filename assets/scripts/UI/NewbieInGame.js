var Types = require("Types")
var GameManager = require("GameManager")

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
        newbieInGame: cc.Prefab
    },

    // use this for initialization
    onLoad: function () {
        GameManager.instance.updateScene(Types.sceneType.BATTLE_NORMAL);

        var newbieNode = cc.instantiate(this.newbieInGame);
        newbieNode.x = 160;
        newbieNode.y = 60;
        this.node.addChild(newbieNode);

        var newbieAnim = newbieNode.getComponent(cc.Animation);
        newbieAnim.play();
        newbieAnim.on("finished", function(){
            cc.log("newbie in game animation finished");
            cc.director.loadScene('PlayGame');
        }, this);
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
