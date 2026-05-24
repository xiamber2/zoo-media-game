// ── MAIN ENTRY POINT ──────────────────────────────────────────────
const devStatusEl = document.getElementById("dev-status");
function setDevStatus(msg) { devStatusEl.textContent = msg; }

async function boot() {
  setDevStatus("Loading model…");

  // Load saved coins from localStorage before anything renders
  loadCoins();

  // Open IndexedDB (must happen before initCamera loads saved recordings)
  await openDB();

  await initCamera();
  await loadTMModel();

  initStartScreen();
  loop();
}

// ── RENDER LOOP ───────────────────────────────────────────────────
function loop() {
  tickWaveNoise();

  const cdActive  = document.getElementById("screen-countdown").classList.contains("active");
  const recActive = document.getElementById("screen-recording").classList.contains("active");

  if (cdActive)  drawWaveform(document.getElementById("wave-canvas"));
  if (recActive) {
    tickRecordingScreen();
    drawWaveform(document.getElementById("wave-canvas-rec"));
  }

  requestAnimationFrame(loop);
}

boot();