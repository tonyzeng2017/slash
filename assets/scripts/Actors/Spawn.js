const FoeType = require('Types').FoeType;
// const FoeTypeMap = require('Types').FoeTypeMap;
const MetaDataManager = require('MetaDataManager')

const Spawn = cc.Class({
    name: 'Spawn',
    properties: {
        foeType: {
            default: FoeType.Foe0,
            type: FoeType
        },
        total: 0,
        spawnInterval: 0,
        isCompany: false
    },

    statics: {
        create: function(json){
            var spawn = new Spawn();
            var monsterData = MetaDataManager.getMonsterDataByID(json.MonsterID);
            spawn.foeType = monsterData.FoeType; //FoeType.Foe3;
            cc.log("foeType: %s",spawn.foeType);
            spawn.total = json.MonsterNum;
            spawn.spawnInterval = json.TimeInterval/1000;
            spawn.isCompany = false;
            spawn.range = json.Range;
            spawn.monsterData = monsterData;
            //cc.log("created a spawn item~~~~~~~~~");
            return spawn;
        }
    },

    getTotalHP: function(){
        return this.monsterData.HitPoint * this.total;
    },

    ctor () {
        this.spawned = 0;
        this.finished = false;
    },

    spawn (poolMng) {
        if (this.spawned >= this.total) {
            return;
        }
        let newFoe = poolMng.requestFoe(this.foeType);
        // cc.log("to spawn the foe: %s", this.foeType);
        if (newFoe) {
            this.spawned++;
            if (this.spawned === this.total) {
                this.finished = true;
            }
            return newFoe;
        } else {
            cc.log('max foe count reached, will delay spawn');
            return null;
        }
    }
});

module.exports = Spawn;