var CryptoJS = require("crypto-js");

var encryptKey = "dark_slash";

var IOUtil = cc.Class({
    
    statics:{
        writeData: function(key, data){
            var content = JSON.stringify(data);
            // Encrypt
            // var ciphertext = CryptoJS.AES.encrypt(content, encryptKey);
            cc.sys.localStorage.setItem(key, content);
            cc.log("IOUtil data write~~~~~~~~~~: %s", content);
        },
        
        readData: function(key){
            var  content = cc.sys.localStorage.getItem(key);
            cc.log("IOUtil read data key: %s, content: %s", key, content);
            //Decrypt
            if(content){
                // var bytes  = CryptoJS.AES.decrypt(content, encryptKey);
                // var plaintext = bytes.toString(CryptoJS.enc.Utf8);
                // cc.log("IOUtil read data2222 key: %s, content: %s", key, plaintext);
                var userData = JSON.parse(content);
                return userData;
            }else{
                cc.log("data for key: %s, doesn't exist~~~~~~~~~~~~", key);
                return {};
            }
        }
    }
    
});

module.exports = IOUtil;
