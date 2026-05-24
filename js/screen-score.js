// ── SCORE SCREEN ──────────────────────────────────────────────────
const scoreCoins   = document.getElementById("score-coins");
const scoreValueEl = document.getElementById("score-value");
const scoreCanvas  = document.getElementById("score-wave-canvas");

const SCORE_DISPLAY_MS = 5000;
const MAX_COINS_PER_ROUND = 50; // coins are capped, score is not

function initScoreScreen() {
  scoreCoins.textContent = String(STATE.totalCoins).padStart(4, "0");

  // Show full score 0–100, no cap
  const score = STATE.detectedScore;
  scoreValueEl.textContent = String(score).padStart(3, "0");

  // Re-trigger pop animation
  scoreValueEl.classList.remove("score-value");
  void scoreValueEl.offsetWidth;
  scoreValueEl.classList.add("score-value");

  // Cap the coins earned (not the score itself)
  // score / 100 * MAX_COINS_PER_ROUND → max 50 coins
  const coinsEarned = Math.round((score / 100) * MAX_COINS_PER_ROUND);
  STATE.detectedScore = score;          // keep real score for display
  STATE.coinsEarned   = coinsEarned;    // separate value used by coins screen

  drawFrozenWave(scoreCanvas);

  setTimeout(() => {
    showScreen("coins");
    setTimeout(() => initCoinsScreen(), 600);
  }, SCORE_DISPLAY_MS);
}

function drawFrozenWave(canvas) {
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const W = canvas.width, H = canvas.height;
  ctx.clearRect(0, 0, W, H);
  const barW = 4;
  const gap  = (W - barW * BAR_COUNT) / (BAR_COUNT - 1);
  for (let i = 0; i < BAR_COUNT; i++) {
    const x    = i * (barW + gap);
    const barH = Math.max(2, waveBase[i]);
    const cy   = H / 2;
    const prog = i / BAR_COUNT;
    ctx.fillStyle = `rgba(80, 90, 255, ${0.55 + 0.45 * prog})`;
    ctx.beginPath();
    ctx.roundRect(x, cy - barH / 2, barW, barH, 2);
    ctx.fill();
  }
}