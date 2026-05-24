// ── TEACHABLE MACHINE MODEL ───────────────────────────────────────
const MODEL_URL = "./my_model/";

// TM labels from metadata.json:
// Achtergrondruis, Hippo, Lion, Monkey, Panda, Sea-lion, Zebra

const ANIMALS = [
  {
    name:      "monkey",
    label:     "Monkey",        // must match TM label exactly
    displayName: "Monkey",
    img:       "Monkey.png",
    cardClass: "bg-monkey",
  },
  {
    name:      "lion",
    label:     "Lion",
    displayName: "Lion",
    img:       "Lion.png",
    cardClass: "bg-lion",
  },
  {
    name:      "hippo",
    label:     "Hippo",
    displayName: "Hippo",
    img:       "Hippo.png",
    cardClass: "bg-hippo",
  },
  {
    name:      "sea lion",
    label:     "Sea-lion",
    displayName: "Sea lion",
    img:       "Sea lion.png",
    cardClass: "bg-sealion",
  },
  {
    name:      "zebra",
    label:     "Zebra",
    displayName: "Zebra",
    img:       "Zebra.png",
    cardClass: "bg-zebra",
  },
  {
    name:      "panda",
    label:     "Panda",
    displayName: "Panda",
    img:       "Sea lion-1.png",  // using available panda asset
    cardClass: "bg-panda",
  },
];

const BACKGROUND_LABEL  = "Achtergrondruis";
const PROB_THRESHOLD    = 0.75;
const COUNTDOWN_SECONDS = 3;
const REC_PLAYHEAD_MS   = 3000; // how long the playhead travels during recording
