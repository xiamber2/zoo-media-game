// ── INDEXEDDB — video blob storage ───────────────────────────────
// Stores { id, blob, animal } records that survive page reloads.

const DB_NAME    = "zoomedia";
const DB_VERSION = 1;
const STORE_NAME = "recordings";

let _db = null;

// Open (or create) the database — call once at boot before anything else
function openDB() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);

    req.onupgradeneeded = e => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        // auto-increment id so each clip gets a unique key
        db.createObjectStore(STORE_NAME, { keyPath: "id", autoIncrement: true });
      }
    };

    req.onsuccess = e => { _db = e.target.result; resolve(_db); };
    req.onerror   = e => { console.warn("IndexedDB open failed:", e); reject(e); };
  });
}

// Save a blob to the store — returns the new record id
function dbSaveRecording(blob, animal) {
  return new Promise((resolve, reject) => {
    if (!_db) { resolve(null); return; }
    const tx  = _db.transaction(STORE_NAME, "readwrite");
    const req = tx.objectStore(STORE_NAME).add({ blob, animal });
    req.onsuccess = () => resolve(req.result);
    req.onerror   = e => { console.warn("DB save failed:", e); reject(e); };
  });
}

// Load all stored recordings — returns array of { id, blob, animal }
function dbLoadRecordings() {
  return new Promise((resolve, reject) => {
    if (!_db) { resolve([]); return; }
    const tx  = _db.transaction(STORE_NAME, "readonly");
    const req = tx.objectStore(STORE_NAME).getAll();
    req.onsuccess = () => resolve(req.result || []);
    req.onerror   = e => { console.warn("DB load failed:", e); reject(e); };
  });
}

// Delete all recordings — called after the 1000-coin celebration
function dbClearRecordings() {
  return new Promise((resolve, reject) => {
    if (!_db) { resolve(); return; }
    const tx  = _db.transaction(STORE_NAME, "readwrite");
    const req = tx.objectStore(STORE_NAME).clear();
    req.onsuccess = () => resolve();
    req.onerror   = e => { console.warn("DB clear failed:", e); reject(e); };
  });
}
