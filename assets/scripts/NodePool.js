var NodePool = cc.Class({
    name: 'NodePool',
    properties: {
        prefab: cc.Prefab,
        size: 0
    },
    ctor () {
        this.idx = 0;
        this.initList = [];
        this.list = [];
    },
    init () {
        for ( let i = 0; i < this.size; ++i ) {
            let obj = cc.instantiate(this.prefab);
            this.initList[i] = obj;
            this.list[i] = obj;
        }
        this.idx = this.size - 1;
        // cc.log("init node pool idx: %s: ", this.idx);
    },

    reset () {
        for ( let i = 0; i < this.size; ++i ) {
            let obj = this.initList[i];
            this.list[i] = obj;
            if (obj.active) {
                obj.active = false;
            }
            if (obj.parent) {
                obj.removeFromParent();
            }
        }
        this.idx = this.size - 1;
        // cc.log("reset node pool idx: %s: ", this.idx);
    },

    request ()  {
        if ( this.idx < 0 ) {
            cc.log ("Error: the pool do not have enough free item.");
            return null;
        }
        let obj = this.list[this.idx];
        if ( obj ) {
            obj.active = true;
        }
        --this.idx;
        // cc.log("request node pool idx: %s: , poolSize: %s", this.idx, this.size);
        return obj;
    },

    return ( obj ) {
        ++this.idx;
        obj.active = false;
        if (obj.parent) {
            obj.removeFromParent();
        }
        this.list[this.idx] = obj;
        // cc.log("return node pool idx: %s: poolSize: %s", this.idx, this.size);
    }
});

module.exports = NodePool;