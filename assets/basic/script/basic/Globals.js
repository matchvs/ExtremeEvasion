window.Game = {
    GameManager: null,
    BulletManager: null,
    ItemManager: null,
    PlayerManager: null,
    ClickManager: null
}

window.GameState = cc.Enum({
    None: 0,
    Pause: 1,
    Play: 2,
    Over: 3
})

window.DirectState = cc.Enum({
    None: 0,
    Left: 1,
    Right: 2
})

window.GLB = {
    RANDOM_MATCH: 1,
    PROPERTY_MATCH: 2,
    COOPERATION: 1,
    COMPETITION: 2,
    MAX_PLAYER_COUNT: 2,

    PLAYER_COUNTS: [2],

    GAME_START_EVENT: "gameStart",
    GAME_OVER_EVENT: "gameOver",
    READY: "ready",
    ROUND_START: "roundStar",
    SCORE_EVENT: "score",
    SHOOT_GUN_ITEM: "shootGunItem",
    ADD_BULLET:"addBullet",
    DISTANCE: "distance",
    POSITION:"position",
    SPAWN_SLATE: "slateSpawn",
    HURT: "hurt",
    DIFFUSE_ITEM_GET: "diffuseItemGet",
    RADINTION_ITEM_GET: "radintionItemGet",
    SLATE_HITTING: "SlateHitting",

    channel: 'MatchVS',
    platform: 'alpha',
    gameId: 201552,
    gameVersion: 1,
    IP: "wxrank.matchvs.com",
    PORT: "3010",
    GAME_NAME: "game5",
    appKey: '98cc42394054464f95a7e9879484359d',
    secret: '82cc4ac6b640437aafc7c010bfc4e4d0',

    matchType: 1,
    gameType: 2,
    userInfo: null,
    playerUserIds: [],
    isRoomOwner: false,

    syncFrame: true,
    FRAME_RATE: 10,

    NormalBulletSpeed: 1000,
    limitX: 320,
    limitYTop: 490,
    limitYBottom:620,
    range:20

}
