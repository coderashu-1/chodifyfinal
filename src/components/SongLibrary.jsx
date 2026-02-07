export default function SongLibrary({ songs, onOpen }) {
  if (!songs.length) return null;

  return (
    <div style={{ marginTop: 30 }}>
      <h3 style={{ marginBottom: 10 }}>Saved Songs</h3>

      {songs.map(song => (
        <div
          key={song.id}
          onClick={() => onOpen(song)}
          style={{
            background: "#020617",
            padding: 14,
            borderRadius: 10,
            marginBottom: 10,
            cursor: "pointer",
            boxShadow: "inset 0 0 0 1px #1e293b"
          }}
        >
          <strong>{song.title}</strong>
          <div style={{ fontSize: 12, color: "#94a3b8" }}>
            Original Key: {song.originalKey}
          </div>
        </div>
      ))}
    </div>
  );
}