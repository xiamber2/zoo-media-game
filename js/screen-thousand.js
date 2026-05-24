// ── THOUSAND COINS SCREEN  (Desktop 10) ──────────────────────────
const thousandDisplayEl = document.getElementById("thousand-display");
const particleCanvas    = document.getElementById("particle-canvas");
const pCtx              = particleCanvas.getContext("2d");

let particles = [];

function initThousandScreen() {
  particleCanvas.width  = 1280;
  particleCanvas.height = 800;
  particles = [];
  thousandDisplayEl.textContent = "0000";

  playVictorySound();

  let current  = 0;
  const target = 1000;
  let lastPing = 0;

  function tick() {
    if (current >= target) {
      thousandDisplayEl.textContent = "1000";
      spawnBurst(640, 400, 60);
      playCoinPing();
      setTimeout(() => {
        showScreen("grid");
        setTimeout(() => initGridScreen(), 600);
      }, 2500);
      return;
    }
    const increment = Math.max(1, Math.floor((target - current) * 0.06 + 2));
    current = Math.min(current + increment, target);
    thousandDisplayEl.textContent = String(current).padStart(4, "0");
    if (current - lastPing >= 40) {
      playCoinPing();
      spawnBurst(640, 400, 6);
      lastPing = current;
    }
    setTimeout(tick, 30);
  }

  setTimeout(tick, 400);
  animateParticles();
}

function spawnBurst(cx, cy, count) {
  for (let i = 0; i < count; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = 2 + Math.random() * 6;
    particles.push({
      x: cx + (Math.random() - 0.5) * 60,
      y: cy + (Math.random() - 0.5) * 30,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 3,
      life: 1.0,
      r: 4 + Math.random() * 10,
      hue: 40 + Math.random() * 30,
    });
  }
}

function animateParticles() {
  pCtx.clearRect(0, 0, particleCanvas.width, particleCanvas.height);
  particles = particles.filter(p => p.life > 0.01);
  particles.forEach(p => {
    p.x  += p.vx; p.y += p.vy;
    p.vy += 0.12; p.vx *= 0.97;
    p.life -= 0.022;
    pCtx.save();
    pCtx.globalAlpha = p.life;
    pCtx.fillStyle   = `hsl(${p.hue}, 90%, 55%)`;
    pCtx.beginPath();
    pCtx.ellipse(p.x, p.y, p.r * p.life, p.r * p.life, 0, 0, Math.PI * 2);
    pCtx.fill();
    pCtx.restore();
  });
  if (Math.random() < 0.3) spawnBurst(300 + Math.random() * 680, 500 + Math.random() * 200, 2);
  requestAnimationFrame(animateParticles);
}