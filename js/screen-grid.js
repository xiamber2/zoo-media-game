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
      // Recorded clip — play the blob as a looping video
      const vid = document.createElement("video");
      vid.src         = URL.createObjectURL(recordings[i].blob);
      vid.autoplay    = true;
      vid.muted       = true;
      vid.loop        = true;
      vid.playsInline = true;
      cell.appendChild(vid);
    } else {
      // No clip yet — show live camera mirror canvas
      const mirror = createLiveMirrorCanvas();
      mirror.style.width    = "100%";
      mirror.style.height   = "100%";
      mirror.style.objectFit = "cover";
      cell.appendChild(mirror);
    }

    videoGrid.appendChild(cell);
  }

  if (gridTimeout) clearTimeout(gridTimeout);
  gridTimeout = setTimeout(endCelebration, GRID_DISPLAY_MS);
}

async function endCelebration() {
  if (gridTimeout) { clearTimeout(gridTimeout); gridTimeout = null; }

  // Clear persisted recordings from IndexedDB and in-memory array
  await dbClearRecordings();
  recordings.length = 0;

  // Reset coins in localStorage
  resetCoins();

  showScreen("start");
  setTimeout(() => initStartScreen(), 600);
}