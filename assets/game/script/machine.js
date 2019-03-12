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

    start () {
        this.player = this.node.getComponent("player");
        this.number = 0;
        this.direction = null;
        this.dt = 0;
    },
    init(difficulty){
        switch (difficulty) {
            case 0: this.difficulty = MachineDifficulty.Easy;
                this.speed = 2.5;
                this.time = 0.15;
                this.schedule(this.checkMoveDir,this.time);
                break;
            case 1: this.difficulty = MachineDifficulty.Normal;
                this.speed = 3;
                this.time = 0.1;
                this.schedule(this.checkMoveDir,this.time);
                break;
            case 2: this.difficulty = MachineDifficulty.Hard;
                this.speed = 5;
                break;
        }
        this.dt = this.time;
    },
    onDestroy(){
        this.unschedule(this.checkMoveDir);
    },
    checkMoveDir(){
        this.directionScore = {
          up: 1000,
          down: 1000,
          left: 1000,
          right: 1000
        };
        var pos = this.node.getPosition();
        var arrBullet = Game.BulletManager.node.children;
        for (let i = 0; i < arrBullet.length; i++){
            if (this.player.bUnmatched){
                break;
            }
            if (arrBullet[i].bulletType !== "green"){
                var bulletPos = arrBullet[i].getPosition();
                if (this.seekDanger(pos,bulletPos)) {
                    var comingPos = this.seekComingPos(arrBullet[i]);
                    if (comingPos && this.difficulty > 0){
                        this.seekDanger(pos,comingPos);
                    }
                }
            }
        }

        if (this.difficulty>0){
            var arrItem = Game.ItemManager.node.children;
            for (let i = 0; i < arrItem.length; i++){
                var itemPos = arrItem[i].getPosition();
                this.seekItem(pos,itemPos);
            }
        }

        if (pos.x < -GLB.limitX + 100) {
            this.directionScore.left -= 10;
        }
        else if (pos.x > GLB.limitX - 100) {
            this.directionScore.right -= 10;
        }
        if (pos.y < -GLB.limitYBottom + 100) {
            this.directionScore.down -= 10;
        }
        else if (pos.y > GLB.limitYTop - 100) {
            this.directionScore.up -= 10;
        }
        this.safeDirection();
    },
    seekComingPos(target){
        if (target.bulletType === "radintion" || this.dt === 0){
            return null;
        }
        var bullet = target.getComponent("bullet");
        var x = target.x + bullet.speed * this.dt* Math.cos(bullet.angle);
        var y = target.y + bullet.speed * this.dt* Math.cos(bullet.angle);
        return cc.v2(x,y);
    },
    safeDirection(){
        var arrMove = [];
        var maxScore = Math.max(this.directionScore.up,this.directionScore.down,
            this.directionScore.left,this.directionScore.right);
        for (let i in this.directionScore) {
            if (this.directionScore[i] === maxScore) {
                arrMove.push(i);
            }
        }
        if (arrMove.length === 1){
            this.direction = arrMove[0];
        }else if(arrMove.length === 4){
            this.number++;
            if (this.number>15){
                this.number = 0;
                var i = Math.floor(Math.random() * arrMove.length);
                this.direction = arrMove[i];
            } else{
                this.direction = this.direction;
            }
        } else{
            var i = Math.floor(Math.random() * arrMove.length);
            this.direction = arrMove[i];
        }
    },

    seekDanger(start,end){
        // if (start.x == end.x && start.y == end.y){
        //     return false;
        // }
        var diffX = Math.abs(start.x - end.x);
        var diffY = Math.abs(start.y - end.y);
        var range = Math.sqrt(diffX*diffX + diffY*diffY);

        if (range > 100){
            return false;
        }
        var score = -(100 - Math.round(range)) * 10;

        var z = Math.sqrt(diffX*diffX+diffY*diffY);
        var angle = Math.round(Math.asin(diffY/z)/Math.PI*180);
        if (end.x >= start.x && end.y >= start.y){
            angle = angle;
        }else if (end.x <= start.x && end.y >= start.y){
            angle = 180 - angle;
        }else if (end.x <= start.x && end.y <= start.y){
            angle = 180 + angle;
        }else if (end.x >= start.x && end.y <= start.y){
            angle = 360 - angle;
        }
        if (angle > 45 && angle <= 135){
            this.directionScore.up += score;
        } else if (angle > 135 && angle <= 225){
            this.directionScore.left += score;
        } else if (angle > 225 && angle <= 315){
            this.directionScore.down += score;
        } else if(angle > 315 || angle <= 45){
            this.directionScore.right += score;
        }
        return true;
    },
    seekItem(start,end){
        var diffX = Math.abs(start.x - end.x);
        var diffY = Math.abs(start.y - end.y);
        var range = Math.sqrt(diffX*diffX + diffY*diffY);
        if (this.difficulty === MachineDifficulty.Normal && range > GLB.limitX){
            return;
        }else if (this.difficulty === MachineDifficulty.Hard && range > GLB.limitX * 2){
            return;
        }
        var score = 50;
        if (range < 100){
            score = 80;
        }
        var z = Math.sqrt(diffX*diffX+diffY*diffY);
        var angle = Math.round(Math.asin(diffY/z)/Math.PI*180);
        if (end.x >= start.x && end.y >= start.y){
            angle = angle;
        }else if (end.x <= start.x && end.y >= start.y){
            angle = 180 - angle;
        }else if (end.x <= start.x && end.y <= start.y){
            angle = 180 + angle;
        }else if (end.x >= start.x && end.y <= start.y){
            angle = 360 - angle;
        }
        if (angle > 45 && angle <= 135){
            this.directionScore.up += score;
        } else if (angle > 135 && angle <= 225){
            this.directionScore.left += score;
        } else if (angle > 225 && angle <= 315){
            this.directionScore.down += score;
        } else if(angle > 315 || angle <= 45){
            this.directionScore.right += score;
        }
    },
    update (dt) {
        if (Game.GameManager.gameState !== GameState.Play){
            return;
        }

        if (this.difficulty>1){
            this.dt = dt;
            this.checkMoveDir();
        }

        switch (this.direction){
            case null : break;
            case "up" : this.node.y += this.speed;
                break;
            case "down" : this.node.y -= this.speed;
                break;
            case "left" : this.node.x -= this.speed;
                break;
            case "right" : this.node.x += this.speed;
                break;
        }

        if (this.node.x < -GLB.limitX + GLB.range) {
            this.node.x = -GLB.limitX + GLB.range;
        }
        else if (this.node.x > GLB.limitX - GLB.range) {
            this.node.x = GLB.limitX - GLB.range;
        }
        if (this.node.y < -GLB.limitYBottom + GLB.range) {
            this.node.y = -GLB.limitYBottom + GLB.range;
        }
        else if (this.node.y > GLB.limitYTop - GLB.range) {
            this.node.y = GLB.limitYTop - GLB.range;
        }
    },
});
