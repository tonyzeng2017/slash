const MetaDataManager = require("MetaDataManager");
const GameManager = require("GameManager");
var UserDataManager = require("UserDataManager");

const standAnimations = ["stand_up", "stand_right", "stand"];

const propertyMap = [
    "life",
    "hurtRadius",
    "atkDist",
    "atkDuration",
    "atkStun"
];

cc.Class({
    extends: cc.Component,

    properties: {
        fxTrail: cc.ParticleSystem,
        spArrow: cc.Node,
        sfAtkDirs: [cc.SpriteFrame],
        attachPoints: [cc.Vec2],
        sfPostAtks: [cc.SpriteFrame],

        postAtkIndex: {
            visible: false,
            default: 2
        },
        spPlayer: cc.Sprite,
        spSlash: cc.Sprite,
        hurtRadius: 0,
        touchThreshold: 0,
        touchMoveThreshold: 0,
        atkDist: 0,
        atkDuration: 0,
        atkStun: 0,
        life: 0,
        invincible: false,
        audioHit: cc.AudioClip,
        audioDead: cc.AudioClip,
        audioSlashLefts: [cc.AudioClip],
        audioSlashRights: [cc.AudioClip],

        audio_move_left: cc.AudioClip,
        audio_move_right: cc.AudioClip
    },

    onLoad(){
        this.initProperties();
        this.game.inGameUI.updateLife();
    },

    initProperties(){
        //let star = UserDataManager.instance.getUserData().star;
        for(let i = 1; i <= propertyMap.length; i++ ){
            // let level = UserDataManager.instance.getUserData().getAttrLevel(i);
            let propertyData =  UserDataManager.instance.getUserData().getCurrentPlayerAttr(i);
            if(propertyData){
                this[propertyMap[i-1]] = propertyData.PropertyValue;
                cc.log("player property, name: %s, value: %s", propertyMap[i-1], propertyData.PropertyValue);
            }else{
                // cc.log("property data not exist for level: %s, id: %s", level, i);
            }
        }

        let speed = UserDataManager.instance.getUserData().getCurrentPlayerAttr(6).PropertyValue;
        this.getComponent('Move').moveSpeed = speed;
        cc.log("onload player.atkDuration: %s, player.atkDist: %s, player life: %s, speed: %s" , this.atkDuration, this.atkDist, this.life, speed);
    },

    // use this for initialization
    init (game) {
        this.game = game;
        this.anim = this.getComponent('Move').anim;
        this.inputEnabled = false;
        this.isAttacking = false;
        this.isAlive = true;
        this.nextPoseSF = null;
        this.registerInput();
        this.spArrow.active = false;
        this.atkTargetPos = cc.p(0,0);
        this.isAtkGoingOut = false;
        this.validAtkRect = cc.rect(25, 25, (this.node.parent.width - 50), (this.node.parent.height - 50));
        cc.log("valid rect, width: %s, height: %s", this.node.parent.width, this.node.parent.height);
        this.oneSlashKills = 0;
        this.totalScore = 0;

        this.node.setScale(0.85);
        this.playStand();
    },

    playStand () {
        var index = this.sfPostAtks.indexOf(this.nextPoseSF);
        cc.log("index: %s", index);
        index = index < 0 || index == undefined ? 2 : index;
        // cc.log("play stand animation: %s", standAnimations[index]);
        this.anim.play(standAnimations[index]);
        // this.anim.play("stand_up");
    },

    registerInput () {
        var self = this;
        // touch input
        cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            onTouchBegan: function(touch, event) {
                if (self.inputEnabled === false) {
                    return true;
                }
                var touchLoc = touch.getLocation();
                self.touchBeganLoc = touchLoc;
                self.moveToPos = self.node.parent.convertToNodeSpaceAR(touchLoc);
                self.touchStartTime = Date.now();
                return true; // don't capture event
            },
            onTouchMoved: function(touch, event) {
                if (self.inputEnabled === false) {
                    return;
                }
                var touchLoc = touch.getLocation();
                self.spArrow.active = true;
                self.moveToPos = self.node.parent.convertToNodeSpaceAR(touchLoc);
                if (cc.pDistance(self.touchBeganLoc, touchLoc) > self.touchMoveThreshold) {
                    self.hasMoved = true;
                }
            },
            onTouchEnded: function(touch, event) {

                if (self.inputEnabled === false) {
                    return;
                }

                if(!self.isAlive){
                    cc.log(" player dead~~~~~~~");
                    return;
                }

                if (GameManager.instance.isPaused){
                    cc.log("game paused, player return~~~~~~~");
                    return;
                }
                self.spArrow.active = false;
                self.moveToPos = null;
                self.node.emit('update-dir', {
                    dir: null
                });
                let isHold = self.isTouchHold();
                if (!self.hasMoved && !isHold) {
                    var touchLoc = touch.getLocation();
                    let atkPos = self.node.parent.convertToNodeSpaceAR(touchLoc);
                    let atkDir = cc.pSub(atkPos, self.node.position);
                    self.atkTargetPos = cc.pAdd( self.node.position, cc.pMult(cc.pNormalize(atkDir), self.atkDist));
                    self.atkTargetPos.x  = Math.max(self.atkTargetPos.x, -self.node.parent.width/2 + 10);
                    self.atkTargetPos.y  = Math.max(self.atkTargetPos.y, -self.node.parent.height/2 + 15);
                    self.atkTargetPos.x  = Math.min(self.atkTargetPos.x, self.node.parent.width/2 - 10);
                    self.atkTargetPos.y  = Math.min(self.atkTargetPos.y, self.node.parent.height/2 - 15);

                    // cc.log("target position: %s, %s", self.atkTargetPos.x, self.atkTargetPos.y);
                    let atkPosWorld = self.node.parent.convertToWorldSpaceAR(self.atkTargetPos);
                    if (!cc.rectContainsPoint(self.validAtkRect, atkPosWorld)) {
                        self.isAtkGoingOut = true;
                    } else {
                        self.isAtkGoingOut = false;
                    }
                    self.node.emit('freeze');
                    self.oneSlashKills = 0;
                    self.attackOnTarget(atkDir, self.atkTargetPos);
                }
                self.hasMoved = false;
            }
        }, self.node);
    },

    ready (isRevive) {
        this.fxTrail.resetSystem();
        this.node.emit('stand');
        this.inputEnabled = true;
        this.isAlive = true;
    },

    isTouchHold () {
        let timeDiff = Date.now() - this.touchStartTime;
        return ( timeDiff >= this.touchThreshold);
    },

    attackOnTarget (atkDir, targetPos) {
        var self = this;
        let deg = cc.radiansToDegrees(cc.pAngleSigned(cc.p(0, 1), atkDir));
        let angleDivider = [0, 12, 35, 56, 79, 101, 124, 146, 168, 180];
        let slashPos = null;
        function getAtkSF(mag, sfAtkDirs) {
            let atkSF = null;
            for (let i = 1; i < angleDivider.length; ++i) {
                let min = angleDivider[i - 1];
                let max = angleDivider[i];
                if (mag <= max && mag > min) {
                    atkSF = sfAtkDirs[i - 1];
                    self.nextPoseSF = self.sfPostAtks[Math.floor(( i - 1 )/3)];
                    slashPos = self.attachPoints[i - 1];
                    return atkSF;
                }
            }
            if (atkSF === null) {
                console.error('cannot find correct attack pose sprite frame! mag: ' + mag);
                return null;
            }
        }

        let mag = Math.abs(deg);
        if (deg <= 0) {
            this.spPlayer.node.scaleX = 1;
            this.spPlayer.spriteFrame = getAtkSF(mag, this.sfAtkDirs);
            GameManager.instance.playSound(this.audio_move_left, false, 1);
        } else {
            this.spPlayer.node.scaleX = -1;
            this.spPlayer.spriteFrame = getAtkSF(mag, this.sfAtkDirs);
            GameManager.instance.playSound(this.audio_move_right, false, 1);
        }

        let moveAction = cc.moveTo(this.atkDuration/1000, targetPos).easing(cc.easeCubicActionOut());
        let delay = cc.delayTime(this.atkStun/1000);
        let callback = cc.callFunc(this.onAtkFinished, this);
        this.node.runAction(cc.sequence(moveAction, delay, callback));
        this.spSlash.node.position = slashPos;
        this.spSlash.node.rotation = mag;
        this.spSlash.enabled = true;
        this.spSlash.getComponent(cc.Animation).play('slash');
        this.inputEnabled = false;
        this.isAttacking = true;
    },

    onAtkFinished () {
        // cc.log("attack finished, position: %s, %s", this.node.position.x, this.node.position.y);
        if (this.nextPoseSF) {
            this.spPlayer.spriteFrame = this.nextPoseSF;
            if(this.isAlive){
                this.playStand();
            }
        }
        this.spSlash.enabled = false;
        this.inputEnabled = true;
        this.isAttacking = false;
        this.isAtkGoingOut = false;

        //this.playSlashSound();
        cc.log("oneSlashKills: %s", this.oneSlashKills);
        if (this.oneSlashKills >= 2) {
            cc.log(" this.oneSlashKills: " + this.oneSlashKills)
            this.game.inGameUI.showKills(this.oneSlashKills);
            UserDataManager.instance.getGameData().updateSlashCount(this.oneSlashKills);
            UserDataManager.instance.getGameData().addOneSlashScore(this.oneSlashKills);
            this.game.inGameUI.showScore();
        }
        UserDataManager.instance.getGameData().addSlash();
        this.game.checkGameOver();
    },

    playSlashSound() {
        var self = this;
        var getAudioByCount = function(audios){
            //to get the left audio according to the numbers
            if(self.oneSlashKills == 0){
                return null;
            }else if(self.oneSlashKills == 1){
                return  audios[0];
            }else if(self.oneSlashKills<5){
                return  audios[1];
            }else{
                return  audios[2];
            }
        }

        var audio = null;
        if(this.spPlayer.node.scaleX == 1){
            audio = getAudioByCount(this.audioSlashLefts);
        }else{
            audio = getAudioByCount(this.audioSlashRights);
        }

        GameManager.instance.playSound(audio);
    },
    
    addKills (score) {
        this.oneSlashKills++;
        this.game.inGameUI.addCombo();
        UserDataManager.instance.getGameData().addKillCount();

        let comboCount = this.game.inGameUI.getCombo();
        UserDataManager.instance.getGameData().updateCombo(comboCount);

        cc.log("to add score: %s", score);
        UserDataManager.instance.getGameData().addScore(score);
        // let comboCount = this.game.inGameUI.getCombo();
        UserDataManager.instance.getGameData().addComboScore(comboCount);
        this.game.inGameUI.showScore();
    },

    revive () {
        let hideCB = cc.callFunc(function() {
            this.node.active = false;
        }.bind(this));
        let action = cc.sequence(cc.delayTime(0.6), hideCB);

        this.initProperties();
        this.game.inGameUI.updateLife();
        this.game.inGameUI.hideWarning();
        cc.log("player revived, life: %s", this.life);
    },

    dead () {
        if (this.invincible) return;
        if (!this.isAlive) return;

        this.life--;
        this.game.inGameUI.updateLife(true);

        if(this.life <= 0){
            this.node.emit('freeze');
            this.isAlive = false;
            this.isAttacking = false;
            this.inputEnabled = false;
            this.anim.play('dead');
            GameManager.instance.playSound(this.audioDead, false, 1);
            // this.game.inGameUI.dead();
        }
        else{
            GameManager.instance.playSound(this.audioHit, false, 1);
        }
    },

    isDead(){
        return this.life<=0;
    },

    corpse () {
        cc.log("player corpse called~~~~~~~~~~~~")
        this.anim.play('corpse');
        this.scheduleOnce(this.death, 0.7);
    },

    death () {
        this.game.death();
    },
    
    shouldStopAttacking () {
        let curWorldPos = this.node.parent.convertToWorldSpaceAR(this.node.position);
        let targetWorldPos = this.node.parent.convertToWorldSpaceAR(this.atkTargetPos);
        if ( (curWorldPos.x < this.validAtkRect.xMin && targetWorldPos.x < this.validAtkRect.xMin) ||
            (curWorldPos.x > this.validAtkRect.xMax && targetWorldPos.x > this.validAtkRect.xMax) ||
            (curWorldPos.y < this.validAtkRect.yMin && targetWorldPos.y < this.validAtkRect.yMin) ||
            (curWorldPos.y > this.validAtkRect.yMax && targetWorldPos.y > this.validAtkRect.yMax)  ) {
            return true;        
        } else {
            return false;
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

        if (this.isAttacking) {
            if (this.isAtkGoingOut && this.shouldStopAttacking() ) {
                cc.log("attack is gone out~~~~~~~~~~");
                this.node.stopAllActions();
                this.onAtkFinished();
            }
        }

        if (this.inputEnabled && this.moveToPos && this.isTouchHold()) {
            let dir = cc.pSub(this.moveToPos, this.node.position);
            let rad = cc.pToAngle(dir);
            let deg = cc.radiansToDegrees(rad);
            this.spArrow.rotation = 90-deg;
            this.node.emit('update-dir', {
                dir: cc.pNormalize(dir)
            });
        }
    },
});
