class GameState {
    constructor() {
        this.data = this.load() || {
            stats: { str: 10, agi: 5, int: 5, luck: 2 },
            resources: { gqt: 0, energy: 100 },
            level: 1,
            inventory: []
        };
    }

    save() {
        localStorage.setItem('glitch_quantum_save', JSON.stringify(this.data));
    }

    load() {
        const saved = localStorage.getItem('glitch_quantum_save');
        try {
            return saved ? JSON.parse(saved) : null;
        } catch (e) {
            return null;
        }
    }
}
