// ── LOCAL STORAGE ─────────────────────────────────────────────────
// Single source of truth for persisting coins across sessions.

const STORAGE_KEY = "zoomedia_coins";

// Load coins from localStorage into STATE
function loadCoins() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    STATE.totalCoins = saved !== null ? parseInt(saved, 10) : 0;
  } catch(e) {
    console.warn("localStorage read failed:", e);
    STATE.totalCoins = 0;
  }
}

// Save current STATE.totalCoins to localStorage
function saveCoins() {
  try {
    localStorage.setItem(STORAGE_KEY, String(STATE.totalCoins));
  } catch(e) {
    console.warn("localStorage write failed:", e);
  }
}

// Reset coins to 0 in both STATE and localStorage
function resetCoins() {
  STATE.totalCoins = 0;
  saveCoins();
}
