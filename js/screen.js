// ── SCREEN MANAGER ────────────────────────────────────────────────
// FIX 5: dissolve transition — fade out current, then fade in next.
// Start screen uses instant switch (no dissolve needed going INTO it
// from boot, but dissolve still applies when leaving).

const SCREENS = ["start","countdown","recording","score","coins","thousand","grid"];
const DISSOLVE_MS = 600; // must match CSS --dissolve duration

function showScreen(name, instant = false) {
  if (instant) {
    SCREENS.forEach(id => {
      const el = document.getElementById(`screen-${id}`);
      if (el) el.classList.toggle("active", id === name);
    });
    return;
  }

  // Fade out all active screens first
  SCREENS.forEach(id => {
    const el = document.getElementById(`screen-${id}`);
    if (el && el.classList.contains("active")) {
      el.classList.remove("active");
    }
  });

  // After fade-out completes, fade in the new screen
  setTimeout(() => {
    const next = document.getElementById(`screen-${name}`);
    if (next) next.classList.add("active");
  }, DISSOLVE_MS);
}