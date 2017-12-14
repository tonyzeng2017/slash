const Foe = require('Foe');
const FoeType = require('Types').FoeType;
const BossType = require('Types').BossType;
// const FoeTypeMap = require('Types').FoeTypeMap;
const Spawn = require('Spawn');
var  MetaDataManager = require('MetaDataManager');
var GameManager = require("GameManager");
var UserDataManager = require("UserDataManager");

const Wave = cc.Class({
    name: 'Wave',
    properties: {
        spawns: {
            default: [],
            type: Spawn
        },
        bossType: {
            default: BossType.Demon,
            type: BossType
        }
    },

    statics: {
        create: function(waveData){
            var wave = new Wave();
            wave.bossType = BossType.Demon;
            wave.spawns = [];
            var spawnIDs = waveData.SpawnID.split(",");
            //cc.log("spawnID length: " + spawnIDs.length);
            for (var i = 0 ; i < spawnIDs.length; i++ ) {
                var spawnData = MetaDataManager.getSpawnDataByID(spawnIDs[i]);
                if(spawnData){
                    var spawn =  Spawn.create(spawnData);
                    spawn.ID  = spawnIDs[i];
                    if(i == waveData.BossAppear){
                        spawn.isCompany = true;
                        spawn.bossSpawnID = waveData.BossID;
                        cc.log("boss appeared: %s", spawn.bossSpawnID);
                    }

                    wave.spawns.push(spawn);
                }else{
                    cc.error("the spawn data for ID: %s doesn't exist~", spawnIDs[i]);
                }
            }

            wave.init();
            return wave;
        }
    },
    
    init () {
        this.totalFoes = 0;
        this.spawnIdx = 0;
        for (let i = 0; i < this.spawns.length; ++i) {
            // if (this.spawns[i].isCompany === false) {
                this.totalFoes += this.spawns[i].total;
            // }
            // cc.log("spawn: %s, is company: %s", this.spawns[i].ID, this.spawns[i].isCompany);
        }
    },

    getNextSpawn () {// return next spawn
        this.spawnIdx++;
        if (this.spawnIdx < this.spawns.length) {
            return this.spawns[this.spawnIdx];
        } else {
            return null;
        }
    }
});

