const MoveState = require('Move').MoveState;
const FoeType = require('Types').FoeType;
const FoeTypeMap = require('Types').FoeTypeMap;
const ProjectileType = require('Types').ProjectileType;
const MetaDataManager = require("MetaDataManager");
var GameManager = require("GameManager");

const AttackType = cc.Enum({
    Melee: -1,
    Range: -1
});

cc.Class({
    extends: cc.Component,

    properties: {
        foeType: {
            default: FoeType.Foe0,
            type: FoeType
        },
        atkType: {
            default: AttackType.Melee,
            type: AttackType
        },
        projectileType: {
            default: ProjectileType.Arrow,
            type: ProjectileType
        },
        hitPoint: 0,
        hurtRadius: 0,
        atkRange: 0,
        atkDist: 0,
        atkDuration: 0,
        atkStun: 0,
        atkPrepTime: 0,
        corpseDuration: 0,
        killScore: 0,
        sfAtkDirs: [cc.SpriteFrame],
        fxSmoke: cc.ParticleSystem,
        fxBlood: cc.Animation,
        fxBlade: cc.Animation,
        audioDead: cc.AudioClip,
        audioSlashLeft: cc.AudioClip,
        audioSlashRight: cc.AudioClip,

        isBoss: {
            visible: false,
            default: false
        }
    },

    onLoad(){
        var foeID = FoeTypeMap.indexOf(this.foeType);

        var monsterData = MetaDataManager.getMonsterDataByFoeType(foeID)
        if(monsterData){
            this.hitPoint = monsterData.HitPoint;
            this.hurtRadius = monsterData.HurtRadius;
            this.atkRange = monsterData.AtkRange;
            this.atkDist = monsterData.AtkDist;
            this.atkDuration = monsterData.AtkDuration/1000;
            this.atkStun = monsterData.AtkStun/1000;
            this.atkPrepTime = monsterData.AtkPrepTime/1000;
            this.killScore = monsterData.KillScore;
            // if(monsterData.CorpseDuration){
                this.corpseDuration = monsterData.CorpseDuration/1000;
            // }
            // cc.log("this.hitPoint:  " + this.hitPoint + ", this.hurtRadius: " + this.hurtRadius + " ,this.atkRange: "+ this.atkRange+", this.atkDist: "+this.atkDist+" ,this.atkDuration: " + this.atkDuration)
            // cc.log("this.atkStun:  " + this.atkStun +" ,this.atkPrepTime: " + this.atkPrepTime +" ,CorpseDuration: " + this.corpseDuration)
            var move = this.getComponent('Move');
            move.moveSpeed = monsterData.MoveSpeed;
        }else{
            cc.log("there are no data for the foeType: " + this.foeType)
        }
        // this.node.setScale(1.5);
    },

    // use this for initialization
    init (waveMng) {
        this.waveMng = waveMng;
        this.player = waveMng.player;
        this.isAttacking = false;
        this.isAlive = false;
        this.isInvincible = false;
        this.isMoving = false;
        this.hp = this.hitPoint;
        this.move = this.getComponent('Move');
        this.anim = this.move.anim;
        this.spFoe = this.anim.getComponent(cc.Sprite);
        this.bloodDuration = this.fxBlood.getAnimationState('blood').clip.duration;
        this.deadDuation = this.anim.getAnimationState('dead').clip.duration;
        this.fxBlood.node.active = false;
        this.fxBlade.node.active = false;

        // cc.log("the hp of the foe: " + this.hp)
        if (this.anim.getAnimationState('born')) {
            this.anim.play('born');
        } else {
            this.readyToMove();
        }
    },


    // called every frame, uncomment this function to activate update callback
    update (dt) {
        if (this.isAlive === false) {
            return;
        }

        if (GameManager.instance.isPaused === true){
            return;
        }

        let dist = cc.pDistance(this.player.node.position, this.node.position);

        if (this.player.isAttacking && this.isInvincible === false) {
            if (dist < this.player.hurtRadius ) {
                this.dead();
                return;
            }
        }

        if (this.isAttacking && this.player.isAlive) {
            if (dist < this.hurtRadius) {
                this.player.dead();
                this.onAtkFinished();
                return;
            }
        }

        if (this.player && this.isMoving) {
            let dir = cc.pSub(this.player.node.position, this.node.position);
            let rad = cc.pToAngle(dir);
            let deg = cc.radiansToDegrees(rad);
            if (dist < this.atkRange) {
                this.prepAttack(dir);
                return;
            }
            this.node.emit('update-dir', {
                dir: cc.pNormalize(dir)
            });
        }
    },

    readyToMove () {
        this.isAlive = true;
        this.isMoving = true;
        this.fxSmoke.resetSystem();
    },

    prepAttack (dir) {
        let animName = '';
        if (Math.abs(dir.x) >= Math.abs(dir.y)) {
            animName = 'pre_atk_right';
        } else {
            if (dir.y > 0) {
                animName = 'pre_atk_up';
            } else {
                animName = 'pre_atk_down';
            }
        }
        this.node.emit('freeze');
        this.anim.play(animName);
        this.isMoving = false;
        this.scheduleOnce(this.attack, this.atkPrepTime);
    },

    attack () {
        if (this.isAlive === false) {
            return;
        }
        this.anim.stop();
        let atkDir = cc.pSub(this.player.node.position, this.node.position);
        let targetPos = null;
        if (this.atkType === AttackType.Melee) {
            targetPos = cc.pAdd( this.node.position, cc.pMult(cc.pNormalize(atkDir), this.atkDist) );
            targetPos.x  = Math.max(targetPos.x, -this.node.parent.width/2 + 10);
            targetPos.y  = Math.max(targetPos.y, -this.node.parent.height/2 + 15);
            targetPos.x  = Math.min(targetPos.x, this.node.parent.width/2 - 10);
            targetPos.y  = Math.min(targetPos.y, this.node.parent.height/2 - 15);
        }
        this.attackOnTarget(atkDir, targetPos);
    },

    attackOnTarget: function (atkDir, targetPos) {
        let deg = cc.radiansToDegrees(cc.pAngleSigned(cc.p(0, 1), atkDir));
        let angleDivider = [0, 45, 135, 180];
        let slashPos = null;
        function getAtkSF(mag, sfAtkDirs) {
            let atkSF = null;
            for (let i = 1; i < angleDivider.length; ++i) {
                let min = angleDivider[i - 1];
                let max = angleDivider[i];
                if (mag <= max && mag > min) {
                    atkSF = sfAtkDirs[i - 1];
                    return atkSF;
                }
            }
            if (atkSF === null) {
                cc.error('cannot find correct attack pose sprite frame! mag: ' + mag);
                return null;
            }
        }

        let mag = Math.abs(deg);
        if (deg <= 0) {
            this.anim.node.scaleX = 1;
            this.spFoe.spriteFrame = getAtkSF(mag, this.sfAtkDirs);
            GameManager.instance.playSound(this.audioSlashLeft, false, 1);
        } else {
            this.anim.node.scaleX = -1;
            this.spFoe.spriteFrame = getAtkSF(mag, this.sfAtkDirs);
            GameManager.instance.playSound(this.audioSlashRight, false, 1);
        }
        let delay = cc.delayTime(this.atkStun);
        let callback = cc.callFunc(this.onAtkFinished, this);

        if (this.atkType === AttackType.Melee) {
            let moveAction = cc.moveTo(this.atkDuration, targetPos).easing(cc.easeQuinticActionOut());
            this.node.runAction(cc.sequence(moveAction, delay, callback));
            this.isAttacking = true;
        } else {
            if (this.projectileType === ProjectileType.None) {
                return;
            }
            this.waveMng.spawnProjectile(this.projectileType, this.node.position, atkDir);
            this.node.runAction(cc.sequence(delay, callback));
        }
    },

    onAtkFinished () {
        this.isAttacking = false;
        if (this.isAlive) {
            this.isMoving = true;
        }
    },

    dead () {
        this.move.stop();
        this.isMoving = false;
        this.isAttacking = false;
        this.anim.play('dead');
        this.fxBlood.node.active = true;
        this.fxBlood.node.scaleX = this.anim.node.scaleX;
        this.fxBlood.play('blood');
        this.fxBlade.node.active = true;
        this.fxBlade.node.rotation = cc.randomMinus1To1() * 40; 
        this.fxBlade.play('blade');
        this.unscheduleAllCallbacks();
        this.node.stopAllActions();
        this.waveMng.hitFoe();
        this.player.addKills();
        this.player.addScore(this.killScore);

        if (--this.hp > 0) {
            this.isInvincible = true;
            this.scheduleOnce(this.invincible, this.bloodDuration);
        } else {
            this.isAlive = false;
            this.scheduleOnce(this.corpse, this.deadDuation);
            this.waveMng.killFoe();
            GameManager.instance.playSound(this.audioDead, false, 1);
            cc.log("dead duration: %s~~~~~~~~~~~~", this.deadDuation);
        }

        if(this.isBoss){
            this.waveMng.hitBoss();
        }
    },

    invincible () {
        this.fxBlood.node.active = false;
        this.isMoving = true;
        let blink = cc.blink(0.75, 6);
        let callback = cc.callFunc(this.onInvincibleEnd, this);
        this.anim.node.runAction(cc.sequence(blink, callback));
    },

    onInvincibleEnd () {
        this.isInvincible = false;
    },

    corpse () {
        this.anim.play('corpse');
        this.fxBlood.node.active = false;
        this.scheduleOnce(this.recycle, this.corpseDuration);
        cc.log("foe corpse called~~~~~~~~~~~~~~~duration: %s", this.corpseDuration);
    },

    recycle () {
        this.waveMng.despawnFoe(this);
        // cc.log("foe recycled~~~~~~~~~");
    }
});
