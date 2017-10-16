

function PayOnIOS(jsonStr, callbacks){
    var className = "PaymentHandler";
    var methodName = "requestPayment:";

    PaymentResponder.registerCallbacks(callbacks);
    jsb.reflection.callStaticMethod(className, methodName, jsonStr);
}

module.exports = {
    doPayment : PayOnIOS
}
