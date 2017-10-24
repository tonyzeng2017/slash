var MetaDataManager = require("MetaDataManager");
var UserDataManager = require("UserDataManager");
var GameManager = require("GameManager");
const Types = require('Types');

cc.Class({
    extends: cc.Component,

    properties: {
        player: cc.Node,
        inGameUI: cc.Node,
        playerFX: cc.Node,
        waveMng: cc.Node,
        bossMng: cc.Node,
        poolMng: cc.Node,
        foeGroup: cc.Node,
        // deathUI: cc.Node,
        cameraRoot: cc.Animation,
        gameWinPrefab: cc.Prefab,
        gameFailPrefab: cc.Prefab,
        reviveUIPrefab: cc.Prefab,
        audioGameWin: cc.AudioClip,
        audioGameFail: cc.AudioClip,

        startTime: {
            default: 0,
            visible: false
        },

        gameType: {
            visible: false,
            default: Types.GameType.NORMAL
        }
    },

    // use this for initialization
    onLoad () {
        if(GameManager.instance.isBossStage){
            GameManager.instance.updateScene(Types.sceneType.BATTLE_BOSS);
        }else{
            GameManager.instance.updateScene(Types.sceneType.BATTLE_NORMAL);
        }

        UserDataManager.instance.getGameData().clear();
        this.playerFX = this.playerFX.getComponent('PlayerFX');
        this.playerFX.init(this);
        this.player = this.player.getComponent('Player');
        this.player.init(this);
        this.player.node.active = false;
        this.poolMng = this.poolMng.getComponent('PoolMng');
        this.poolMng.init();
        this.bossMng = this.bossMng.getComponent('BossMng');
        this.bossMng.init(this);
        this.waveMng = this.waveMng.getComponent('WaveMng');
        this.waveMng.init(this);
        this.sortMng = this.foeGroup.getComponent('SortMng');
        this.sortMng.init();

        this.startTime = 0;
    },

    start () {
        GameManager.instance.setPaused(false);
        this.startTime = Date.now();
        TDProxy.onEvent("play_start", {});

        this.playerFX.playIntro();
        // UI initialization
        this.inGameUI = this.inGameUI.getComponent('InGameUI');
        this.inGameUI.init(this);
    },

    pause () {
        let scheduler = cc.director.getScheduler();
        scheduler.pauseTarget(this.waveMng);
        this.sortMng.enabled = false;
        GameManager.instance.setPaused(true);
        cc.log("game paused~~~~~~~~~~~~");
    },

    resume () {
        let scheduler = cc.director.getScheduler();
        scheduler.resumeTarget(this.waveMng);
        this.sortMng.enabled = true;
        GameManager.instance.resumeMusic();
    },
    
    cameraShake () {
        this.cameraRoot.play('camera-shake');  
    },

    checkGameOver(){
        if(this.gameType == Types.GameType.STEP){
            var slashCount = UserDataManager.instance.getGameData().slashCount;
        }
        else if(this.gameType == Types.GameType.CD){
            
        }
        else{

        }
    },

    death () {
        this.showRevive();
        this.pause();
    },

    revive () {
        cc.log("game revive~~~~~~~~~~~~~~~~");
        // this.reviveUI.hide();
        GameManager.instance.setPaused(false);
        this.playerFX.playRevive();
        this.player.revive();
        //记录总共revive次数
        UserDataManager.instance.getUserData().addRevive();
        //记录单场revive次数
        UserDataManager.instance.getGameData().addRevive();
        cc.log("this.player.revive() called~~~~~~~~~~~~~~~~");
    },
    
    clearAllFoes () {
        let nodeList = this.foeGroup.children;
        for (let i = 0; i < nodeList.length; ++i) {
            let foe = nodeList[i].getComponent('Foe');
            if (foe) {
                foe.dead();                
            } else {
                let projectile = nodeList[i].getComponent('Projectile');
                if (projectile) {
                    projectile.broke();                    
                }
            }
        }
    },

    playerReady: function (isRevive) {
        this.resume();
        if(!isRevive){
            this.waveMng.startWave();
        }
        this.player.node.active = true;
        this.player.ready();
    },

    createRevive: function() {
        if (!this._reviveUI) {
            this._reviveUI = cc.instantiate(this.reviveUIPrefab);
            this._reviveUI.getComponent("GameReviveUI").init(this);
            this.node.addChild(this._reviveUI);
        }

        return this._reviveUI.getComponent("GameReviveUI")
    },

    hideRevive: function(){
        var reviveUI =  this.createRevive();
        reviveUI.hide();
    },

    showRevive: function(){
        var reviveUI =  this.createRevive();
        reviveUI.show();
    },

    showGameWin: function(){
        if(!this._gameWinUI){
            this._gameWinUI = cc.instantiate(this.gameWinPrefab);
            this._gameWinUI.getComponent("GameWinUI").init(this);
            this.node.addChild(this._gameWinUI);
            this._gameWinUI.getComponent("GameWinUI").show();
            // cc.log("winsize: %s, %s", this._pauseUI.x, this._pauseUI.y);
        }else{
            this._gameWinUI.getComponent("GameWinUI").show();
        }

        GameManager.instance.playSound(this.audioGameWin, false, 1);
    },

    showGameFail: function(){
        if(!this._gameFailUI){
            this._gameFailUI = cc.instantiate(this.gameFailPrefab);
            this._gameFailUI.getComponent("GameFailUI").init(this);
            this.node.addChild(this._gameFailUI);
            this._gameFailUI.getComponent("GameFailUI").show();
            // cc.log("winsize: %s, %s", this._pauseUI.x, this._pauseUI.y);
        }else{
            this._gameFailUI.getComponent("GameFailUI").show();
        }

        GameManager.instance.playSound(this.audioGameFail, false, 1);
    },

    gameOver: function (isWin) {
        GameManager.instance.pauseMusic();
        UserDataManager.instance.getGameData().saveData();
        this.hideRevive();

        TDProxy.onEvent("play_finish", {duration: Date.now() - this.startTime, result: isWin});
        this.startTime = 0;

        if(isWin){
            var curStage = GameManager.instance.curStageID;
            UserDataManager.instance.getUserData().openStage(curStage);
            // this.gameWinUI.show();
            this.showGameWin();
        }else{
            this.showGameFail();
            if(GameManager.instance.isFirstDead()){
                TDProxy.onEvent("first_dead", {mapID: GameManager.instance.mapID, stageID: GameManager.instance.curStageID});
            }
            GameManager.instance.countDead();
        }

    },

    restart: function () {
        GameManager.instance.setPaused(false);
        cc.director.loadScene('PlayGame');
    }
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
