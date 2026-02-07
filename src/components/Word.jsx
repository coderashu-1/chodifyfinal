import { useLayoutEffect, useRef } from "react";
import { transposeChord } from "../utils/transpose";

/* =====================================
   CHORD DETECTOR
   Matches: B, Am, A#m11, D#7, G#m7,
            B/F#, Gdim, F#7, etc.
===================================== */
function isChordLike(text) {
  if (!text) return false;

  return /^[A-G](#|b)?(m|maj|min|dim|aug)?\d*(sus\d*)?(add\d*)?(\/[A-G](#|b)?)?$/.test(
    text.trim()
  );
}

export default function Word({
  slot,
  originalKey,
  targetKey,
  notation,
  onClick
}) {
  const wordRef = useRef(null);
  const chordGroupRef = useRef(null);

  useLayoutEffect(() => {
    if (!wordRef.current) return;

    // 🔄 RESET PADDING FIRST
    wordRef.current.style.paddingLeft = "";
    wordRef.current.style.paddingRight = "";

    if (!slot.chords || slot.chords.length === 0) return;
    if (!chordGroupRef.current) return;

    // Print-safe measurement
    const wordRect = wordRef.current.getBoundingClientRect();
    const chordRect = chordGroupRef.current.getBoundingClientRect();

    const wordWidth = wordRect.width;
    const chordWidth = chordRect.width;

    if (chordWidth <= wordWidth) return;

    const extra = chordWidth - wordWidth + 6;
    const align = slot.align || "center";

    if (align === "start") {
      wordRef.current.style.paddingRight = extra + "px";
    }

    if (align === "center") {
      const half = extra / 2;
      wordRef.current.style.paddingLeft = half + "px";
      wordRef.current.style.paddingRight = half + "px";
    }

    if (align === "end") {
      wordRef.current.style.paddingLeft = extra + "px";
    }
  }, [slot.chords, slot.align, targetKey]);

  /* =====================================
     🔥 INLINE CHORD TRANSPOSITION
     If the WORD ITSELF is a chord,
     transpose it just like overhead chords
  ===================================== */
  const displayText = isChordLike(slot.text)
    ? transposeChord(slot.text, originalKey, targetKey, notation)
    : slot.text;

  return (
    <span ref={wordRef} className="word" onClick={onClick}>
      {slot.chords?.length > 0 && (
        <span className={`chord-container align-${slot.align || "center"}`}>
          <span ref={chordGroupRef} className="chord-group">
            {slot.chords.map((c, i) => (
              <span key={i} className="chord">
                {transposeChord(c.value, originalKey, targetKey, notation)}
              </span>
            ))}
          </span>
        </span>
      )}
      {displayText}&nbsp;
    </span>
  );
}
