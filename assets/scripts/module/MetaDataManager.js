
var isMobile = function () {
    return cc.sys.isMobile;
};

var loadMetaData = function(name, callback){
    var url = cc.url.raw( 'resources/' + name + '.json' )
    cc.loader.load( url, function( err, res)
    {
            // 如果有異常會在 err 變數顯示, 否則在res就會是讀進來的json object
            if(err){
                cc.log( 'load['+ url +'], err['+err+']');
            }
            else{
                cc.log( 'load['+ url +'], result: ' + JSON.stringify(res));
                callback(res)
            }
    });
}

var _stageOpenData;

function getStageOpenData(){
    return _stageOpenData;  
}

function getStageOpenDataByID(id){
    return _stageOpenData[id.toString()];
}

var _monsterData;

function getMonsterData(){
    return _monsterData;
}

var _spawnsData;
function getSpawnsData(){
    return _spawnsData;
}

var _wavesData;
function getWavesData(){
    return _wavesData;
}

function getWaveDataByID(waveID){
    return _wavesData[waveID.toString()];
}

var _stageData;
function getStageDataByID(stageID){
    return _stageData[stageID.toString()];
}

var _playerData;
/*function getPlayerPropertyByStarAndLevelAndID(star, level, ID){
    for(var key in _playerData){
        let propertyData = _playerData[key];
        // cc.log("player data not exist for star: %s, level: %s, ID: %s", propertyData.PlayerStar, propertyData.Level , propertyData.PropertyID);
        // cc.log("player data not exist for star: %s, level: %s, ID: %s", propertyData.PlayerStar == star, propertyData.Level == level , propertyData.PropertyID == ID);
        if(propertyData.PlayerStar  == star && propertyData.Level == level && propertyData.PropertyID == ID){
            return propertyData;
        }
    }
    cc.log("player data not exist for star: %s, level: %s, ID: %s", star, level , ID);
    return null;
}*/

function getMaxLevelByStarAndID(star, ID){
    let maxLevel = 0;
    for(var key in _playerData){
        let propertyData = _playerData[key];
        if(propertyData.PlayerStar  == star && propertyData.PropertyID == ID){
            if(propertyData.Level > maxLevel ){
                maxLevel = propertyData.Level;
            }
        }
    }

    return maxLevel;
}

function getMinLevelByStarAndID(star, ID) {
    let minLevel = 1000;
    for(var key in _playerData){
        let propertyData = _playerData[key];
        if(propertyData.PlayerStar  == star && propertyData.PropertyID == ID){
            if(propertyData.Level < minLevel ){
                minLevel = propertyData.Level;
            }
        }
    }

    return minLevel;
}

function getPlayerPropertyByStarAndID(star, ID){
    for(var key in _playerData){
        let propertyData = _playerData[key];
        if(propertyData.PlayerStar == star && propertyData.PropertyID == ID){
            return propertyData;
        }
    }

    return null;
}

function getPlayerPropertyByLevelAndID(level, ID){
    for(var key in _playerData){
        let propertyData = _playerData[key];
        if(propertyData.Level == level && propertyData.PropertyID == ID){
            return propertyData;
        }
    }

    return null;
}

var _propertyData;
function getAttributeDataByID(ID){
    return _propertyData[ID.toString()];
}

var _valueConstantData;
function getValueDataByID(ID){
    return _valueConstantData[ID];
}

var _comboData;
function getComboScore(count) {
    let comboItem = _comboData[count.toString()];
    return comboItem && comboItem.ComboScore ? comboItem.ComboScore : 0;
}

function getComboColor(count){
    let comboItem = _comboData[count.toString()];
    return comboItem && comboItem.Color ? comboItem.Color : 0;
}

function getSpawnDataByID(spawnID){
    return _spawnsData[spawnID];
}

var _bossSpawnData;
function getBossSpawnDataByID(bossSpawnID){
    return _bossSpawnData[bossSpawnID];
}

function getBossSpawnData(){
    return _bossSpawnData;
}

