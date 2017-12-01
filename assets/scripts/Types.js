const BossType = cc.Enum({
    Demon: -1,
    SkeletonKing: -1
});

const FoeType = cc.Enum({
    Foe0: -1,
    Foe1: -1,
    Foe2: -1,
    Foe3: -1,
    Foe4: -1,
    Foe5: -1,
    Foe6: -1,
    Foe7: -1,
    Foe8: -1,
    Foe9: -1,
    Foe10: -1,
    Foe11: -1,
    Foe12: -1,
    Foe13: -1,
    Foe14: -1,
    Foe15: -1,
    Foe16: -1,
    Foe17: -1,
    Foe18: -1,
    Foe19: -1,
    Foe20: -1,
    Foe21: -1,
    Foe22: -1,
    Foe23: -1,
    Foe24: -1,
    Foe25: -1,
    Foe26: -1,
    Foe27: -1,
    Foe28: -1,
    Foe29: -1,
    Foe30: -1,
    Foe31: -1,
    Foe32: -1,
    Foe33: -1,
    Foe34: -1,
    Foe35: -1,
    Boss1: -1,
    Boss2: -1
});

const ProjectileType = cc.Enum({
    Arrow: -1,
    Fireball: -1,
    Javelin: -1,
    Darts: -1,
    Fireball2: -1,
    Fireball3: -1,
    None: 999
});

const ProjectileBrokeAnimation = [
    "arrow-break",
    "explode",
    "explode",
    "darts-break",
    "explode2",
    "explode3",
];

const LifeType = cc.Enum({
    INIT: -1,
    ADD: -1,
    COST: -1
});

const GameType  = cc.Enum({
    NORMAL: -1,
    STEP: -1,
    CD: -1,
    NONE: 999
});

const AttributeType = cc.Enum({
    HP: 1,
    HURT_RADIUS: 2,
    ATK_DISTANCE: 3,
    ATK_DURATION: 4,
    ATK_INTERVAL: 5,
    SPEED: 6 
});

const AttributeName = [
    "health",
    "hurt_radius",
    "attack_distance",
    "attack_time",
    "attack_interval",
    "moving_speed"
];

const sceneType = cc.Enum({
    NORMAL: -1,
    BATTLE_NORMAL: -1,
    BATTLE_BOSS: -1,
    None: 999
});

const BG_MUSIC_NAME = [
    "bg_music/bgm_main",
    "bg_music/bgm_battle",
    "bg_music/bgm_over",
];

module.exports = {
    BossType,
    FoeType,
    ProjectileType,
    ProjectileBrokeAnimation,
    AttributeName,
    BG_MUSIC_NAME,
    sceneType,
    GameType,
    LifeType,
    AttributeType
};