// ── CAMERA ────────────────────────────────────────────────────────
let camStream     = null;
let mediaRecorder = null;
let recChunks     = [];
const recordings  = [];   // { blob, animal } — grows each round

// Hidden video element that holds the live stream — used as source for canvas mirrors
const _liveVideo = document.createElement("video");
_liveVideo.muted      = true;
_liveVideo.autoplay   = true;
_liveVideo.playsInline = true;

async function initCamera() {
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

function stopCameraRecording() {
  return new Promise(resolve => {
    if (!mediaRecorder || mediaRecorder.state === "inactive") { resolve(); return; }
    mediaRecorder.onstop = () => {
      const blob = new Blob(recChunks, { type: "video/webm" });
      recordings.push({ blob, animal: STATE.currentAnimal?.label || "" });
      resolve();
    };
    mediaRecorder.stop();
  });
}

// Returns a canvas element that continuously mirrors the live camera feed.
// Each call gets its own independent canvas so we can fill all 20 cells.
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