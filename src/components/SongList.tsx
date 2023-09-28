import { useEffect, useState } from 'react';
import { useIndexedDB } from '../indexedDB';
import { SONG_STORE_NAME } from '../constants';
import { Song, SongWithAudioURL } from '../type';

export function SongList() {
  const db = useIndexedDB();
  const [songs, setSongs] = useState<SongWithAudioURL[]>([]);

  useEffect(() => {
    const transaction = db.transaction(SONG_STORE_NAME);
    const songStore = transaction.objectStore(SONG_STORE_NAME);
    const req = songStore.getAll();
    transaction.oncomplete = () => {
      const rawSongs = req.result as Song[];
      setSongs(
        rawSongs.map(rawSong => {
          return { ...rawSong, audioURL: URL.createObjectURL(rawSong.file) };
        })
      );
    };
  }, [db]);

  return (
    <div>
      {songs.map((song, index) => {
        const title = `[${song.lang}] ${song.singer} - ${song.name}`;

        return (
          <div className="mb-4" key={index}>
            <div>{title}</div>
            <audio controls src={song.audioURL} title={title} />
          </div>
        );
      })}
    </div>
  );
}
