const BossType = require('Types').BossType;
const Spawn = require('Spawn');
const MetaDataManager = require("MetaDataManager");

cc.Class({
    extends: cc.Component,

    properties: {
        currentBossSpawn: {
            visible: false,
            type: Spawn,
            default: null,
        },

        bossLostHP: 0
    },

    init (game) {
        this.game = game;
        this.bossSpawnData = MetaDataManager.getBossSpawnData();
    },

    hitBoss(){
        this.bossLostHP += 1;
    },

    getTotalBossHP(){
        if(this.currentBossSpawn){
            return this.currentBossSpawn.getTotalHP();
        }else{
            return 0;
        }
    },

    getHPPercent(){
        var totalHP = this.getTotalBossHP();
        if(totalHP == 0){
            return 1;
        }else{
            return this.bossLostHP/totalHP;
        }
    },

    startBoss (bossSpawnID) {
        var bossData = this.bossSpawnData[bossSpawnID];
        if(bossData){
            this.currentBossSpawn = Spawn.create(bossData);
            this.game.waveMng.startBossSpawn(this.currentBossSpawn);
        } else {
            cc.error("boss data for spawn: %s doesn't exist~~~~", bossSpawnID);
        }
    },

    endBoss () {
        this.currentBossSpawn = null;
        this.bossLostHP = 0;
    }
});