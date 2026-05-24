// ── START SCREEN ──────────────────────────────────────────────────
const startAnimalName = document.getElementById("start-animal-name");
const startCoins      = document.getElementById("start-coins");
const startCards      = [
  document.getElementById("sc-0"),
  document.getElementById("sc-1"),
  document.getElementById("sc-2"),
];

function initStartScreen() {
  startCoins.textContent = String(STATE.totalCoins).padStart(4, "0");
  pickRandomAnimal();
  startAnimalName.textContent = STATE.currentAnimal.name;

  const others  = ANIMALS.filter(a => a.label !== STATE.currentAnimal.label);
  const picked  = shuffle(others).slice(0, 2);
  const display = shuffle([STATE.currentAnimal, ...picked]);

  display.forEach((animal, i) => {
    const card = startCards[i];
    card.className = `s-card`; // FIX 1: no bg class — image is the card
    card.querySelector(".s-card-label").textContent = animal.displayName;
    card.querySelector("img").src = `assets/${animal.img}`;
    card.querySelector("img").alt = animal.displayName;
  });

  tmListenForStartTrigger(() => {
    showScreen("countdown");
    setTimeout(() => initCountdownScreen(), 600);
  });
}