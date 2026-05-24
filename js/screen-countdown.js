// ── COUNTDOWN SCREEN ──────────────────────────────────────────────
const cdCoins     = document.getElementById("cd-coins");
const cdCard      = document.getElementById("cd-card");
const cdCardLabel = document.getElementById("cd-card-label");
const cdCardImg   = document.getElementById("cd-card-img");
const cdNumber    = document.getElementById("cd-number");

let cdCount    = 3;
let cdInterval = null;

function initCountdownScreen() {
  cdCoins.textContent = String(STATE.totalCoins).padStart(4, "0");

  const a = STATE.currentAnimal;
  // FIX 1: no bg class — card is just the image
  cdCard.className        = `play-card`;
  cdCardLabel.textContent = a.displayName;
  cdCardImg.src           = `assets/${a.img}`;
  cdCardImg.alt           = a.displayName;

  setWavePhase("idle");
  setWavePlayhead(0);

  cdCount = COUNTDOWN_SECONDS;
  showCDNumber(cdCount);

  if (cdInterval) clearInterval(cdInterval);
  cdInterval = setInterval(() => {
    cdCount--;
    if (cdCount <= 0) {
      clearInterval(cdInterval);
      cdInterval = null;
      showScreen("recording");
      setTimeout(() => initRecordingScreen(), 600);
    } else {
      showCDNumber(cdCount);
    }
  }, 1000);
}

function showCDNumber(n) {
  cdNumber.textContent = n;
  cdNumber.className   = `c${n}`;
  cdNumber.classList.remove("pop");
  void cdNumber.offsetWidth;
  cdNumber.classList.add("pop");
}