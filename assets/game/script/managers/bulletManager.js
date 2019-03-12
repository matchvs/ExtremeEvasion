cc.Class({
    extends: cc.Component,

    properties: {
        redBulletPrefab: cc.Prefab,
        blueBulletPrefab: cc.Prefab,
        greenBulletPrefab: cc.Prefab,
        radintionBulletPrefab: cc.Prefab
    },

    onLoad() {
        Game.BulletManager = this;
        this.redBulletPool = new cc.NodePool();
        this.buleBulletPool = new cc.NodePool();
        this.greenBulletPool = new cc.NodePool();
        this.radintionBulletPool = new cc.NodePool();
        this.redNumber = 0;
        this.speed = 50;
    },

    addBullet(data) {
        if (Game.GameManager.gameState !== GameState.Play){
            return;
        }
        var bullet = this.redBulletPool.get();
        if (!bullet) {
            bullet = cc.instantiate(this.redBulletPrefab);
        }
        bullet.parent = Game.BulletManager.node;
        bullet.bulletType = "red";
        bullet.setPosition(data.bulletPos);
        bullet.getComponent("bullet").init(data.speed,data.angle);
    },
    setBulletData(){
        this.redNumber = this.redNumber > 35 ? 0 : this.redNumber;
        var bulletDir = Math.floor(Math.random()*4);
        var x = 0;
        var y = 0;
        var angle = Math.random() * 6.28;
        switch (bulletDir){
            case 0 : x = -GLB.limitX - Math.random() * 50;
                     y = -GLB.limitYBottom + Math.random() * (GLB.limitYTop + GLB.limitYBottom);
                var n = Math.floor(Math.random()*2);
                if (n === 0){
                    angle = Math.floor(Math.random()*45)/100*6.28;
                }else{
                    angle = 315 + Math.floor(Math.random()*45)/100*6.28;
                }
                break;
            case 1 : x = GLB.limitX + Math.random() * 50;
                     y = -GLB.limitYBottom + Math.random() * (GLB.limitYTop + GLB.limitYBottom);
                angle = 135 + Math.floor(Math.random()*90)/100*6.28;
                break;
            case 2 : x = -GLB.limitX + Math.random() * (GLB.limitX * 2);
                     y = GLB.limitYTop + Math.random() * 50;
                angle = 225 + Math.floor(Math.random()*90)/100*6.28;
                break;
            case 3 : x = -GLB.limitX + Math.random() * (GLB.limitX * 2);
                     y = -GLB.limitYBottom - Math.random() * 50;
                angle = 45 + Math.floor(Math.random()*90)/100*6.28;
                break;
        }
        var bulletPos = cc.v2(x,y);
        var speed = 0;
        if (this.redNumber > 25){
            speed = this.speed * 1.5;
        }else{
            speed = this.speed;
        }
        this.redNumber++;
        var data = {bulletPos:bulletPos,
                     angle:angle,
                     speed:speed}
        return data;
    },

    recycleBullet(target) {
        switch (target.bulletType){
            case "red": this.redBulletPool.put(target);
                break;
            case "blue": this.buleBulletPool.put(target);
                break;
            case "green": this.greenBulletPool.put(target);
                break;
            case "radintion": this.radintionBulletPool.put(target);
                break;
        }
    },

    diffuseBullet(bulletType,position){
        var angle = 0.628;
        for(let i = 1; i < 11; i++){
            if (bulletType === "blue"){
                var bullet = this.buleBulletPool.get();
                if (!bullet) {
                    bullet = cc.instantiate(this.blueBulletPrefab);
                    bullet.bulletType = "blue";
                }
            }else{
                var bullet = this.greenBulletPool.get();
                if (!bullet) {
                    bullet = cc.instantiate(this.greenBulletPrefab);
                    bullet.bulletType = "green";
                }
            }
            bullet.parent = Game.BulletManager.node;
            bullet.setPosition(position);
            bullet.getComponent("bullet").init(this.speed,angle*i);
        }
    },
    radintionBullet(obj,position){
        var bullet = this.radintionBulletPool.get();
        if(!bullet){
            bullet = cc.instantiate(this.radintionBulletPrefab)
        }
        bullet.parent = Game.BulletManager.node;
        bullet.bulletType = "radintion";
        bullet.setPosition(position);
        bullet.getComponent("radintionBullet").init(obj);
    }
});
