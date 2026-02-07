// ================== PITCH DEFINITIONS ==================

const SHARP_SCALE = ["C","C#","D","D#","E","F","F#","G","G#","A","A#","B"];
const FLAT_SCALE  = ["C","Db","D","Eb","E","F","Gb","G","Ab","A","Bb","B"];

// Keys that MUST prefer flats
const FLAT_KEYS = ["F","Bb","Eb","Ab","Db","Gb"];

// ================== NOTE → PITCH ==================

function noteToPitch(note) {
  if (!note) return null;

  const iSharp = SHARP_SCALE.indexOf(note);
  if (iSharp !== -1) return iSharp;

  const iFlat = FLAT_SCALE.indexOf(note);
  if (iFlat !== -1) return iFlat;

  return null; // unknown / invalid note
}

// ================== PITCH → NOTE ==================
// Issue #1 FIX: key-based accidentals
// Issue #2 SAFE: never touches alterations
// ✅ C-major FIX: neutral spelling, NOT frozen pitch

function pitchToNote(pitch, targetKey) {
  pitch = (pitch + 12) % 12;

  // C major → neutral spelling, but still transposed
  if (targetKey === "C") {
    return SHARP_SCALE[pitch];
  }

  // Flat keys → force flats
  if (FLAT_KEYS.includes(targetKey)) {
    return FLAT_SCALE[pitch];
  }

  // Sharp keys → force sharps
  return SHARP_SCALE[pitch];
}

// ================== CHORD PARSER ==================
// Issue #2 FIX: two-layer chord model
//
// Root & Bass  → transposed
// Quality      → preserved
// Alterations  → preserved EXACTLY

function parseChord(chord) {
  /*
    Handles:
    D(b9)
    Db9
    G7(#5)
    F#m7(b5)
    Bb7(#9)/F
    Db7(b9#11)/F
  */

  const [main, bass] = chord.split("/");

  // Root + rest
  const rootMatch = main.match(/^([A-G][b#]?)(.*)$/);
  if (!rootMatch) return null;

  const root = rootMatch[1];
  let rest = rootMatch[2] || "";

  // Extract ONLY alterations in parentheses
  const alterationMatches = rest.match(/\(([^)]+)\)/g) || [];
  const alterations = alterationMatches.slice(); // preserve text exactly

  // Remove alterations from quality
  alterationMatches.forEach(a => {
    rest = rest.replace(a, "");
  });

  return {
    root,               // transposable
    quality: rest,      // maj, m7, sus4, etc.
    alterations,        // ["(b9)", "(#5)", "(b9#11)"]
    bass: bass || null  // transposable
  };
}

// ================== TRANSPOSER ==================
// Issue #1 + Issue #2 COMPLETE FIX

export function transposeChord(chord, fromKey, toKey) {
  const cleanChord = sanitizeChord(chord);

  const parsed = parseChord(cleanChord);
  if (!parsed) return chord;

  const fromPitch = noteToPitch(fromKey);
  const toPitch   = noteToPitch(toKey);
  if (fromPitch === null || toPitch === null) return chord;

  const steps = toPitch - fromPitch;

  function move(note) {
    const pitch = noteToPitch(note);
    if (pitch === null) return note;

    const newPitch = (pitch + steps + 12) % 12;
    return pitchToNote(newPitch, toKey);
  }

  const newRoot = move(parsed.root);
  const newBass = parsed.bass ? move(parsed.bass) : null;

  const rebuilt =
    newRoot +
    parsed.quality +
    parsed.alterations.join("");

  return newBass
    ? `${rebuilt}/${newBass}`
    : rebuilt;
}
