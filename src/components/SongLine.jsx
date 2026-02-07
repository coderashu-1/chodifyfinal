import Word from "./Word";
import Gap from "./Gap";

export default function SongLine({
  line,
  originalKey,
  targetKey,
  notation,
  onSlotClick,
  printable = false,
  lyricsOnly = false
}) {
  return (
    <div style={{ marginBottom: printable ? 14 : 15 }}>
      {line.slots.map((slot, i) => {

        /* =====================================
           🔒 LYRICS-ONLY MODE
           - Render ONLY words
           - Strip ALL chord-related data
           - No gaps, no chord text, no overlap
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
            />
          );
        }

        /* =====================================
           NORMAL MODE (CHORDS + LYRICS)
        ====================================== */
        if (slot.type === "word") {
          return (
            <Word
              key={i}
              slot={slot}
              originalKey={originalKey}
              targetKey={targetKey}
              notation={notation}
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
