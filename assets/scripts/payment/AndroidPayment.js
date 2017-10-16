

function PayOnAndroid(jsonStr, callbacks){
    PaymentResponder.registerCallbacks(callbacks);
    
    var className = "com/ycy/games/slash/PaymentProxy";
    var methodName = "buy";
    var methodSig = "(Ljava/lang/String;)V";
    
    jsb.reflection.callStaticMethod(className, methodName, methodSig, jsonStr);
}

module.exports = {
    doPayment : PayOnAndroid
}
