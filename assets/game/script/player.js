var mvs = require("Matchvs");
cc.Class({
    extends: cc.Component,

    properties: {
        boomClip:{
            default: null,
            url: cc.AudioClip
        },
        shield:{
            default: null,
            type: cc.Node
        },
        boomPrefab:{
            default: null,
            type: cc.Prefab
        }
    },

    init(playerId) {
        this.playerId = playerId;
        this.playerPos = cc.p();
        this.playerPosBk = this.node.getPosition();
        this.heart = 2;
        this.bUnmatched = false;
        this.shield.active = false;
    },
    onCollisionEnter: function (other) {
        var group = cc.game.groupList[other.node.groupIndex];
        if(group === "redBullet"){
            this.sendHurtMsg();
        }
        else if (group === "greenBullet" && this.node.name === "self"){
            this.sendHurtMsg();
        }
        else if (group === "blueBullet" && this.node.name === "rival"){
            this.sendHurtMsg();
        }
        if (group === "diffuseItem"){
            this.sendDiffuseItemMsg(other.id);
            other.getComponent("item").destroyItem();
            this.unmatchedState("twinkle");
        }
        if(group === "radiationItem"){
            this.sendRadintionItemMsg(other.id);
            other.getComponent("item").destroyItem();
            this.unmatchedState("twinkle");
        }

    },
    hurt() {
        //伤害接口
        if (this.bUnmatched){
            return;
        }
        if (Game.GameManager.playerDie) {
            return;
        }
        cc.audioEngine.play(this.boomClip, false, 1);
        if (this.heart > 0) {
            this.heart--;
            if(this.heart === 1){
                this.unmatchedState("damage");
            }
            else if (this.heart <= 0) {
                Game.GameManager.playerDie = true;
                var boom = cc.instantiate(this.boomPrefab);
                boom.parent = this.node;
                boom.position = cc.v2(0, 0);
                this.dead();
            }
        }
    },

    dead() {
        //游戏结束--
        if (GLB.isRoomOwner) {
            var msg = {
                action: GLB.GAME_OVER_EVENT
            };
            Game.GameManager.sendEventEx(msg);
        }

    },
    unmatchedState(animation){
      this.bUnmatched = true;
      this.shield.active = true;
      this.node.getComponent(cc.Animation).play(animation);
      this.scheduleOnce(()=>{
          this.bUnmatched = false;
          this.shield.active = false;
          this.node.getComponent(cc.Animation).pause(animation);
          this.node.opacity = 255;
      },3);

    },
    setPlayerPosBk(){
        this.playerPosBk = this.node.getPosition();
    },
    setDirect(position) {
        //this.playerPos = position;
        this.node.setPosition(position);
    },
    sendHurtMsg() {
        if (Game.GameManager.gameState === GameState.Play && GLB.isRoomOwner) {
            mvs.engine.sendFrameEvent(JSON.stringify({
                action: GLB.HURT,
                playerId: this.playerId
            }));
        }
    },
    sendDiffuseItemMsg(itemId){
        if (Game.GameManager.gameState === GameState.Play && GLB.isRoomOwner) {
            mvs.engine.sendFrameEvent(JSON.stringify({
                action: GLB.DIFFUSE_ITEM_GET,
                playerId: this.playerId,
            }));
        }
    },
    sendRadintionItemMsg(itemId){
        if (Game.GameManager.gameState === GameState.Play && GLB.isRoomOwner) {
            mvs.engine.sendFrameEvent(JSON.stringify({
                action: GLB.RADINTION_ITEM_GET,
                playerId: this.playerId,
            }));
        }
    },

});
