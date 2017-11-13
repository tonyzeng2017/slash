cc.Class({
    extends: cc.Component,

    properties: {
        bar: cc.ProgressBar,
        head: cc.Node,
        lerpDuration: 0,
        textProgress: cc.Label,
        textCount: cc.Label
    },

    onLoad () {
    },

    // use this for initialization
    init (waveMng) {
        this.waveMng = waveMng;
        this.bar.progress = 0.01;
        this.curProgress = 0;
        this.destProgress = 0;
        this.timer = 0;
        this.isLerping = false;
    },

    updateProgress (killedFoe, waveTotalFoes) {
        let ratio = Math.min(killedFoe /waveTotalFoes, 1);

        var progress = Math.max(ratio, 0.01);
        this.curProgress = this.bar.progress;
        this.destProgress = progress;
        this.timer = 0;
        this.isLerping = true;
        // this.updateCount(waveTotalFoes - killedFoe, waveTotalFoes);
    },

    updateCount(leftCount, totalCount){
        // if(this.textCount){
            this.textCount.string = "怪物数量: " + leftCount + "/" + totalCount;
            // cc.log("text updated~~~~~~~~~: %s, %s", leftCount, totalCount);
        // }
        // else{
            // cc.log("this.text don't exist~~~");
        // }
    },
    
    updateWaveText: function (curWave, totalWave) {
        this.textProgress.string = curWave + "/" + totalWave;
    },
    

    // called every frame, uncomment this function to activate update callback
    update: function (dt) {
        if (this.isLerping === false) {
            return;
        }
        this.timer += dt;
        if (this.timer >= this.lerpDuration) {
            this.timer = this.lerpDuration;
            this.isLerping = false;
        }
        this.bar.progress = cc.lerp(this.curProgress, this.destProgress, this.timer/this.lerpDuration);
        let headPosX = this.bar.barSprite.node.width * this.bar.progress;
        this.head.x = headPosX;
    },
});
