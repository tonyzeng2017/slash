cc.Class({
    extends: cc.Component,

    properties: {
        totalWidth: 525,
        bar: cc.Node
    },

    // use this for initialization
    init (bossManager) {
        this.bossManager = bossManager;
        this.bar.width = this.totalWidth;
    },

    updateProgress(){
        this.bar.width = this.totalWidth * (1-this.bossManager.getHPPercent());
        if(this.bossManager.getHPPercent() >= 1){
            this.hide();
        }
    },

    show () {
        this.node.active = true;
        this.updateProgress();
    },

    hide () {
        this.node.active = false;
    }

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
