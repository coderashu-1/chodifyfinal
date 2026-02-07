import { useState, useEffect } from "react";

export default function ChordPopup({ slot, onSave, onClose }) {
  const [value, setValue] = useState(
    (slot.chords || []).map(c => c.value).join(" ")
  );

  // ✅ READ ALIGN FROM SLOT, NOT CHORD
  const [align, setAlign] = useState(slot.align || "center");

  function save() {
    const chords = value
      .split(/[\s,]+/)
      .filter(Boolean)
      .map(v => ({ value: v }));
  
    onSave({
      chords,
      align: slot.type === "word" ? align : "center"
    });
  }
  

  useEffect(() => {
    function handleKey(e) {
      if (e.key === "Enter") save();
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [value, align]);

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <h4>Add Chords</h4>

        <input
          autoFocus
          placeholder="C  D  Em"
          value={value}
          onChange={e => setValue(e.target.value)}
          style={{
            width: "100%",
            marginBottom: 12,
            textAlign: "center"
          }}
        />

        {/* ALIGNMENT — WORDS ONLY */}
        {slot.type === "word" && (
          <div style={{ display: "flex", gap: 6, marginBottom: 14 }}>
            {["start", "center", "end"].map(a => (
              <button
                key={a}
                onClick={() => setAlign(a)}
                style={{
                  flex: 1,
                  opacity: align === a ? 1 : 0.4
                }}
              >
                {a.toUpperCase()}
              </button>
            ))}
          </div>
        )}

        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={onClose} style={{ flex: 1, opacity: 0.6 }}>
            Cancel
          </button>
          <button onClick={save} style={{ flex: 1 }}>
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
