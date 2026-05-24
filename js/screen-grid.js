// ── VIDEO GRID SCREEN  (Desktop 11) ──────────────────────────────
const videoGrid = document.getElementById("video-grid");
const GRID_DISPLAY_MS = 8000;
let gridTimeout = null;

function initGridScreen() {
  videoGrid.innerHTML = "";
  const total = 20; // 5 cols × 4 rows

  for (let i = 0; i < total; i++) {
    const cell = document.createElement("div");
    cell.className = "grid-cell";

    if (recordings[i]) {
      // Recorded clip from a previous round — play it as a looping video
      const vid = document.createElement("video");
      vid.src         = URL.createObjectURL(recordings[i].blob);
      vid.autoplay    = true;
      vid.muted       = true;
      vid.loop        = true;
      vid.playsInline = true;
      cell.appendChild(vid);
    } else {
      // No recording yet — show live camera mirror via canvas
      // (canvas mirrors are reliable even with 20 copies)
      const mirror = createLiveMirrorCanvas();
      mirror.style.width  = "100%";
      mirror.style.height = "100%";
      mirror.style.objectFit = "cover";
      cell.appendChild(mirror);
    }

    videoGrid.appendChild(cell);
  }

  if (gridTimeout) clearTimeout(gridTimeout);
  gridTimeout = setTimeout(endCelebration, GRID_DISPLAY_MS);
}

function endCelebration() {
  if (gridTimeout) { clearTimeout(gridTimeout); gridTimeout = null; }
  resetCoins(); // sets STATE.totalCoins = 0 and saves to localStorage
  recordings.length = 0;
  showScreen("start");
  setTimeout(() => initStartScreen(), 600);
}