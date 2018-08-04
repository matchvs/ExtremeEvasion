
cc.Class({
    extends: cc.Component,

    properties: {

    },

    destroyItem() {
        Game.ItemManager.recycleItem(this.node);
    },

});
