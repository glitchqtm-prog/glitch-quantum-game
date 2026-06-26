class CombatEngine {
    constructor(state) {
        this.state = state;
        this.currentEnemy = { hp: 100 };
    }

    attack() {
        let dmg = this.state.data.stats.str * 2;
        this.currentEnemy.hp -= dmg;
        if (this.currentEnemy.hp <= 0) {
            this.currentEnemy.hp = 100;
            this.state.data.resources.gqt += 10;
            this.state.save();
        }
        return dmg;
    }
}
