const Player = require("./Player.js");

class Witch extends Player {
    potionHeal;
    potionDead;

    constructor() {
        super("Sorciere",1);
        this.potionHeal = true;
        this.potionDead = true;
    }

    GetPotionHeal() {
        return this.potionHeal;
    }

    GetPotionDead() {
        return this.potionDead;
    }

    // Heal
    // Dead
}
module.exports = Witch;