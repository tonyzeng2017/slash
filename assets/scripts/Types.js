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

const FoeTypeMap = [
    FoeType.Foe0,
    FoeType.Foe1,
    FoeType.Foe2,
    FoeType.Foe3,
    FoeType.Foe4,
    FoeType.Foe5,
    FoeType.Foe6,
    FoeType.Foe7,
    FoeType.Foe8,
    FoeType.Foe9,
    FoeType.Foe10,
    FoeType.Foe12,
    FoeType.Foe13,
    FoeType.Foe14,
    FoeType.Foe15,
    FoeType.Foe16,
    FoeType.Foe17,
    FoeType.Foe18,
    FoeType.Foe19,
    FoeType.Foe20,
    FoeType.Foe21,
    FoeType.Foe22,
    FoeType.Foe23,
    FoeType.Foe24,
    FoeType.Foe25,
    FoeType.Foe26,
    FoeType.Foe27,
    FoeType.Foe28,
    FoeType.Foe29,
    FoeType.Foe30,
    FoeType.Foe31,
    FoeType.Foe32,
    FoeType.Foe33,
    FoeType.Foe34,
    FoeType.Foe35,
    FoeType.Boss1,
    FoeType.Boss2,
];

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

const GameType  = cc.Enum({
    NORMAL: -1,
    STEP: -1,
    CD: -1,
    NONE: 999
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
    FoeTypeMap,
    ProjectileBrokeAnimation,
    AttributeName,
    BG_MUSIC_NAME,
    sceneType,
    GameType,
};