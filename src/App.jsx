import { useState, useEffect } from "react";
import SongInput from "./components/SongInput";
import SongEditor from "./components/SongEditor";
import SongLibrary from "./components/SongLibrary";
import { loadSongs, saveSongs } from "./utils/storage";

export default function App() {
  const [songs, setSongs] = useState([]);
  const [activeSong, setActiveSong] = useState(null);

  // 🔥 LOAD FROM LOCAL STORAGE
  useEffect(() => {
    setSongs(loadSongs());
  }, []);

  function createSong(song) {
    const newSong = {
      ...song,
      id: "song_" + Date.now(),
      createdAt: Date.now()
    };

    const updated = [...songs, newSong];
    setSongs(updated);
    saveSongs(updated);
    setActiveSong(newSong);
  }

  function updateSong(updatedSong) {
    const updated = songs.map(s =>
      s.id === updatedSong.id ? updatedSong : s
    );

    setSongs(updated);
    saveSongs(updated);
    setActiveSong(updatedSong);
  }

  return (
    <div style={{ minHeight: "100vh", padding: 30 }}>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <h1 style={{ textAlign: "center", marginBottom: 10 }}>
          🎵 ChordCraft Studio
        </h1>

        <p style={{ textAlign: "center", color: "#94a3b8", marginBottom: 30 }}>
          Create • Transpose • Print songs with chords perfectly aligned
        </p>

        {!activeSong ? (
          <>
            <div className="card">
              <SongInput onCreate={createSong} />
            </div>

            <SongLibrary
              songs={songs}
              onOpen={setActiveSong}
            />
          </>
        ) : (
          <SongEditor
            song={activeSong}
            onBack={() => setActiveSong(null)}
            onChange={updateSong}
          />
        )}
      </div>
    </div>
  );
} 