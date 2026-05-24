// ── RECORDING SCREEN ──────────────────────────────────────────────
const recCoins     = document.getElementById("rec-coins");
const recCard      = document.getElementById("rec-card");
const recCardLabel = document.getElementById("rec-card-label");
const recCardImg   = document.getElementById("rec-card-img");
const recLabelEl   = document.getElementById("rec-label");

const REC_TIMEOUT_MS = 5000; // auto-end if nothing detected

let recStartTime = 0;
let recTimeoutId = null;

function initRecordingScreen() {
  recCoins.textContent = String(STATE.totalCoins).padStart(4, "0");

  const a = STATE.currentAnimal;
  recCard.className        = `play-card`;
  recCardLabel.textContent = a.displayName;
  recCardImg.src           = `assets/${a.img}`;
  recCardImg.alt           = a.displayName;

  recLabelEl.classList.add("visible");
  startCameraRecording();

  setWavePhase("recording");
  setWavePlayhead(0);
  recStartTime = performance.now();

  recTimeoutId = setTimeout(() => {
    finishRecording("__timeout__", 0);
  }, REC_TIMEOUT_MS);

  tmStartListening((label, score) => {
    if (recTimeoutId) { clearTimeout(recTimeoutId); recTimeoutId = null; }
    finishRecording(label, score);
  });
}

async function finishRecording(label, rawScore) {
  tmStopListening();
  await stopCameraRecording();

  STATE.detectedLabel = label;

  // Score is 0–100 as TM gives it — no cap here.
  // Wrong animal or timeout → score stays low naturally.
  let score;
  if (label === "__timeout__") {
    score = 0;
  } else if (label === STATE.currentAnimal.label) {
    score = Math.round(rawScore); // correct animal: full 0–100
  } else {
    // Wrong animal: reduce to feel like a bad score (max ~40)
    score = Math.floor(Math.min(rawScore, 40) * 0.4);
  }
  STATE.detectedScore = score;

  recLabelEl.classList.remove("visible");
  setWavePhase("idle");
  setWavePlayhead(0);

  showScreen("score");
  setTimeout(() => initScoreScreen(), 600);
}

function tickRecordingScreen() {
  if (!document.getElementById("screen-recording").classList.contains("active")) return;
  const elapsed = performance.now() - recStartTime;
  setWavePlayhead(Math.min(elapsed / REC_PLAYHEAD_MS, 1));
}