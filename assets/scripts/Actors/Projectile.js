const GameManager = require("GameManager");
const ProjectileType = require('Types').ProjectileType;
const ProjectileBrokeAnimation = require("Types").ProjectileBrokeAnimation;

cc.Class({
    extends: cc.Component,

    properties: {
        projectileType: {
            default: ProjectileType.Arrow,
            type: ProjectileType
        },
        sprite: cc.Sprite,
        fxBroken: cc.Animation,
        moveSpeed: 0,
        canBreak: true
    },

    // use this for initialization
    init (waveMng, dir) {
        this.waveMng = waveMng;
        this.player = waveMng.player;
        let rad = cc.pToAngle(dir);
        let deg = cc.radiansToDegrees(rad);
        let rotation = 90-deg;
        this.sprite.node.rotation = rotation;
        this.sprite.enabled = true;
        this.direction = cc.pNormalize(dir);
        this.isMoving = true;

        if(this.projectileType == ProjectileType.Arrow){
            this.node.scale = 0.5;
        }
    },

    broke () {
        this.isMoving = false;
        this.sprite.enabled = false;
        this.fxBroken.node.active = true;

        this.fxBroken.play(ProjectileBrokeAnimation[this.projectileType]);
    },

    hit () {
        this.isMoving = false;
        if( this.canBreak ){
            this.onBrokenFXFinished();
        }else{
            this.sprite.enabled = false;
            this.fxBroken.node.active = true;
            this.fxBroken.play(ProjectileBrokeAnimation[this.projectileType]);
        }
    },

    onBrokenFXFinished () {
        this.fxBroken.node.active = false;
        this.waveMng.despawnProjectile(this);
    },

    update (dt) {
        if (this.isMoving === false) {
            return;
        }

        if(GameManager.instance.isPaused){
            return;
        }

        let dist = cc.pDistance(this.player.node.position, this.node.position);
        if (dist < 35 && this.player.isAlive) {
            if (this.canBreak && this.player.isAttacking) {
                this.broke();
                return;
            } else {
                this.player.dead();
                this.hit();
                return;
            }
        }

        if (this.isMoving) {
            this.node.x += this.moveSpeed * this.direction.x * dt;
            this.node.y += this.moveSpeed * this.direction.y * dt;
            if (Math.abs(this.node.x) > this.waveMng.foeGroup.width/2  ||
                Math.abs(this.node.y) > this.waveMng.foeGroup.height/2) {
                this.onBrokenFXFinished();
            }
        }
    }
});
