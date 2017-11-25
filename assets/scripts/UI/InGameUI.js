var GameManager = require("GameManager");
var UserDataManager = require("UserDataManager");
var MetaDataManager = require("MetaDataManager");
var Constant = require("Constant");

cc.Class({
    extends: cc.Component,

    properties: {
        waveUI: cc.Node,
        killDisplay: cc.Node,
        comboDisplay: cc.Node,
        txt_life: cc.Label,
        txt_score: cc.Label,
        txt_level:cc.Label,
        lifeAni: cc.Animation,
        // waveProgress: cc.Node
        pausePrefab: cc.Prefab,
        bg: cc.Sprite,
        audioPause: cc.AudioClip,
        warning_bg: cc.Sprite,
        buffDisplay: cc.Node,
        skillDisplay: cc.Node
    },

    // use this for initialization
    init (game) {
        this._game = game;

        this.skillDisplay.getComponent("SkillDisplayRenderer").init(game);
        this.waveUI = this.waveUI.getComponent('WaveUI');
        this.waveUI.node.active = false;
        this.killDisplay = this.killDisplay.getComponent('KillDisplay');
        this.killDisplay.node.active = false;
        this.comboDisplay = this.comboDisplay.getComponent('ComboDisplay');
        this.comboDisplay.init();
        this.updateLife();

        // cc.log("this.game onload6");
        this.txt_score.string = "0";
        this.txt_level.string = GameManager.instance.curStageID;
        // this.waveProgress = this.waveProgress.getComponent('WaveProgress');
        // this.waveProgress.init(game.waveMng);
        var stageData = MetaDataManager.getStageDataByID(GameManager.instance.curStageID);
        var self = this;
        cc.loader.loadRes("stage_bg/" + stageData.MapPic, cc.SpriteFrame, function (err, spriteFrame) {
            // cc.Texture2D.defaultPixelFormat = cc.Texture2D.PIXEL_FORMAT_RGB888;
            self.bg.spriteFrame = spriteFrame;
            // cc.Texture2D.defaultPixelFormat = cc.Texture2D.PIXEL_FORMAT_RGBA4444;
            cc.loader.setAutoReleaseRecursively(spriteFrame, true);
        });
        cc.log("bg name: %s", stageData.MapPic);
    },

    updateLife(costLife){
        this.txt_life.string = this._game.player.life;
        if(this.lifeAni && costLife){
            this.lifeAni.node.active = true;
            this.lifeAni.play();

            let life_limit = Math.ceil( Constant.instance.WARNING_LIFE * this._game.player.life );
            if(this._game.player.life == life_limit && this.warning_bg){
                this.warning_bg.node.active = true;
                // let blink = cc.blink(10000, 10000);
                let seq = cc.sequence(cc.fadeIn(0.5), cc.fadeOut(0.5));
                this.warning_bg.node.runAction(cc.repeatForever(seq));
            }
            // cc.log("life animation played~~~~~~")
        }
    },

    updateEnergy: function(){
        var totalEnergy = UserDataManager.instance.getEnergyData().totalEnergy;
        //update the renderer according to the energy.
        this.skillDisplay.getComponent("SkillDisplayRenderer").updateEnergy();
    },  

    dead: function(){
        if(this.warning_bg){
            this.warning_bg.node.stopAllActions();
            this.warning_bg.node.active = false;
        }
    },

    hideWarning: function(){
        this.warning_bg.node.stopAllActions();
        this.warning_bg.node.active = false;
    },

    showWave (num) {
        this.waveUI.node.active = true;
        this.waveUI.show(num);
    },
    
    showKills (num) {
        this.killDisplay.playKill(num);
    },
    
    addCombo () {
        this.comboDisplay.playCombo();
    },

    addBuffDisplay(buffType){
        this.buffDisplay.getComponent("BuffDisplayer").addBuffItem(buffType);
        this.updateLife();
    },

    getCombo(){
        return this.comboDisplay.comboCount;
    },

    showScore(){
        cc.log("total score: %s", UserDataManager.instance.getGameData().totalScore);
        this.txt_score.string = UserDataManager.instance.getGameData().totalScore;
    },

    onPauseClick() {
        if(this._game.player.isDead() || !UserDataManager.instance.getNewbieData().isInGameFinished ){
            cc.log("onPause clicked ignored~~~~~~~~~~~~~");
            return;
        }

        GameManager.instance.setPaused(true);//!GameManager.instance.isPaused;
        GameManager.instance.playSound(this.audioPause, false, 1);

        if(!this._pauseUI){
            this._pauseUI = cc.instantiate(this.pausePrefab);
            this._pauseUI.getComponent("GamePauseUI").init(this._game);
            this.node.addChild(this._pauseUI);
            this._pauseUI.getComponent("GamePauseUI").show();
            cc.log("winsize: %s, %s", this._pauseUI.x, this._pauseUI.y);
        }else{
            this._pauseUI.getComponent("GamePauseUI").show();
        }
    },

    onShortWin(){
        this._game.gameOver(true);
    },

    onShortLose(){
        this._game.gameOver(false);
    }
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
