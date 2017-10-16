
function PayOnWindows(jsonStr, callbacks){
    PaymentResponder.registerCallbacks(callbacks);

    PaymentCallback(0);
    cc.log("win32 payment success~~~~~");
}

module.exports = {
    doPayment : PayOnWindows
}

