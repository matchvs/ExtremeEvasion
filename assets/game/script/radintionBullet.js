cc.Class({
    extends: cc.Component,

    init(node) {
        this.trackingNode = node;
        this.speed = 2;
        this.scheduleOnce(this.twinkleState,7);
    },

    destroyBullet() {
        Game.BulletManager.recycleBullet(this.node);
    },
    twinkleState(){
        this.node.getComponent(cc.Animation).play("twinkle");
        this.scheduleOnce(()=>{
            this.node.getComponent(cc.Animation).stop("twinkle");
            this.node.opacity = 255;
            this.destroyBullet();
        },3);

    },
    update(dt) {
        this.node.rotation += 5;
        var trackingNodePos = this.trackingNode.getPosition();
        this.node.x += this.node.x < trackingNodePos.x ? this.speed : -this.speed;
        this.node.y += this.node.y < trackingNodePos.y ? this.speed : -this.speed;
        if (this.node.x < -GLB.limitX || this.node.x > GLB.limitX
            || this.node.y < -GLB.limitYBottom || this.node.y > GLB.limitYTop){
            this.destroyBullet();
        }
    }
});
