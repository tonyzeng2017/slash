var SDKManager = cc.Class({

    properties: {
        analytics_plugin: null
    },

    init: function(){
        if(cc.sys.isMobile){

            var agent = anysdk.agentManager;
            var plugin = agent.getAnalyticsPlugin();

            if(!plugin.startSession){
                plugin.startSession  = function () {
                    
                };
            }

            if(!plugin.stopSession){
                plugin.stopSession = function () {
                    
                };
            }

            if(!plugin.logEvent){
                plugin.logEvent = function () {
                    
                };
            }

            if(!plugin.setSessionContinueMillis){
                plugin.setSessionContinueMillis = function () {

                };
            }

            if(!plugin.setCaptureUncaughtException){
                plugin.setCaptureUncaughtException = function () {
                    
                };
            }

            if(!plugin.setAccount){
                plugin.setAccount = function () {

                };
            }

            if(!plugin.onChargeRequest){
                plugin.onChargeRequest = function () {
                    
                };
            }

            if(!plugin.onChargeSuccess){
                plugin.onChargeSuccess = function () {
                    
                };
            }

            if(!plugin.onChargeFail){
                plugin.onChargeFail = function () {
                    
                };
            }

            if(!plugin.onChargeOnlySuccess){
                plugin.onChargeOnlySuccess = function () {
                    
                };
            }

            if(!plugin.onPurchase){
                plugin.onPurchase = function () {
                    
                };
            }

            if(!plugin.onUse){
                plugin.onUse = function () {
                    
                };
            }

            if(!plugin.onReward){
                plugin.onReward = function () {

                };
            }

            if(!plugin.startLevel){
                plugin.startLevel = function () {
                    
                };
            }

            if(!plugin.finishLevel){
                plugin.finishLevel = function () {
                    
                };
            }

            if(!plugin.startTask){
                plugin.startTask = function () {

                };
            }

            if(!plugin.failTask){
                plugin.failTask = function () {
                    
                };
            }

            if(!plugin.finishTask){
                plugin.finishTask = function () {
                    
                };
            }

            this.analytics_plugin = plugin;
            console.log('analytics_plugin init success on modile~~~~~~~~~~');

        }else{
            var plugin = {};

            plugin.startSession = function () {
                cc.log("fake started session!");
            };

            plugin.stopSession = function () {
                cc.log("fake stopped session!");
            };

            plugin.logEvent = function () {
                
            };

            plugin.setSessionContinueMillis = function () {
                
            };

            plugin.setCaptureUncaughtException = function () {

            };

            plugin.setAccount = function () {
                
            };

            plugin.onChargeRequest = function () {
                
            };

            plugin.onChargeSuccess = function () {
                
            };


            plugin.onChargeFail = function () {
                
            };

            plugin.onChargeOnlySuccess = function () {
                
            };

            plugin.onPurchase = function () {
                
            };

            plugin.onUse = function () {
                
            };

            plugin.onReward = function () {
                
            };
            
            plugin.startLevel = function () {
                
            };

            plugin.finishLevel = function () {
                
            };

            plugin.startTask = function () {
                
            };

            plugin.failTask = function () {
                
            };

            plugin.finishTask = function () {
                
            };

            //todo: added the fake method in windows.
            this.analytics_plugin = plugin;
            console.log('analytics_plugin init success on desktop~~~~~~~~~~');
        }
    },


    addGameEvent: function () {
        var self = this;

        cc.game.on(cc.game.EVENT_HIDE, function () {
            self.analytics_plugin.startSession();
            console.log("event game hide~~~~~~~");
        });

        cc.game.on(cc.game.EVENT_SHOW , function () {
            self.analytics_plugin.stopSession();
            console.log("event game show~~~~~~~~~~");
        });
    },

});

window.SDKManager = new SDKManager();