function getMonsterDataByID(monsterID){
    return _monsterData[monsterID];
}

function getMonsterDataByFoeType(foeType){
    for (var id in _monsterData) {
        if(_monsterData[id].FoeType == foeType){
            return _monsterData[id];
        }
    }

    return null
}

var _shopData;
function getShopData(){
    return _shopData;
}

var _entranceData;

var _rewardData;
function getRewardDataByID(ID){
    return _rewardData[ID];
}

function geEntranceDataByID(ID){
    return _entranceData[ID.toString()];
}

function getAllEntrances(){
    return _entranceData;
}

var _rangeData;
function getRangeDataByID(ID){
    return _rangeData[ID.toString()];
}

var _ratingData;
function getRatingData(ID){
    var data = _ratingData[ID.toString()];

    return data && data.Value ? Number(data.Value)/100 : 0;
}

var _cutData;
function getOneSlashDataByCount(count) {
    _cutData.sort(function(a, b){
        return a.CutNum < b.CutNum;
    })
    for(var i = 0; i < _cutData.length; i ++){
        if(_cutData[i].CutNum <= count){
            return _cutData[i];
        }
    }

    return _cutData[_cutData.length - 1];
}

var _battleFieldStoreData;

function randomItemInSore(storeID){
    var storeItems = [];
    var totalWeight = 0;
    for(var id in _battleFieldStoreData){
        var storeItem = _battleFieldStoreData[id];
        if(storeItem.StoreID == storeID){
            storeItems.push(storeItem);
            totalWeight += storeItem.Weight;
        }
    }
    cc.log("storeItems: %s", storeItems.length);

    var randomNumber = Math.random() * totalWeight;
    var curWeight = 0;
    var resultIndex = storeItems.length-1;
    for(var i = 0; i < storeItems.length; i ++){
        curWeight += storeItems[i].Weight;
        if(randomNumber< curWeight){
            resultIndex = i;
            break;
        }
    }

    var itemID = storeItems[i].FightingItem
    cc.log("store item key: %s", itemID);
    return getBuffItemByID(itemID);
}

var _battleFieldItemData;
function getBuffItemByID(itemID){
    return _battleFieldItemData[itemID];
}

function getBuffItemByType(type){
    for(var key  in _battleFieldItemData){
        if(_battleFieldItemData[key].ItemType == type){
            return _battleFieldItemData[key];
        }
    }

    return null;
}

var _storyData;
function getStoryDataByID(ID){
    return _storyData[ID.toString()];
}

var _buffDisplayData;
function getBuffDisplayData(itemType, count){
    for(var key in _buffDisplayData){
        var data = _buffDisplayData[key];
        if(data.PropertyID == itemType.toString() && data.Layer == count){
            return data;
        }
    }

    return null;
}

var preLoadScenes = ["EntranceGame","MapGame1", "PlayGame"];
function getPreLoadScenes(){
    return preLoadScenes;
}

var  metaNames   = ["ValueData", "StageOpenData", "StageData", "MonsterData",
                    "SpawnsData", "WavesData", "ComboData", "PlayerData","PropertyData",
                    "ShopData", "RewardData", "EntranceData", "RangeData",
                    "BossSpawnsData", "CutData", "RatingValueData", "BattlefieldItemData",
                    "BattlefieldStoreData", "StoryData", "BuffDisplayData"];

