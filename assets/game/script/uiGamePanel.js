var mvs = require("Matchvs");
var uiPanel = require("uiPanel");
cc.Class({
    extends: uiPanel,

    properties: {
        bgmAudio: {
            default: null,
            url: cc.AudioClip
        }
    },
    onLoad() {
        this._super();
        this.node.on(clientEvent.eventType.playerMove, this.playerMove, this);
        this.bCreateBullet = false;
        clientEvent.on(clientEvent.eventType.roundStart, this.roundStart, this);
        clientEvent.on(clientEvent.eventType.gameOver, this.gameOver, this);
        clientEvent.on(clientEvent.eventType.leaveRoomMedNotify, this.leaveRoom, this);
        this.nodeDict["exit"].on(cc.Node.EventType.TOUCH_START, this.exit, this);
        this.bgmId = cc.audioEngine.play(this.bgmAudio, true, 1);
    },
    showLcon() {
        this.playerLcon = this.nodeDict["player"].getComponent("playerIcon");
        this.playerLcon.setData({id: GLB.playerUserIds[0]});
        this.rivalLcon = this.nodeDict["rival"].getComponent("playerIcon");
        this.rivalLcon.setData({id: GLB.playerUserIds[1]});
    },
    createBullet() {
        for (let i = 0; i < 30; i++) {
            this.sendAddBulletMsg();
        }
        clearInterval(this.scheduleBullet);
        this.scheduleBullet = setInterval(function() {
            this.sendAddBulletMsg();
        }.bind(this), 200);
    },
    leaveRoom(data) {
        if (Game.GameManager.gameState !== GameState.Over) {
            uiFunc.openUI("uiTip", function(obj) {
                var uiTip = obj.getComponent("uiTip");
                if (uiTip) {
                    uiTip.setData("对手离开了游戏");
                }
            }.bind(this));
        }
    },
    playerMove() {
        var playerPos = Game.ClickManager.playerPos;
        this.sendDirectMsg(playerPos);
    },
    sendDirectMsg(position) {
        if (Game.GameManager.gameState === GameState.Play) {
            mvs.engine.sendFrameEvent(JSON.stringify({
                action: GLB.POSITION,
                position: position
            }));
        }

    },
    sendAddBulletMsg() {
        if (!GLB.isRoomOwner) {
            return;
        }
        var bulletData = Game.BulletManager.setBulletData();
        if (Game.GameManager.gameState === GameState.Play) {
            mvs.engine.sendFrameEvent(JSON.stringify({
                action: GLB.ADD_BULLET,
                bulletData: bulletData
            }));
        }
    },
    exit() {
        uiFunc.openUI("uiExit");
    },

    gameOver: function() {
        this.nodeDict['gameOver'].getComponent(cc.Animation).play();
        this.nodeDict['gameOver'].getComponent(cc.AudioSource).play();
        clearInterval(this.scheduleBullet);
        cc.audioEngine.stop(this.bgmId);
    },

    roundStart: function() {
        this.nodeDict['readyGo'].getComponent(cc.Animation).play();
        this.nodeDict['readyGo'].getComponent(cc.AudioSource).play();
        this.createBullet();
        this.showLcon();

    },
    leaveRoom() {
        if (Game.GameManager.gameState !== GameState.Over) {
            uiFunc.openUI("uiTip", function(obj) {
                var uiTip = obj.getComponent("uiTip");
                if (uiTip) {
                    uiTip.setData("对手离开了游戏");
                }
            }.bind(this));
        }
    },
    onDestroy() {
        clientEvent.off(clientEvent.eventType.roundStart, this.roundStart, this);
        clientEvent.off(clientEvent.eventType.gameOver, this.gameOver, this);
        clientEvent.off(clientEvent.eventType.leaveRoomMedNotify, this.leaveRoom, this);

    },

});
