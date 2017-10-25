var MetaDataManager = require("MetaDataManager");

cc.Class({
    extends: cc.Component,

    properties: {
        labelKills: cc.Label,
        anim: cc.Animation
    },
    
    playKill (kills) {
        var oneSlashScore = MetaDataManager.getOneSlashDataByCount(kills);
        var scale = oneSlashScore.Scale ? oneSlashScore.Scale/100 : 1;

        this.node.active = true;
        this.node.scale = scale;
        this.labelKills.string = kills;
        this.anim.play('kill-pop');
    },
    
    hide () {
        this.node.active = false;
    }

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
