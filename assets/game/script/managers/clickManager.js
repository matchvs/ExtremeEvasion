// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {


    },

    onLoad () {
        Game.ClickManager = this;
        this.clickPosBk = cc.p();
        this.playerPos = cc.p();
        this.node.on(cc.Node.EventType.TOUCH_START,this.touchstart,this);
        this.node.on(cc.Node.EventType.TOUCH_MOVE,this.touchmove,this);
        //this.node.on(cc.Node.EventType.TOUCH_END,this.touchmove,this);
    },


    touchstart(event){
        this.touchId = event.getID();
        this.clickPosBk = event.getLocation();
        Game.PlayerManager.self.setPlayerPosBk();
        this.bTouch = true;
        //cc.log(this.clickPosBk);
    },
    touchmove(event){
        if (event.getID() !== this.touchId){
            return;
        }
        var clickPos = event.getLocation();
        var playerPosBk = Game.PlayerManager.self.playerPosBk;
        var x = playerPosBk.x - (this.clickPosBk.x - clickPos.x);
        var y = playerPosBk.y - (this.clickPosBk.y - clickPos.y);
        x = x > GLB.limitX - GLB.range ? GLB.limitX - GLB.range :
            x < -GLB.limitX + GLB.range ? -GLB.limitX + GLB.range : x;
        y = y > GLB.limitYTop - GLB.range ? GLB.limitYTop - GLB.range:
            y < -GLB.limitYBottom + GLB.range ? -GLB.limitYBottom + GLB.range : y;
        this.playerPos = cc.p(x,y);
    },
    //start () {},
    update (dt) {
        if (this.bTouch){
            this.node.dispatchEvent(new cc.Event.EventCustom(clientEvent.eventType.playerMove,true));
        }
    },
});