cc.Class({
    extends: cc.Component,

    properties: {
        waves: {
            default: [],
            type: Wave
        },
        startWaveIdx: 0,
        spawnMargin: 0,
        killedFoe: {
            visible: false,
            default: 0,
            notify: function () {
                if (!this.currentWave || !this.waveTotalFoes ) {
                    return;
                }
                if (this.waveTotalFoes && this.killedFoe >= this.waveTotalFoes) {
                    cc.log("waves ended~~~~~~~~~~~~~~~~");
                    this.endWave();
                }
                if (this.waveProgress && this.waveTotalFoes) {
                    var killedTotal = UserDataManager.instance.getGameData().killedCount;
                    
                    this.waveProgress.updateProgress(this.killedFoe, this.waveTotalFoes);
                    this.waveProgress.updateWaveText(this.waveIdx + 1, this.waves.length);
                    this.waveProgress.updateCount(this.stageTotalFoes - killedTotal, this.stageTotalFoes);
                }
            }
        },
        stageTotalFoes: {
            visible: false,
            default: 0
        },
        waveProgress: cc.Node,
        bossAppearAni: cc.Animation,
        bossProgress: cc.Node,
        audioNewWave: cc.AudioClip,
        audioProjectiles: [cc.AudioClip]
    },

    // use this for initialization
    init (game) {
        let stageData = MetaDataManager.getStageDataByID(GameManager.instance.curStageID);
        if (!stageData){
            cc.log("curStageID: %s doesn't exist~~~~~~~~", GameManager.instance.curStageID);
        }

        this.stageTotalFoes = 0;
        var wavesIDs = stageData.WavesID.split(",");
        var newWaves = [];
        for (let i = 0 ; i < wavesIDs.length; i++ ){
            let waveData = MetaDataManager.getWaveDataByID(wavesIDs[i]);
            var wave = Wave.create(waveData);
            newWaves.push(wave);
            this.stageTotalFoes += wave.totalFoes;
        }
        //cc.log("sorted waves data: ", JSON.stringify( this.waves.length));
        this.waves = newWaves;
        
        this.game = game;
        this.player = game.player;
        this.foeGroup = game.foeGroup;
        this.waveIdx = this.startWaveIdx;
        this.spawnIdx = 0;
        this.currentWave = this.waves[this.waveIdx];
        
        this.waveProgress = this.waveProgress.getComponent('WaveProgress');
        this.waveProgress.init(this);
        this.bossProgress = this.bossProgress.getComponent('BossProgress');
        this.bossProgress.init(this.game.bossMng);
    },
    
    start(){
        cc.log("started~~~~~~~~~~~: " +  this.waves.length);
    },

    startSpawn () {
        this.unschedule(this.spawnFoe);
        this.node.runAction(cc.callFunc(function(){
            this.schedule(this.spawnFoe, this.currentSpawn.spawnInterval);
        }.bind(this)));
    },

    startBossSpawn (bossSpawn) {
        this.bossSpawn = bossSpawn;
        this.waveTotalFoes += bossSpawn.total;
        this.stageTotalFoes += bossSpawn.total;
        // this.killedFoe = 0;
        this.schedule(this.spawnBossFoe, bossSpawn.spawnInterval);
    },

    endSpawn () {
        let nextSpawn = this.currentWave.getNextSpawn();
        if (nextSpawn) {
            this.currentSpawn = nextSpawn;
            this.startSpawn();
            cc.log("nextSpawn : %s, isCompany: %s",nextSpawn.ID, nextSpawn.isCompany);
            if (nextSpawn.isCompany) {
                cc.log("nextSpawn.bossSpawnID: %s",nextSpawn.bossSpawnID);
                this.startBoss(nextSpawn.bossSpawnID);
            }
        }else{
            cc.log("spawnFoe, no next spawn~~~~");
        }
    },

    startWave () {
        this.currentWave.init();
        this.waveTotalFoes = this.currentWave.totalFoes;
        this.killedFoe = 0;
        this.currentSpawn = this.currentWave.spawns[this.currentWave.spawnIdx];
        this.startSpawn();
        this.game.inGameUI.showWave(this.waveIdx + 1);
        GameManager.instance.playSound(this.audioNewWave, false, 1);
        cc.log("wave killedFoe: %s", this.killedFoe);
    },

    startBoss (bossSpawnID) {
        this.game.bossMng.startBoss(bossSpawnID);
        this.bossProgress.show();

        if(this.bossAppearAni){
            this.bossAppearAni.node.active = true;
            this.bossAppearAni.play();
            cc.log("the boss appeared~~~~~~~~~");
        }else{
            cc.log("the boss animation not exist~~~~~~");
        }
    },

    endWave () {
        this.bossProgress.hide();
        this.game.bossMng.endBoss();
        // update wave index
        cc.log("waveIndex: %s, countWaves: %s", this.waveIdx, this.waves.length);
        if (this.waveIdx < this.waves.length - 1) {
            this.waveIdx++;
            this.currentWave = this.waves[this.waveIdx];
            cc.log("endWave wave index:%s: ", this.waveIdx);
            this.startWave();
        } else {
            this.unscheduleSpawn();

            let self = this;
            let hideCB = cc.callFunc(function() {
                self.game.gameOver(true);
            });
            let action = cc.sequence(cc.delayTime(1.0), hideCB);
            this.foeGroup.runAction(action);
        }
    },

    spawnFoe () {
        if(GameManager.instance.isPaused){
            return;
        }
        
        if(!this.currentSpawn){
            return;
        }

        // cc.log("this.currentSpawn.finished: %s", this.currentSpawn.finished);
        if (this.currentSpawn.finished === true) {
            cc.log("spawnFoe finished is calling~~~~~~~~~");
            this.endSpawn();
            return;
        }

        let newFoe = this.currentSpawn.spawn(this.game.poolMng);
        if (newFoe) {
            this.foeGroup.addChild(newFoe,0);
            newFoe.setPosition(this.getNewFoePosition(this.currentSpawn.range));
            newFoe.getComponent('Foe').init(this);
            // this.curFoeCount++;
        }
    },

    unscheduleSpawn(){
        cc.director.getScheduler().unscheduleAllForTarget(this);
    },

    spawnBossFoe () {
        if (!this.bossSpawn || this.bossSpawn.finished) {
            this.unschedule(this.spawnBossFoe);
            return;
        }
        let newFoe = this.bossSpawn.spawn(this.game.poolMng);
        if (newFoe) {
            this.foeGroup.addChild(newFoe,0);
            newFoe.setPosition(this.getNewFoePosition(this.bossSpawn.range));
            newFoe.getComponent('Foe').init(this);
            newFoe.getComponent('Foe').isBoss = true;
        }
    },

    spawnProjectile (projectileType, pos, dir, rot) {
        let newProjectile = this.game.poolMng.requestProjectile(projectileType);
        if (newProjectile) {
            this.foeGroup.addChild(newProjectile);
            newProjectile.setPosition(pos);
            newProjectile.getComponent('Projectile').init(this, dir);

            var audio = this.audioProjectiles[projectileType];
            GameManager.instance.playSound(this.audioProjectiles[projectileType], false, 1);
            cc.log("projectileType: %s, audio: %s", projectileType, audio);
        } else {
            cc.log('requesting too many projectiles! please increase size');
        }
    },

    spawnBuffItem (buffData) {
        let buffItem = this.game.poolMng.requestBuffItem(buffData.ItemType - 1);
        if(buffItem){
            let pos = this.getBuffItemPosition();
            buffItem.setPosition(pos);
            buffItem.getComponent('BuffItem').init(this.game, buffData);
            buffItem.getComponent('BuffItem').playShow();
            this.foeGroup.addChild(buffItem);
            cc.log("request a buff item~~~~~~, positionX: %s, positionY: %s", pos.x, pos.y);
        }else{
            cc.log("requesting too many buffitems! please increase size")
        }
    },

    killFoe () {
        this.killedFoe++;
        this.createBuffItem();
    },

    chargeEnergy: function(energy){
        var isFirstFull = UserDataManager.instance.getEnergyData().addEnergy(energy);
        cc.log("isfirst full: %s", isFirstFull);
        this.game.inGameUI.updateEnergy(isFirstFull);
    },
    
    hitFoe () {
        this.game.cameraShake();
    },

    hitBoss(){
        this.game.bossMng.hitBoss();
        this.bossProgress.updateProgress();
    },

    createBuffItem(){
        var curStageData = GameManager.instance.getCurStageData();

        if(Math.random() * 100 < curStageData.Probability && UserDataManager.instance.getGameData().isBuffTimeReached()){         
            var buffRawData = MetaDataManager.randomItemInSore(curStageData.ItemStore);
            var buffData = UserDataManager.instance.getGameData().addBuff(buffRawData);
            if(buffData){
                cc.log('buffType: %s, addvalue1: %s, addvalue2: %s', buffData.ItemType, buffRawData.AddValue, buffData.value);
                this.spawnBuffItem(buffData);
            }else{
                cc.log("the type of buff: %s reached the max count~~~~");
            }
        }
    },

    despawnFoe (foe) {
        let foeType = foe.foeType;
        // cc.log("to return foe: %s", foe.foeType);
        this.game.poolMng.returnFoe(foeType, foe.node);
    },

    despawnProjectile (projectile) {
        let type = projectile.projectileType;
        this.game.poolMng.returnProjectile(type, projectile.node);
    },

    getNewFoePosition (rangeID) {
        var range = MetaDataManager.getRangeDataByID(rangeID.toString());
        var randX = cc.random0To1() * range.Width + range.Xpoint  - this.spawnMargin;
        var randY = cc.random0To1() * range.Height + range.Ypoint  - this.spawnMargin;
        // var randX = cc.randomMinus1To1() * (this.foeGroup.width - this.spawnMargin)/2;
        // var randY = cc.randomMinus1To1() * (this.foeGroup.height - this.spawnMargin)/2;
        // cc.log("randx: %s, randy: %s", randX, randY);
        return cc.p(randX, randY);
    },

    getBuffItemPosition(){
        var randX = cc.randomMinus1To1() * (this.foeGroup.width - 200)/2;
        var randY = cc.randomMinus1To1() * (this.foeGroup.height - 200)/2;
        cc.log("randx: %s, randy: %s", randX, randY);
        return cc.p(randX, randY);
    }
});