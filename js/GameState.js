class GameState {
    constructor() {
        this.data = JSON.parse(localStorage.getItem('gq_save')) || {
            stats: { str: 10, luck: 2 },
            resources: { gqt: 0 },
            level: 1
        };
    }
    save() {
        localStorage.setItem('gq_save', JSON.stringify(this.data));
    }
}
