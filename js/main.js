// Nesneleri oluştur
const state = new GameState();
const combat = new CombatEngine(state);

// Arayüzü güncelleme fonksiyonu
function updateUI() {
    // Burada HTML içindeki elementleri (örn: HP, GQT) güncelleyeceğiz
    console.log("GQT:", state.data.resources.gqt);
}

// Ana Oyun Döngüsü
function gameLoop() {
    // Savaş mantığı burada sürekli çalışacak
    combat.attack();
    updateUI();
    
    // 1 saniye bekle ve tekrarla
    setTimeout(gameLoop, 1000);
}

// Oyunu başlat
gameLoop();
