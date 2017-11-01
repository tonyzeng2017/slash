const NodePool = require('NodePool');
const FoeType = require('Types').FoeType;
const ProjectileType = require('Types').ProjectileType;

cc.Class({
    extends: cc.Component,

    properties: {
        foePools: {
            default: [],
            type: NodePool
        },
        projectilePools: {
            default: [],
            type: NodePool
        },

        buffItemPools: {
            default: [],
            type: NodePool
        }
    },

    // use this for initialization
    init () {
        for (let i = 0; i < this.foePools.length; ++i) {
            this.foePools[i].init();
        }

        for (let i = 0; i < this.projectilePools.length; ++i) {
            this.projectilePools[i].init();
        }
    },

    requestFoe (foeType) {
        let thePool = this.foePools[foeType];
        // cc.log("foeType: %s, thePool size: %s", foeType, thePool.size);
        if (thePool.idx >= 0) {
            var foe = thePool.request();
            // cc.log("requestedFoe from foe pool: %s", foe.foeType);
            return foe;
        } else {
            return null;
        }
    },

    returnFoe (foeType, obj) {
        let thePool = this.foePools[foeType];
        if (thePool.idx < thePool.size) {
            thePool.return(obj);
        } else {
            cc.log('Return obj to a full pool, something has gone wrong, foeType: %s ,idx: %s, size: %s', foeType, thePool.idx, thePool.size);
            return;
        }
    },

    requestProjectile (type) {
        let thePool = this.projectilePools[type];
        if (thePool.idx >= 0) {
            return thePool.request();
        } else {
            return null;
        }
    },

    returnProjectile (type, obj) {
        let thePool = this.projectilePools[type];
        if (thePool.idx < thePool.size) {
            thePool.return(obj);
        } else {
            cc.log('Return obj to a full pool, something has gone wrong');
            return;
        }
    },

    requestBuffItem(type){
        let thePool = this.buffItemPools[type];
        if (thePool.idx >= 0) {
            return thePool.request();
        } else {
            return null;
        }
    },

    returnBuffItem(type, obj){
        let thePool = this.buffItemPools[type];
        if (thePool.idx < thePool.size) {
            thePool.return(obj);
        } else {
            cc.log('Return obj to a full pool, something has gone wrong');
            return;
        }
    }

});
