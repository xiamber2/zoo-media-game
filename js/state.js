// ── GLOBAL GAME STATE ─────────────────────────────────────────────
// All screens read/write this single object.

const STATE = {
  totalCoins:    0,
  currentAnimal: null,   // one entry from ANIMALS[]
  detectedLabel: "",
  detectedScore: 0,      // 0–100, the raw TM confidence score
  coinsEarned:   0,      // coins for this round, capped at 50
};

// Utility: pick a random animal
function pickRandomAnimal() {
  STATE.currentAnimal = ANIMALS[Math.floor(Math.random() * ANIMALS.length)];
}

// Utility: shuffle array (Fisher-Yates)
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}