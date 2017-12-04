var ShaderUtil = require("ShaderUtil");
var UserDataManager = require("UserDataManager");
var GameManager = require("GameManager");
var MetaDataManager = require("MetaDataManager");

cc.Class({
    extends: cc.Component,

    properties: {
        // foo: {
        //    default: null,      // The default value will be used only when the component attaching
        //                           to a node for the first time
        //    url: cc.Texture2D,  // optional, default is typeof default
        //    serializable: true, // optional, default is true
        //    visible: true,      // optional, default is true
        //    displayName: 'Foo', // optional
        //    readonly: false,    // optional, default is false
        // },
        // ...
        stageID: 1,
        isBoss: false,
        item_bg: cc.Sprite,
        icon_lock: cc.Node,
        icon_pass: cc.Node,
        text_name: cc.Label,
        spine_node: cc.Node,
        player: cc.Node,
        audio: cc.AudioClip,
        newbieEnterGame: cc.Node
    },

    showAnimation: function(){
        this.spine_node.active  = true;
    },

    // use this for initialization
    onLoad: function () {
        if(this.newbieEnterGame){
            this.newbieEnterGame.active = UserDataManager.instance.getNewbieData().isShowEnterGame();
            if(this.newbieEnterGame.active){
                TDProxy.onMissionBegin("step_enter_game2");
            }
        }

        var stageData = MetaDataManager.getStageDataByID(this.stageID);
        var stagePassed = UserDataManager.instance.getUserData().isStagePassed(this.stageID.toString());
        var stageEnabled = UserDataManager.instance.getUserData().isStageEnabled(this.stageID.toString());
        this.text_name.string =  stageData.StageName;
        this.icon_lock.active = false;// !stageEnabled;
        this.icon_pass.active = stagePassed;

        cc.log("stagePassed, %s, stageEnabled: %s", stagePassed, stageEnabled);
        if(!stageEnabled){
            ShaderUtil.setShader(this.item_bg, "gray");
        }
        var mobile = cc.sys.isMobile;
        cc.log("is mobile: %s", mobile);

        this.spine_node.active = false;
        var self = this;
        var touched = false;
        if(stagePassed || stageEnabled){

            if(cc.sys.isMobile){
                this.node.on(cc.Node.EventType.TOUCH_END, function (event) {
                    GameManager.instance.playSound(self.audio, false, 1);
                    if(touched){
                        return;
                    }

                    touched = true;
                    if(self.player){
                        self.player.active = true;
                        let flyAnim = self.player.getComponent(cc.Animation);
                        flyAnim.play();
                        flyAnim.on('finished',  function(){
                            self.enterGame();
                        }, self);

                        cc.log("played the animation~~~");
                    }else{
                        self.enterGame();
                    }
                }, this);
            }else{
                var moved = false;
                this.node.on(cc.Node.EventType.MOUSE_DOWN, function (event) {
                    moved = false;
                }, this);

                this.node.on(cc.Node.EventType.MOUSE_MOVE, function (event) {
                    moved = true;
                }, this);

                this.node.on(cc.Node.EventType.MOUSE_UP, function (event) {
                    if(!moved && !touched){
                        touched = true;
                        GameManager.instance.playSound(self.audio, false, 1);
                        if(!self.player){
                            console.log('Mouse down stage: %s', self.stageID);
                            self.enterGame();
                        }else{
                            self.player.active = true;
                            let flyAnim = self.player.getComponent(cc.Animation);
                            flyAnim.play();
                            flyAnim.on('finished',  function(){
                                self.enterGame();
                            }, self);
                        }
                    }
                }, this);
            }
        }
    },

    enterGame: function(){
        GameManager.instance.updateStage(this.stageID, this.isBoss);
        TDProxy.onEvent("enter_play", {max_stage: UserDataManager.instance.getUserData().getMaxOpenStage()});
        if(UserDataManager.instance.getNewbieData().isInGameFinished){
            cc.director.loadScene('PlayGame');
        }else{
            cc.director.loadScene('NewBieGame');
        }
    },

    onNewbieEnterGame: function () {
        UserDataManager.instance.getNewbieData().finishEnterGame();
        this.enterGame();
        TDProxy.onMissionCompleted("step_enter_game2");
    }
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
