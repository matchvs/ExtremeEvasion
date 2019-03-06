cc.Class({
    extends: cc.Component,

    properties: {
        selfNode: cc.Node,
        rivalNode: cc.Node,
    },

    onLoad() {
        Game.PlayerManager = this;
        this.self = this.selfNode.getComponent("player");
        this.self.init(GLB.playerUserIds[0]);
        this.rival = this.rivalNode.getComponent("player");
        this.rival.init(GLB.playerUserIds[1]);
    },
    vsMachine(){
        this.rival.node.addComponent("machine");
        var difficulty = Math.floor(Math.random() * 3);
        this.rival.node.getComponent("machine").init(difficulty);
    }
});
