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
    FoeType.Foe11,
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