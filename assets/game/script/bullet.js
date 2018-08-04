cc.Class({
    extends: cc.Component,

    init(speed,angle) {
        this.speed = speed;
        this.angle = angle;
    },

    destroyBullet() {
        Game.BulletManager.recycleBullet(this.node);
    },
    update(dt) {
        this.node.x += this.speed * dt* Math.cos(this.angle);
        this.node.y += this.speed * dt * Math.sin(this.angle);
        if (this.node.x < -GLB.limitX-20 || this.node.x > GLB.limitX+20
            || this.node.y < -GLB.limitYBottom || this.node.y > GLB.limitYTop){
            this.destroyBullet();
        }
    }
});
