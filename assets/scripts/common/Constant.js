/**
 * Created by Administrator on 2017/7/6 0006.
 */
var MetaDataManager = require("MetaDataManager");

var Constant = cc.Class({
    statics: {
        instance: null
    },

    init:function(){
        cc.log("constant init called~~~~~~~~~~");
        // var data = MetaDataManager.getStageDataByID("1");
        this.comboDuration =  Number(MetaDataManager.getValueDataByID("1").Num);
        this.comboRewardRatio = Number(MetaDataManager.getRewardDataByID("9").Num);
        this.slashRewardRatio = Number(MetaDataManager.getRewardDataByID("10").Num);
        this.killsRewardRatio = Number(MetaDataManager.getRewardDataByID("8").Num);

        this.marks = [];
        for(let i = 1; i <= 7; i++){
            this.marks.push(Number(MetaDataManager.getRewardDataByID(i.toString()).Num));
        }

        this.costMaxAttr =  Number(MetaDataManager.getValueDataByID("16").Num);
        console.log("costMaxAttr: %s", this.costMaxAttr);
        this.MAX_FREE_REVIVE = Number(MetaDataManager.getValueDataByID("18").Num);

        this.SHOPID_REVIVE = "6";
        this.SHOPID_ALL_UPGRADE = "7";
        this.PAYMENT_ENABLE = Number(MetaDataManager.getValueDataByID("17").Num) == 1;
        this.CD_DURATION = 72 * 3600;
        this.FAILED_SCORE_RATIO = Number(MetaDataManager.getValueDataByID("19").Num)/100;
        this.REWARD_RATIO = Number(MetaDataManager.getValueDataByID("20").Num)/100;
        this.WARNING_LIFE = 5;
    }
});

Constant.instance = new Constant();
module.exports = Constant;