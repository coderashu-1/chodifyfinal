import SongLine from "./SongLine";

export default function PrintableSong({ song, targetKey }) {
  return (
    <div
      id="printable-root"
      className="print-root preview-mode"
      style={{
        position: "absolute",
        top: 0,
        left: "-99999px"
      }}
    >

      {/* ================= CHORDS + LYRICS ================= */}
      <div id="print-chords">

        {/* HEADER (LOGO LIVES HERE) */}
        <div className="print-header print-header-block">
          <h1 className="print-title">{song.title}</h1>
          <img
            src="/logo.webp"
            alt="Logo"
            className="print-logo"
            crossOrigin="anonymous"
          />
        </div>

        {song.sections.map(section => (
          <div
            key={`chords-${section.id}`}
            className="print-section"
          >
            <h3 className="print-section-title">{section.type}</h3>

            {section.lines.map((line, i) => (
              <SongLine
                key={`chords-${section.id}-${i}`}
                line={line}
                originalKey={song.originalKey}
                targetKey={targetKey}
                printable
              />
            ))}
          </div>
        ))}
      </div>

      {/* ================= LYRICS ONLY ================= */}
      <div id="print-lyrics">

        <div className="lyrics-header lyrics-header-block">
          <h2 className="lyrics-title">
            {song.title} <span>(Lyrics)</span>
          </h2>
          <img
            src="/logo.webp"
            alt="Logo"
            className="print-logo"
            crossOrigin="anonymous"
          />
        </div>

        <div className="lyrics-content">
          {song.sections.map(section => (
            <div
              key={`lyrics-${section.id}`}
              className="lyrics-section"
            >
              <h3 className="lyrics-section-title">{section.type}</h3>

              {section.lines.map((line, i) => (
                <SongLine
                  key={`lyrics-${section.id}-${i}`}
                  line={line}
                  originalKey={song.originalKey}
                  targetKey={targetKey}
                  printable
                  lyricsOnly
                />
              ))}
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
