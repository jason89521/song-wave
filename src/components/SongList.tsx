import { useEffect, useState } from 'react';
import { useIndexedDB } from '../indexedDB';
import { SONG_STORE_NAME } from '../constants';
import { Song, SongWithAudioURL } from '../type';
import { interludeSong, requestedSongModel } from '../model';

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
            <div>
              <span>{title}</span>
              <div className="flex gap-2">
                <button
                  className="cursor-pointer rounded bg-slate-300 px-2 py-1 text-sm"
                  onClick={() => {
                    requestedSongModel.mutate(draft => draft.data.push(song));
                  }}
                >
                  點播
                </button>
                <button
                  className="cursor-pointer rounded bg-slate-300 px-2 py-1 text-sm"
                  onClick={() => {
                    interludeSong(song);
                  }}
                >
                  插播
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
