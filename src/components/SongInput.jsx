import { useState } from "react";

const SECTION_TYPES = [
  "Intro",
  "Verse",
  "Pre-Chorus",
  "Chorus",
  "Bridge",
  "Outro",
  "Custom"
];

const ALL_KEYS = [
  "C",
  "Db","D","Eb","E",
  "F","Gb","G","Ab","A",
  "Bb","B"
];

export default function SongInput({ onCreate }) {
  const [title, setTitle] = useState("");
  const [key, setKey] = useState("C"); // ✅ default neutral
  const [sections, setSections] = useState([]);

  function addSection() {
    setSections([
      ...sections,
      {
        id: "sec_" + Date.now(),
        type: "Verse",
        customType: "",
        lyrics: ""
      }
    ]);
  }

  function updateSection(i, field, value) {
    const copy = [...sections];
    copy[i][field] = value;
    setSections(copy);
  }

  function createSong() {
    const finalSections = sections.map(sec => {
      const lines = sec.lyrics
        .split("\n")
        .filter(Boolean)
        .map(line => {
          const words = line.trim().split(/\s+/);

          const slots = [
            { type: "gap", chords: [] }, // leading gap
            ...words.flatMap(w => [
              { type: "word", text: w, chords: [] },
              { type: "gap", chords: [] }
            ])
          ];

          return { slots };
        });

      return {
        id: sec.id,
        type: sec.type === "Custom" ? sec.customType : sec.type,
        lines
      };
    });

    onCreate({
      title: title || "Untitled Song",
      originalKey: key,
      sections: finalSections
    });
  }

  return (
    <>
      <h2>Create New Song</h2>

      <input
        placeholder="Song title"
        value={title}
        onChange={e => setTitle(e.target.value)}
        style={{ width: "100%", marginBottom: 10 }}
      />

      {/* ✅ FIXED KEY SELECT */}
      <select
        value={key}
        onChange={e => setKey(e.target.value)}
        style={{ width: "100%", marginBottom: 10 }}
      >
        {ALL_KEYS.map(k => (
          <option key={k} value={k}>{k}</option>
        ))}
      </select>

      {sections.map((sec, i) => (
        <div key={sec.id} className="card" style={{ marginBottom: 14 }}>
          <select
            value={sec.type}
            onChange={e => updateSection(i, "type", e.target.value)}
          >
            {SECTION_TYPES.map(t => (
              <option key={t}>{t}</option>
            ))}
          </select>

          {sec.type === "Custom" && (
            <input
              placeholder="Section name"
              value={sec.customType}
              onChange={e => updateSection(i, "customType", e.target.value)}
              style={{ marginTop: 8 }}
            />
          )}

          <textarea
            rows={4}
            placeholder="Paste lyrics for this section"
            value={sec.lyrics}
            onChange={e => updateSection(i, "lyrics", e.target.value)}
            style={{ width: "100%", marginTop: 8 }}
          />
        </div>
      ))}

      <button onClick={addSection} style={{ width: "100%", marginBottom: 10 }}>
        + Add Section
      </button>

      <button onClick={createSong} style={{ width: "100%" }}>
        Create Song
      </button>
    </>
  );
}
