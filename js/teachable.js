// ── TEACHABLE MACHINE ─────────────────────────────────────────────
let tmRecognizer = null;
let tmListening  = false;
let tmLabels     = [];

async function loadTMModel() {
  try {
    tmRecognizer = speechCommands.create(
      "BROWSER_FFT", undefined,
      MODEL_URL + "model.json",
      MODEL_URL + "metadata.json"
    );
    await tmRecognizer.ensureModelLoaded();
    tmLabels = tmRecognizer.wordLabels();
    setDevStatus("Model ready ✓");
    console.log("TM labels:", tmLabels);
  } catch (e) {
    tmRecognizer = null;
    setDevStatus("Dev mode (no model)");
    console.warn("TM model unavailable:", e);
  }
}

// onDetect(label, score) called once when something passes threshold
function tmStartListening(onDetect) {
  if (tmListening) return;
  if (!tmRecognizer) {
    // Dev simulation: fire after 2 seconds with the current animal
    setTimeout(() => {
      onDetect(STATE.currentAnimal.label, 90);
    }, 2000);
    return;
  }
  tmListening = true;
  tmRecognizer.listen(result => {
    if (!tmListening) return;
    let best = 0, bestLabel = "";
    result.scores.forEach((s, i) => {
      if (s > best) { best = s; bestLabel = tmLabels[i]; }
    });
    if (best >= PROB_THRESHOLD && bestLabel !== BACKGROUND_LABEL) {
      tmStopListening();
      onDetect(bestLabel, Math.round(best * 100));
    }
  }, {
    probabilityThreshold: PROB_THRESHOLD,
    invokeCallbackOnNoiseAndUnknown: false,
    overlapFactor: 0.5,
  });
}

function tmStopListening() {
  tmListening = false;
  try { if (tmRecognizer) tmRecognizer.stopListening(); } catch(e) {}
}

// ── start-screen passive listening (only for the trigger animal) ──
// Fires onMatch() when the correct animal sound is heard
function tmListenForStartTrigger(onMatch) {
  if (!tmRecognizer) {
    // Dev: listen for spacebar instead
    const handler = (e) => {
      if (e.code === "Space") {
        document.removeEventListener("keydown", handler);
        onMatch();
      }
    };
    document.addEventListener("keydown", handler);
    setDevStatus("Dev mode – press SPACE to start");
    return;
  }
  tmListening = true;
  tmRecognizer.listen(result => {
    if (!tmListening) return;
    let best = 0, bestLabel = "";
    result.scores.forEach((s, i) => {
      if (s > best) { best = s; bestLabel = tmLabels[i]; }
    });
    if (
      best >= PROB_THRESHOLD &&
      bestLabel === STATE.currentAnimal.label
    ) {
      tmStopListening();
      onMatch();
    }
  }, {
    probabilityThreshold: PROB_THRESHOLD,
    invokeCallbackOnNoiseAndUnknown: false,
    overlapFactor: 0.5,
  });
}
