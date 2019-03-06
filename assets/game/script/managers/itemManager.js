var mvs = require("Matchvs");
cc.Class({
    extends: cc.Component,

    properties: {
        diffuseItem: cc.Prefab,
        radintionItem:cc.Prefab
    },

    onLoad() {
        Game.ItemManager = this;
        this.itemsNumber = 0;
        this.diffuseItemPool = new cc.NodePool();
        this.radintionItemPool = new cc.NodePool();
        clientEvent.on(clientEvent.eventType.roundStart, this.roundStart, this);
        clientEvent.on(clientEvent.eventType.roundOver, this.roundOver, this);
        clientEvent.on(clientEvent.eventType.gameOver, this.gameOver, this);
    },

    roundStart() {
        this.scheduleItemSpawn();
    },

    scheduleItemSpawn() {
        clearInterval(this.scheduleItemId);
        this.scheduleItemId = setInterval(function(){
            if (Game.GameManager.gameState === GameState.Over || !GLB.isRoomOwner) {
                return;
            }
            if (this.itemsNumber < 2) {
                var itemData = this.setBulletData();
                if (GLB.vsMachine){
                    this.addItem(itemData);
                } else{
                    mvs.engine.sendFrameEvent(JSON.stringify({
                        action: GLB.SHOOT_GUN_ITEM,
                        itemData: itemData
                    }));
                }
            }
        }.bind(this), 6000);
    },

    setBulletData(){
        var itemType = Math.floor(Math.random()*2);
        var x = -GLB.limitX + Math.random() * GLB.limitX*2;
        var y = -GLB.limitYBottom + Math.random() * (GLB.limitYTop + GLB.limitYBottom - 20);
        var itemPos = cc.p(x,y);
        var data = {itemPos:itemPos,
            itemType:itemType}
        return data;
    },

    addItem(data) {
        if (data.itemType === 0){
            var item = this.diffuseItemPool.get();
            if(!item){
                item = cc.instantiate(this.diffuseItem);
                item.itemType = "diffuse";
            }
        } else{
            var item = this.radintionItemPool.get();
            if(!item){
                item = cc.instantiate(this.radintionItem);
                item.itemType = "radintion";
            }
        }
        item.parent = this.node;
        item.setPosition(data.itemPos);
        this.itemsNumber++;
    },

    recycleItem(target) {
        switch (target.itemType){
            case "diffuse":this.diffuseItemPool.put(target);
                break;
            case "radintion":this.radintionItemPool.put(target);
                break;
        }
        this.itemsNumber--;
    },

    roundOver() {
        clearInterval(this.scheduleItemId);
    },

    gameOver() {
        clearInterval(this.scheduleItemId);
    },

    onDestroy() {
        clientEvent.off(clientEvent.eventType.roundStart, this.roundStart, this);
        clientEvent.off(clientEvent.eventType.roundOver, this.roundOver, this);
        clientEvent.off(clientEvent.eventType.gameOver, this.gameOver, this);
    }

});
