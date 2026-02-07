import Word from "./Word";
import Gap from "./Gap";
import { transposeChord } from "../utils/transpose";

export default function SongLine({
  line,
  originalKey,
  targetKey,
  notation,
  onSlotClick,
  printable = false,
  lyricsOnly = false
}) {

  // 🔥 Detect if ENTIRE line is chord-only
  const isChordOnlyLine = !lyricsOnly && line.slots.every(slot => {
    if (slot.type !== "word") return true;
    const t = slot.text?.trim();
    if (!t) return true;

    // If transposer changes it, it's a chord
    return transposeChord(t, originalKey, targetKey, notation) !== t;
  });

  return (
    <div style={{ marginBottom: printable ? 14 : 15 }}>
      {line.slots.map((slot, i) => {

        /* =====================================
           🔒 LYRICS-ONLY MODE
        ====================================== */
        if (lyricsOnly) {
          if (slot.type !== "word") return null;

          const cleanWordSlot = {
            ...slot,
            chord: null,
            chords: null,
            above: null,
            align: null
          };

          return (
            <Word
              key={i}
              slot={cleanWordSlot}
              originalKey={originalKey}
              targetKey={targetKey}
              printable={printable}
              isChordOnlyLine={false}
            />
          );
        }

        /* =====================================
           NORMAL MODE
        ====================================== */
        if (slot.type === "word") {
          return (
            <Word
              key={i}
              slot={slot}
              originalKey={originalKey}
              targetKey={targetKey}
              notation={notation}
              isChordOnlyLine={isChordOnlyLine}
              onClick={
                onSlotClick ? () => onSlotClick(slot) : undefined
              }
              printable={printable}
            />
          );
        }

        return (
          <Gap
            key={i}
            slot={slot}
            isFirst={i === 0}
            originalKey={originalKey}
            targetKey={targetKey}
            notation={notation}
            onClick={
              onSlotClick ? () => onSlotClick(slot) : undefined
            }
            printable={printable}
          />
        );
      })}
    </div>
  );
}