function loadData(completeCallback, progressCallback, target) {

    //var scheduler = cc.director.getScheduler();
    let count = 0;
    let completed = 0;

    var updateProgress = function(){
        if(progressCallback){
            progressCallback(completed / (metaNames.length + preLoadScenes.length) );
        }
    };

    var callbackMap = {"StageOpenData" : function(data){_stageOpenData = data; updateProgress();},
                       "MonsterData" : function(data)  {_monsterData = data; updateProgress();},
                       "SpawnsData" : function(data)   {_spawnsData = data; updateProgress();},
                       "WavesData" : function(data)    {_wavesData = data; updateProgress();},
                        "ComboData": function(data)    {_comboData = data; updateProgress();},
                        "StageData": function(data)    {_stageData = data; updateProgress();},
                        "PlayerData": function(data)    {_playerData = data; updateProgress();},
                        "PropertyData": function(data)  {_propertyData = data; updateProgress();},
                        "ValueData": function(data)  {_valueConstantData = data; updateProgress();},
                        "ShopData": function(data)  {_shopData = data; updateProgress();},
                        "RewardData": function(data)  {_rewardData = data; updateProgress();},
                        "EntranceData": function(data)  {_entranceData = data; updateProgress();},
                        "RangeData": function(data) {_rangeData = data; updateProgress();},
                        "BossSpawnsData": function(data) {_bossSpawnData = data; updateProgress();},
                        "CutData": function(data) {
                                        _cutData = [];
                                        for(var key in data){
                                            _cutData.push(data[key]);
                                        }
                                        updateProgress();
                                    },
                        "RatingValueData": function(data){
                                        _ratingData = data;
                                        updateProgress();
                                    },
                        "BattlefieldItemData": function(data){
                                        _battleFieldItemData = data;
                                        updateProgress();
                                    },
                        "BattlefieldStoreData": function(data){
                                        _battleFieldStoreData = data;
                                        updateProgress();
                                    },
                        "StoryData": function(data){
                                _storyData = data;
                                updateProgress();
                        },

                        "BuffDisplayData": function(data){
                                _buffDisplayData = data;
                                updateProgress();
                        },
                    };

    var loadFunc = function() {
        var metaName = metaNames[count];
        // cc.log("metaName: " + metaName);
        if (metaName) {
            loadMetaData(metaName, function (data) {
                cc.log(metaName + " data loaded~~~~~~~~~~~~~~~~~");
                completed++;
                callbackMap[metaName](data);
                if (completed >= metaNames.length) {
                    cc.log("data load completed~~~~~~");
                    if(completeCallback){
                        completeCallback()
                    }
                }
            });
        } else {
            // Constant.instance.init();
            cc.director.getScheduler().unscheduleAllForTarget(target);
        }
        count++;
    }

    cc.director.getScheduler().schedule(loadFunc, target, 0.1, metaNames.length, 0, false);
}

module.exports = {
    getEntranceData: geEntranceDataByID,
    getAllEntrances: getAllEntrances,
    loadData: loadData,
    getStageOpenData: getStageOpenData,
    getMonsterData: getMonsterData,
    getStageOpenDataByID: getStageOpenDataByID,
    getWavesData: getWavesData,
    getWaveDataByID: getWaveDataByID,
    getSpawnDataByID:getSpawnDataByID,
    getMonsterDataByID:getMonsterDataByID,
    getMonsterDataByFoeType: getMonsterDataByFoeType,
    getComboScore: getComboScore,
    getComboColor: getComboColor,
    getStageDataByID: getStageDataByID,
    getValueDataByID: getValueDataByID,
    getPlayerPropertyByLevelAndID: getPlayerPropertyByLevelAndID,
    getPlayerPropertyByStarAndID: getPlayerPropertyByStarAndID,
    getMaxLevelByStarAndID: getMaxLevelByStarAndID,
    getMinLevelByStarAndID: getMinLevelByStarAndID,
    getAttributeDataByID: getAttributeDataByID,
    getShopData: getShopData,
    getRewardDataByID: getRewardDataByID,
    getRangeDataByID: getRangeDataByID,
    getBossSpawnDataByID: getBossSpawnDataByID,
    getBossSpawnData: getBossSpawnData,
    getOneSlashDataByCount: getOneSlashDataByCount,
    getRatingData: getRatingData,
    randomItemInSore: randomItemInSore,
    getBuffItemByType: getBuffItemByType,
    getStoryDataByID: getStoryDataByID,
    getPreLoadScenes: getPreLoadScenes,
    getBuffDisplayData: getBuffDisplayData
};
