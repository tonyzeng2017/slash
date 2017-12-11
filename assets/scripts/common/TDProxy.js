var Constant = require("Constant");

var TDAndroid = cc.Class({

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

        className: "com/ycy/games/slash/TDProxy"
    },

    setAccountLevel: function(level){
        var methodName = "setAccountLevel";
        var methodSig = "(I)V";
        jsb.reflection.callStaticMethod(this.className, methodName, methodSig ,  level);
        console.log("android setaccount level");
    },

    onEvent: function(eventName, eventData){
        var methodName = "onEvent";
        var methodSig = "(Ljava/lang/String;Ljava/lang/String;)V";
        jsb.reflection.callStaticMethod(this.className, methodName, methodSig , eventName, JSON.stringify(eventData));

        console.log("android setaccount level");
    },

    onItemPurchase: function(itemName, number, price){
        var methodName = "onItemPurchase";
        var methodSig = "(Ljava/lang/String;IF)V";
        jsb.reflection.callStaticMethod(this.className, methodName, methodSig, itemName, number, price);
        console.log("android: " +  methodName);
    },

    onItemUse: function(itemName, number){
        var methodName = "onItemUse";
        var methodSig = "(Ljava/lang/String;I)V";
        jsb.reflection.callStaticMethod(this.className, methodName, methodSig, itemName, number);
        console.log("android: " +  methodName);
    },

    onMissionBegin: function(missionID){
        var methodName = "onMissionBegin";
        var methodSig = "(Ljava/lang/String;)V";
        jsb.reflection.callStaticMethod(this.className, methodName, methodSig, missionID);
        console.log("android: " +  methodName);
    },

    onMissionCompleted: function(missionID){
        var methodName = "onMissionCompleted";
        var methodSig = "(Ljava/lang/String;)V";
        jsb.reflection.callStaticMethod(this.className, methodName, methodSig, missionID);
        console.log("android: " +  methodName);
    },

    onMissionFailed: function(missionID, cause){
        var methodName = "onMissionFailed";
        var methodSig = "(Ljava/lang/String;Ljava/lang/String;)V";
        jsb.reflection.callStaticMethod(this.className, methodName, methodSig, missionID, cause);
        console.log("android: " +  methodName);
    },

    onReward: function(virtualCurrencyAmount, reason){
        var methodName = "onReward";
        var methodSig = "(ILjava/lang/String;)V";
        jsb.reflection.callStaticMethod(this.className, methodName, methodSig, virtualCurrencyAmount, reason);
        console.log("android: " +  methodName);
    }

});


var TDIOS = cc.Class({

    properties: {
        className: "TDProxy",
    },

    setAccountLevel: function(level){
        var methodName = "setAccountLevel:";
    
        jsb.reflection.callStaticMethod(this.className, methodName, level);
        console.log("ios setaccount level");
    },

    onEvent: function(eventName, eventData){
        var methodName = "onEvent:withData:";
    
        //jsb.reflection.callStaticMethod(className, methodName, eventName, eventData);
        jsb.reflection.callStaticMethod(this.className, methodName, eventName, JSON.stringify(eventData));
        console.log("ios: " +  methodName);
    },

    onItemPurchase: function(itemName, number, price){
        var methodName = "onItemPurchase:itemNumber:priceInVirtualCurrency:";
        jsb.reflection.callStaticMethod(this.className, methodName, itemName, number, price);
        console.log("ios: " +  methodName);
    },

    onItemUse: function(itemName, number){
        var methodName = "onItemUse:itemNumber:";
        jsb.reflection.callStaticMethod(this.className, methodName, itemName, number);
        console.log("ios: " +  methodName);
    },

    onMissionBegin: function(missionID){
        var methodName = "onMissionBegin:";
        jsb.reflection.callStaticMethod(this.className, methodName, missionID);
        console.log("ios: " +  methodName);
    },

    onMissionCompleted: function(missionID){
        var methodName = "onMissionCompleted:";
        jsb.reflection.callStaticMethod(this.className, methodName, missionID);
        console.log("ios: " +  methodName);
    },

    onMissionFailed: function(missionID, cause){
        var methodName = "onMissionFailed:failedCause:";
        jsb.reflection.callStaticMethod(this.className, methodName, missionID, cause);
        console.log("ios: " +  methodName);
    },

    onReward: function(virtualCurrencyAmount, reason){
        var methodName = "onReward:reason:";
        jsb.reflection.callStaticMethod(this.className, methodName, virtualCurrencyAmount, reason);
        console.log("ios: " +  methodName);
    }

});

var TDWindows = cc.Class({

    setAccountLevel: function(level){
        console.log("windows setaccount level");
    },

    onEvent: function(eventName, eventData){
        console.log("windows onEvent");
    },

    onItemPurchase: function(itemName, number, price){
        
    },

    onItemUse: function(itemName, number){

    },

    onMissionBegin: function(missionID){

    },

    onMissionCompleted: function(missionID){

    },

    onMissionFailed: function(missionID, cause){

    },

    onReward: function(virtualCurrencyAmount, reason){

    }
});

var TD = cc.Class({
    properties: {
        proxy: null
    },

    getProxy: function(){
        if(!this.proxy){
            if(cc.sys.os == cc.sys.OS_ANDROID){
                this.proxy = new TDAndroid();
            }else if(cc.sys.os == cc.sys.OS_IOS){
                this.proxy = new TDIOS();
            }else{
                this.proxy = new TDWindows();
            }
        }

        return this.proxy;
    }
});

window.TD = new TD();


