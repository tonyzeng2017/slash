
var Constant = require("Constant");

function getPayment(){
    var paymentHandler = null;
    
    if(cc.sys.os == cc.sys.OS_ANDROID){
    
        paymentHandler = require("AndroidPayment");
    
    }else if(cc.sys.os == cc.sys.OS_IOS){
    
        paymentHandler = require("IOSPayment");
    
    }else{
        paymentHandler = require("Win32Payment");
    }
    
    if(!Constant.instance.PAYMENT_ENABLE){
        paymentHandler = require("Win32Payment");
    }

    return paymentHandler;
}


function doPayment(prodID, prodName, amount, price, callbacks){
    var paymentHandler = getPayment();

    var jsonObj = {
        prodID: prodID,
        prodName: prodName,
        amount: amount,
        price : price
    };

    var jsonStr = JSON.stringify(jsonObj);
    paymentHandler.doPayment(jsonStr, callbacks);
}

module.exports = {
    buyItem : doPayment
}










