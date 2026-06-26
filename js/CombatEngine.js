class CombatEngine {
    constructor(state) {
        this.state = state;
        this.currentEnemy = { hp: 100, maxHp: 100 };
    }

    // Karakterin düşmana hasar vermesi
    attack() {
        const damage = this.state.data.stats.str * 2;
        this.currentEnemy.hp -= damage;
        
        if (this.currentEnemy.hp <= 0) {
            this.handleVictory();
        }
        return damage;
    }

    handleVictory() {
        this.currentEnemy.hp = 100 + (this.state.data.level * 20);
        this.state.data.resources.gqt += 10; // Ödül
        this.state.save();
        console.log("Düşman yok edildi!");
    }
}
