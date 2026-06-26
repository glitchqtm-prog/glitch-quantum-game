const state = new GameState();
const combat = new CombatEngine(state);

function gameLoop() {
    combat.attack();
    
    // UI Güncelleme
    document.getElementById('gqt-val').innerText = state.data.resources.gqt;
    document.getElementById('ehp').innerText = combat.enemyHp;
    
    // Karakter animasyon tetikleyici
    document.getElementById('player').classList.add('attack-anim');
    setTimeout(() => document.getElementById('player').classList.remove('attack-anim'), 200);
    
    setTimeout(gameLoop, 1000);
}

gameLoop();
