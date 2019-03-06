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
        this.targetPos = null;
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
            this.sendDiffuseItemMsg(other.node.getPosition());
            other.getComponent("item").destroyItem();
            this.unmatchedState("twinkle");
        }
        if(group === "radiationItem"){
            this.sendRadintionItemMsg(other.node.getPosition());
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
            if (GLB.vsMachine) {
                Game.GameManager.gameOver();
            }else{
                var msg = {
                    action: GLB.GAME_OVER_EVENT
                };
                Game.GameManager.sendEventEx(msg);
            }
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
        this.targetPos = position;
    },
    sendHurtMsg() {
        if (GLB.vsMachine) {
            this.hurt();
        }else{
            if (Game.GameManager.gameState === GameState.Play && GLB.isRoomOwner) {
                mvs.engine.sendFrameEvent(JSON.stringify({
                    action: GLB.HURT,
                    playerId: this.playerId
                }));
            }
        }
    },
    sendDiffuseItemMsg(pos){
        if (GLB.vsMachine) {
            var type = this.playerId === GLB.userInfo.id ? "blue" : "green";
            Game.BulletManager.diffuseBullet(type, pos);
        }else{
            if (Game.GameManager.gameState === GameState.Play && GLB.isRoomOwner) {
                mvs.engine.sendFrameEvent(JSON.stringify({
                    action: GLB.DIFFUSE_ITEM_GET,
                    playerId: this.playerId,
                    pos: pos
                }));
            }
        }
    },
    sendRadintionItemMsg(pos){
        if (GLB.vsMachine) {
            let obj = this.playerId === GLB.userInfo.id ? Game.PlayerManager.rival.node : Game.PlayerManager.self.node;
            Game.BulletManager.radintionBullet(obj, pos);
        }else{
            if (Game.GameManager.gameState === GameState.Play && GLB.isRoomOwner) {
                mvs.engine.sendFrameEvent(JSON.stringify({
                    action: GLB.RADINTION_ITEM_GET,
                    playerId: this.playerId,
                    pos: pos
                }));
            }
        }
    },
    update(dt){
        if (this.targetPos && Game.GameManager.gameState === GameState.Play) {
            var playerPos = this.node.getPosition();
            var nextPosX = cc.lerp(playerPos.x, this.targetPos.x, 4 * dt);
            var nextPosY = cc.lerp(playerPos.y, this.targetPos.y, 4 * dt);
            this.node.setPosition(cc.p(nextPosX,nextPosY));
        }
    }


});
