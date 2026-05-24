// ── COIN COUNT-UP SCREEN  (Desktop 7) ────────────────────────────
// NOTE: STATE.totalCoins already has this round's coins added (saved by score screen).
// We animate from (totalCoins - coinsEarned) up to totalCoins for the visual effect.

const coinsDisplayEl = document.getElementById("coins-display");
const COINS_MIN_DISPLAY_MS = 5000;

function initCoinsScreen() {
  const screenEnteredAt = performance.now();

  const roundCoins = STATE.coinsEarned ?? 0;
  const endVal     = STATE.totalCoins;           // already includes this round
  const startVal   = endVal - roundCoins;        // where we animate from

  coinsDisplayEl.textContent = String(startVal).padStart(4, "0");

  let current  = startVal;
  let lastPing = startVal;
  const PING_INTERVAL = Math.max(1, Math.floor(roundCoins / 20));
  const STEP_MS = Math.max(20, Math.floor(1800 / Math.max(roundCoins, 1)));

  function tick() {
    if (current >= endVal) {
      coinsDisplayEl.textContent = String(endVal).padStart(4, "0");

      const elapsed   = performance.now() - screenEnteredAt;
      const remaining = Math.max(0, COINS_MIN_DISPLAY_MS - elapsed);

      setTimeout(() => {
        if (STATE.totalCoins >= 1000) {
          showScreen("thousand");
          setTimeout(() => initThousandScreen(), 600);
        } else {
          showScreen("start");
          setTimeout(() => initStartScreen(), 600);
        }
      }, remaining);
      return;
    }

    const rem       = endVal - current;
    const increment = Math.max(1, Math.floor(rem * 0.08 + 1));
    current = Math.min(current + increment, endVal);
    coinsDisplayEl.textContent = String(current).padStart(4, "0");

    if (current - lastPing >= PING_INTERVAL) {
      playCoinPing();
      lastPing = current;
    }
    setTimeout(tick, STEP_MS);
  }

  setTimeout(tick, 300);
}