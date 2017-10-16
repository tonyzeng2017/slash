
var paymentHandler = null;

if(cc.sys.os == cc.sys.OS_ANDROID){

    paymentHandler = require("AndroidPayment");

}else if(cc.sys.os == cc.sys.OS_IOS){

    paymentHandler = require("IOSPayment");

}else{

    paymentHandler = require("Win32Payment");

}

function doPayment(prodID, prodName, amount, price, callbacks){

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










