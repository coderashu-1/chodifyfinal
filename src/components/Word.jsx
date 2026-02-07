import { useLayoutEffect, useRef } from "react";
import { transposeChord } from "../utils/transpose";

export default function Word({
  slot,
  originalKey,
  targetKey,
  notation,
  onClick,
  isChordOnlyLine = false
}) {
  const wordRef = useRef(null);
  const chordGroupRef = useRef(null);

  useLayoutEffect(() => {
    if (!wordRef.current) return;

    wordRef.current.style.paddingLeft = "";
    wordRef.current.style.paddingRight = "";

    if (!slot.chords || slot.chords.length === 0) return;
    if (!chordGroupRef.current) return;

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

  // 🔥 Transpose ONLY if whole line is chord-only
  const transposed = transposeChord(
    slot.text,
    originalKey,
    targetKey,
    notation
  );

  const displayText =
    isChordOnlyLine && transposed !== slot.text
      ? transposed
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
