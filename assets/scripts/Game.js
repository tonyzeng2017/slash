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
        uniqueMask: cc.Node,
        // deathUI: cc.Node,
        cameraRoot: cc.Animation,
        gameWinPrefab: cc.Prefab,
        gameFailPrefab: cc.Prefab,
        reviveUIPrefab: cc.Prefab,
        story: cc.Prefab,
        audioGameWin: cc.AudioClip,
        audioGameFail: cc.AudioClip,
        newbieLife: cc.Node,
        uniqueSkillPrefab: cc.Prefab,
        playerVanishPrefab: cc.Prefab,

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

    playStory: function(storyID, callback){

        var self = this;
        var onFinished = function(){
            if(self._storyUI){
                self.node.removeChild(self._storyUI);
            }
            if(callback){
                callback();
            }
        }

        if(UserDataManager.instance.getStoryData().canPlay(storyID)){//GameManager.instance.storyEnabled(storyID)){
            this._storyUI = cc.instantiate(this.story);
            this._storyUI.x = cc.director.getWinSize().width/2;
            this._storyUI.y = cc.director.getWinSize().height/2;
            cc.log("storyID: %s", storyID);
            this._storyUI.getComponent("StoryRenderer").setStoryAndCallback(storyID, onFinished);
            this.node.addChild(this._storyUI);

            UserDataManager.instance.getStoryData().activeStory(storyID);
            // GameManager.instance(storyID);
       }else{
            onFinished();
       }
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

    releaseSkills(){
        var self = this;
        var uniqueSkill = cc.instantiate(this.uniqueSkillPrefab);
        var playerVanish = cc.instantiate(this.playerVanishPrefab);

        var killAllFoes = function(){
            let nodeList = self.foeGroup.children;
            for (let i = 0; i < nodeList.length; ++i) {
                let foe = nodeList[i].getComponent('Foe');
                if (foe) {
                    foe.dead(true);                
                } else {
                    let projectile = nodeList[i].getComponent('Projectile');
                    if (projectile) {
                        projectile.broke();                    
                    }
                }
            }
        };

        var fadeOutMask = function(){
            playerVanish.getComponent(cc.Animation).off("finished", fadeOutMask, true);
            playerVanish.removeFromParent();
            killAllFoes();
            
            self.uniqueMask.runAction(cc.fadeTo(0.2, 0));
            GameManager.instance.setPaused(false);
            cc.log("unique skills, fadeOutMask");
        };

        var playerIn = function(){
            uniqueSkill.getComponent(cc.Animation).off("finished", playerIn, true);
            uniqueSkill.removeFromParent();
            
            playerVanish.getComponent(cc.Animation).play();
            playerVanish.getComponent(cc.Animation).on("finished", fadeOutMask, true);
            self.player.node.active = true;
            cc.log("unique skills, playerIn");
        };

        var playUniqueSkill = function(){
            playerVanish.getComponent(cc.Animation).off("finished", playUniqueSkill, true);

            var uniqueAnim = uniqueSkill.getComponent(cc.Animation);
            uniqueAnim.on("finished", playerIn, true);
            self.node.addChild(uniqueSkill);
            uniqueAnim.play();
            cc.log("unique skills, playUniqueSkill");
        };

        var playerOut = function(){
            self.player.node.active = false;

            playerVanish.x = self.player.node.x;
            playerVanish.y = self.player.node.y;
            self.foeGroup.addChild(playerVanish);
            playerVanish.getComponent(cc.Animation).play();
            playerVanish.getComponent(cc.Animation).on("finished", playUniqueSkill, true);
            cc.log("unique skills, playerOut");
        };

        var fadeInMask =  function(){
            GameManager.instance.setPaused(true);
            self.uniqueMask.active = true;
            self.uniqueMask.runAction(cc.sequence(
                cc.fadeTo(0.1, 180),
                cc.callFunc( playerOut)
            ));
            cc.log("unique skills, fadeInMask");
        };

        cc.log("game release unique skills");
        fadeInMask();
    },

    playerReady: function (isRevive) {
        this.resume();
        if(!isRevive){
            if(!UserDataManager.instance.getNewbieData().isInGameFinished){
                this.newbieLife.active = true;
            }else{
                this.waveMng.startWave();
            }
        }
        this.player.node.active = true;
        this.player.ready();
    },

    onNewbieLife: function(){
        UserDataManager.instance.getNewbieData().finishInGame();
        this.newbieLife.active = false;
        this.waveMng.startWave();
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

        var self = this;
        var doGameOver = function(){
            GameManager.instance.pauseMusic();
            UserDataManager.instance.getGameData().saveData();
            self.hideRevive();
    
            TDProxy.onEvent("play_finish", {duration: Date.now() - self.startTime, result: isWin});
            self.startTime = 0;
    
            if(isWin){
                var curStage = GameManager.instance.curStageID;
                UserDataManager.instance.getUserData().openStage(curStage);
                // this.gameWinUI.show();
                self.showGameWin();
            }else{
                self.showGameFail();
                if(GameManager.instance.isFirstDead()){
                    TDProxy.onEvent("first_dead", {mapID: GameManager.instance.mapID, stageID: GameManager.instance.curStageID});
                }
                GameManager.instance.countDead();
            }
            
            UserDataManager.instance.getEnergyData().clear();
        }

        var stageData = GameManager.instance.getCurStageData();
        this.playStory(stageData.StoryComplete, doGameOver);
    },

    restart: function () {
        GameManager.instance.setPaused(false);
        cc.director.loadScene('PlayGame');
    }
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
