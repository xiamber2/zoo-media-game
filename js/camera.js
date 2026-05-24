// ── CAMERA ────────────────────────────────────────────────────────
let camStream     = null;
let mediaRecorder = null;
let recChunks     = [];
const recordings  = [];   // { id, blob, animal } — in-memory + persisted in IndexedDB

// Hidden video element — single source for all canvas mirrors
const _liveVideo = document.createElement("video");
_liveVideo.muted       = true;
_liveVideo.autoplay    = true;
_liveVideo.playsInline = true;

async function initCamera() {
  // Load any clips saved from previous sessions
  try {
    const saved = await dbLoadRecordings();
    recordings.push(...saved);
    console.log(`Loaded ${saved.length} recording(s) from IndexedDB`);
  } catch(e) {
    console.warn("Could not load recordings from DB:", e);
  }

  // Start the live camera stream
  try {
    camStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
    _liveVideo.srcObject = camStream;
    await _liveVideo.play().catch(() => {});
    console.log("Camera ready");
  } catch(e) {
    console.warn("Camera unavailable:", e);
  }
}

function startCameraRecording() {
  if (!camStream) return;
  recChunks = [];
  try {
    mediaRecorder = new MediaRecorder(camStream, { mimeType: "video/webm" });
    mediaRecorder.ondataavailable = e => { if (e.data.size > 0) recChunks.push(e.data); };
    mediaRecorder.start();
  } catch(e) { console.warn("MediaRecorder error:", e); }
}

// Stop recording, save blob to IndexedDB, push to recordings[]
async function stopCameraRecording() {
  return new Promise(resolve => {
    if (!mediaRecorder || mediaRecorder.state === "inactive") { resolve(); return; }
    mediaRecorder.onstop = async () => {
      const blob   = new Blob(recChunks, { type: "video/webm" });
      const animal = STATE.currentAnimal?.label || "";

      // Save to IndexedDB and get back the auto-generated id
      const id = await dbSaveRecording(blob, animal).catch(() => null);
      recordings.push({ id, blob, animal });

      resolve();
    };
    mediaRecorder.stop();
  });
}

// Returns a canvas that continuously mirrors the live camera feed
function createLiveMirrorCanvas() {
  const canvas = document.createElement("canvas");
  canvas.width  = 320;
  canvas.height = 240;
  const ctx = canvas.getContext("2d");

  function draw() {
    if (_liveVideo.readyState >= 2) {
      ctx.drawImage(_liveVideo, 0, 0, canvas.width, canvas.height);
    }
    requestAnimationFrame(draw);
  }
  draw();
  return canvas;
}