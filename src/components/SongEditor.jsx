import { useState, useRef } from "react";
import SongLine from "./SongLine";
import ChordPopup from "./ChordPopup";
import DownloadButton from "./DownloadButton";
import PrintableSong from "./PrintableSong";

const ALL_KEYS = [
  "C","Db","D","Eb","E",
  "F","Gb","G","Ab","A",
  "Bb","B"
];

export default function SongEditor({ song, onChange, onBack }) {
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [targetKey, setTargetKey] = useState(song.originalKey);

  function saveChord(payload) {
    selectedSlot.chords = payload.chords;
    selectedSlot.align = payload.align;
    setSelectedSlot(null);
    onChange({ ...song });
  }

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto" }}>
      {/* 🎛️ TOOLBAR */}
      <div className="card" style={{ marginBottom: 20 }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "auto 1fr auto auto",
            gap: 12,
            alignItems: "center"
          }}
        >
          <button onClick={onBack}>← Back</button>

          <h2 style={{ margin: 0, textAlign: "center" }}>
            {song.title}
          </h2>

          <select
            value={targetKey}
            onChange={e => setTargetKey(e.target.value)}
          >
            {ALL_KEYS.map(k => (
              <option key={k} value={k}>{k}</option>
            ))}
          </select>

          <DownloadButton title={song.title} />
        </div>
      </div>

      {/* 🎼 EDITOR VIEW */}
      <div className="song-canvas" style={{ padding: 32 }}>
        {song.sections.map(section => (
          <div key={section.id} style={{ marginBottom: 36 }}>
            <h3 style={{ textTransform: "uppercase" }}>
              {section.type}
            </h3>

            {section.lines.map((line, i) => (
              <SongLine
                key={i}
                line={line}
                originalKey={song.originalKey}
                targetKey={targetKey}
                onSlotClick={setSelectedSlot}
              />
            ))}
          </div>
        ))}
      </div>

      {/* 🖨️ PRINTABLE VIEW (OFFSCREEN BUT RENDERED) */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: "-99999px",
          width: "auto",
          height: "auto",
          overflow: "visible"
        }}
      >
        <PrintableSong
          song={song}
          targetKey={targetKey}
        />
      </div>

      {selectedSlot && (
        <ChordPopup
          slot={selectedSlot}
          onSave={saveChord}
          onClose={() => setSelectedSlot(null)}
        />
      )}
    </div>
  );
}