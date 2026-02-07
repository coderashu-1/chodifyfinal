import { useLayoutEffect, useRef } from "react";
import { transposeChord } from "../utils/transpose";

export default function Gap({
  slot,
  isFirst,
  originalKey,
  targetKey,
  onClick
}) {
  const gapRef = useRef(null);
  const chordGroupRef = useRef(null);

  const baseWidth = isFirst ? 15 : 10;

  useLayoutEffect(() => {
    if (!gapRef.current) return;

    // 🔥 RESET FIRST
    gapRef.current.style.paddingLeft = "";
    gapRef.current.style.paddingRight = "";
    gapRef.current.style.minWidth = baseWidth + "px";
    // gapRef.current.style.margin = "0  3px";


    if (!slot.chords || slot.chords.length === 0) return;
    if (!chordGroupRef.current) return;

    const gapWidth = gapRef.current.offsetWidth;
    const chordWidth = chordGroupRef.current.offsetWidth;

    if (chordWidth <= gapWidth) return;

    const extra = chordWidth - gapWidth + 6;
    const align = slot.align || "center";

    if (align === "start") {
      gapRef.current.style.paddingRight = extra + "px";
    }

    if (align === "center") {
      const half = extra / 2;
      gapRef.current.style.paddingLeft = half + "px";
      gapRef.current.style.paddingRight = half + "px";
    }

    if (align === "end") {
      gapRef.current.style.paddingLeft = extra + "px";
    }
  }, [slot.chords, slot.align, targetKey]);

  return (
    <span
      ref={gapRef}
      onClick={onClick}
      style={{
        display: "inline-block",
        position: "relative",
        cursor: "pointer",
      }}
    >
      {slot.chords?.length > 0 && (
        <span className={`chord-container align-${slot.align || "center"} `} style={{
          top: "-1.254em",
        }}>
          <span ref={chordGroupRef} className="chord-group">
            {slot.chords.map((c, i) => (
              <span key={i} className="chord">
                {transposeChord(c.value, originalKey, targetKey)}
              </span>
            ))}
          </span>
        </span>
      )}
      &nbsp;
    </span>
  );
}
