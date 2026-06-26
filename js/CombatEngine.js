class CombatEngine {
    constructor(state) {
        this.state = state;
        this.enemyHp = 100;
    }
    attack() {
        let dmg = this.state.data.stats.str;
        this.enemyHp -= dmg;
        if (this.enemyHp <= 0) {
            this.enemyHp = 100 + (this.state.data.level * 10);
            this.state.data.resources.gqt += 5;
            this.state.save();
        }
        return dmg;
    }
}
