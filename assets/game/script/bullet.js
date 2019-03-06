cc.Class({
    extends: cc.Component,

    init(speed,angle) {
        this.speed = speed;
        this.angle = angle;
        this.doom = false;
        this.scheduleOnce(()=>{this.doom = true;},1.0);
    },

    destroyBullet() {
        Game.BulletManager.recycleBullet(this.node);
    },
    update(dt) {
        this.node.x += this.speed * dt* Math.cos(this.angle);
        this.node.y += this.speed * dt * Math.sin(this.angle);
        if (this.node.x < -GLB.limitX-20 || this.node.x > GLB.limitX+20
            || this.node.y < -GLB.limitYBottom){
            if (this.doom){
                this.destroyBullet();
            }
        }else if(this.node.y > GLB.limitYTop){
            this.destroyBullet();
        }
    }
});
