var Constant = require("Constant")
var MetaDataManager = require("MetaDataManager");

cc.Class({
    extends: cc.Component,

    properties: {
        labelCombo: cc.Label,
        spFlare: cc.Sprite,
        anim: cc.Animation,
        comboColors: [cc.Color],
        showDuration: 0
    },

    onLoad:function(){
        // cc.log("comboDuarion: %s", Constant.instance.comboDuration);
        this.showDuration = Constant.instance.comboDuration/1000;
        cc.log("show duration: %s", this.showDuration);
    },

    init () {
        this.comboCount = 0;
        this.node.active = false;
        this.showTimer = 0;
    },

    trim(str){ //删除左右两端的空格
        return str.replace(/(^\s*)|(\s*$)/g, "");
    },

    // use this for initialization
    playCombo () {
        this.comboCount++;
        this.node.active = true;
        // this.unschedule(this.hide);
        //let colorIdx = Math.min(Math.floor(this.comboCount / 10), this.comboColors.length - 1);
        
        let colorIdx =  MetaDataManager.getComboColor(this.comboCount);
        this.spFlare.node.color = this.comboColors[colorIdx];
        this.labelCombo.node.color = this.comboColors[colorIdx];
        this.labelCombo.string = this.trim(this.comboCount.toString());
        this.anim.play('combo-pop');
        this.showTimer = 0;
        // this.scheduleOnce(this.hide.bind(this), this.showDuration );
    },

    // called every frame, uncomment this function to activate update callback
    hide () {
        this.comboCount = 0;
        this.node.active = false;
    },

    update (dt) {
        if (!this.node.active) {
            return;
        }

        this.showTimer += dt;
        if (this.showTimer >= this.showDuration) {
            this.hide();
        }
    }
});
