
// window.G = {
//     analytics_plugin: null,
// };

window.PaymentResponder = {
    onSuccess: null,
    onFailed: null,
    onCanceled: null,

    registerCallbacks: function(callbacks){
          this.onSuccess = callbacks.successCallback;
          this.onFailed = callbacks.failedCallback;
          this.onCanceled = callbacks.cancelCallback;
    },

    onResponse: function(result){
        if(result == 0){

            this.onSuccess(result);

        }else if(result == 1){

            if(this.onFailed){
                this.onFailed(result);
            }

        }else{
            if(this.onCanceled){
                this.onCanceled(result);
            }
        }
    },

    clear: function () {
        this.onSuccess = null;
        this.onFailed = null;
        this.onCanceled = null;
    }
};

window.PaymentCallback = function(result){
    PaymentResponder.onResponse(Number(result));
    PaymentResponder.clear();
    cc.log("pay result from ios: %s", result);
};

