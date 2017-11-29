
var UserDataManager = require("UserDataManager")
var MetaDataManager = require("MetaDataManager")

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
        buffID: cc.String,
        frames: [cc.SpriteFrame],
        buffs: [cc.Node]
    },

    // use this for initialization
    onLoad: function () {

    },

    updateBuff: function(){

        var buffCount = UserDataManager.instance.getGameData().getBuffCount(this.buffID);
        var buffData = MetaDataManager.getBuffDisplayData(this.buffID, buffCount);
        if(!buffData){
            return;
        }

        cc.log("buff updated, buffID: %s, count: %s", this.buffID, buffCount);
        if(Number(this.buffID) == 2){
            if(buffCount == 0){
                this.node.getComponent(cc.Sprite).spriteFrame = this.frames[0];
            }else{
                var buffAnimation = Number(buffData.BuffAnimation);
                cc.log("buff updated, sword changed to frame: %s", buffAnimation);
                this.node.getComponent(cc.Sprite).spriteFrame = this.frames[buffAnimation];
            }
        }else{
            if(buffCount == 0){
                this.node.active = false;
            }else{
                this.node.active = true;
                var buffAnimation = Number(buffData.BuffAnimation);
                for(var i = 0; i < this.buffs.length; i++){
                    this.buffs[i].active = (i+1) == Number(buffAnimation);

                    if(Number(this.buffID)!=6){
                        this.buffs[i].getComponent(cc.Animation).play();
                    }
                }
            }
        }
    }
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
