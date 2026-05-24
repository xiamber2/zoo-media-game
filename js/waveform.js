// ── WAVEFORM ──────────────────────────────────────────────────────
// Draws on whichever canvas is passed in.
// Called every rAF from main loop.

const BAR_COUNT = 80;

// Pre-generate a natural-looking waveform shape (gaussian envelope)
const waveBase = Array.from({ length: BAR_COUNT }, (_, i) => {
  const t   = i / BAR_COUNT;
  const env = Math.exp(-Math.pow((t - 0.5) * 3, 2));
  return 4 + env * 28 + Math.random() * 12;
});

// Per-bar noise (shared across both canvases so they look the same)
const waveNoise = new Array(BAR_COUNT).fill(0);

// Current playhead position 0-1 (only used in recording phase)
let wavePlayhead = 0;
let wavePhase    = "idle";   // "idle" | "recording"

function setWavePhase(phase) { wavePhase = phase; }
function setWavePlayhead(t)  { wavePlayhead = t; }

function tickWaveNoise() {
  for (let i = 0; i < BAR_COUNT; i++) {
    const amp = wavePhase === "recording" ? 2.5 : 1.0;
    waveNoise[i] += (Math.random() - 0.5) * amp;
    waveNoise[i] *= 0.82;
    waveNoise[i] = Math.max(-10, Math.min(10, waveNoise[i]));
  }
}

function drawWaveform(canvas) {
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const W = canvas.width, H = canvas.height;
  ctx.clearRect(0, 0, W, H);

  const barW = 4;
  const gap  = (W - barW * BAR_COUNT) / (BAR_COUNT - 1);
  const playX = wavePlayhead * W;

  for (let i = 0; i < BAR_COUNT; i++) {
    const x    = i * (barW + gap);
    const barH = Math.max(2, waveBase[i] + waveNoise[i]);
    const cy   = H / 2;
    const midX = x + barW / 2;

    // Colour logic
    if (wavePhase === "recording" && midX < playX) {
      // played section → blue/purple gradient
      const prog  = midX / W;
      const alpha = 0.6 + 0.4 * prog;
      ctx.fillStyle = `rgba(80, 90, 255, ${alpha})`;
    } else {
      // idle grey, brighter toward centre
      const t      = i / BAR_COUNT;
      const env    = Math.exp(-Math.pow((t - 0.5) * 2.5, 2));
      const bright = Math.round(55 + env * 95);
      ctx.fillStyle = `rgb(${bright},${bright},${bright})`;
    }

    ctx.beginPath();
    ctx.roundRect(x, cy - barH / 2, barW, barH, 2);
    ctx.fill();
  }

  // White playhead line during recording
  if (wavePhase === "recording") {
    ctx.save();
    ctx.strokeStyle = "rgba(255,255,255,0.85)";
    ctx.lineWidth   = 2;
    ctx.beginPath();
    ctx.moveTo(playX, 4);
    ctx.lineTo(playX, H - 4);
    ctx.stroke();
    ctx.restore();
  }
}
