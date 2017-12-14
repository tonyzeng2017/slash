// Learn cc.Class:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/class/index.html
// Learn Attribute:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/reference/attributes/index.html
// Learn life-cycle callbacks:
//  - [Chinese] http://www.cocos.com/docs/creator/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/editors_and_tools/creator-chapters/scripting/life-cycle-callbacks/index.html

var EncryptNumber = cc.Class({
    extends: cc.Component,

    properties: {
        value: {
            get () {
                return this._value ^ this._encryptor;
            },
            set (value) {
                this._value = value ^ this._encryptor;
            }
        },
    },

    __ctor__(number){
        this._encryptor = Math.ceil(cc.random0To1() * 1000);
        this.value = number;
    },

    add(number){
        if(typeof number === "number"){
            this.value += number;
        }else if(typeof number === "object"){
            this.value += number.value;
        }else{
            cc.log("Unsupported type~~~");
        }
    },

    sub(number){
        if(typeof number === "number"){
            this.value -= number;
        }else if(typeof number === "object"){
            this.value -= number.value;
        }else{
            cc.log("Unsupported type~~~");
        }
    }
});

window.EncryptNumber = EncryptNumber;
