const state = new GameState();
const combat = new CombatEngine(state);

function gameLoop() {
    // 1. Düşmanları güncelle
    // 2. Karakter animasyonunu oynat
    // 3. Ekrana çizdir
    requestAnimationFrame(gameLoop);
}

// Oyunu başlat
gameLoop();
