import { useEffect, useState } from 'react';
import { useIndexedDB } from '../indexedDB';
import { DB_NAME, SONG_STORE_NAME, SongIndex } from '../constants';
import { Song, SongWithAudioURL } from '../type';
import { interludeSong, requestedSongModel } from '../model';
import { Button } from '.';
import { EDBObjectStore, openDB } from '../indexedDB/EDB';

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

    (async () => {
      const edb = await openDB<{ songs: { value: Song; index: SongIndex } }>({
        name: DB_NAME,
        onUpgrade() {},
      });
      const transaction = edb.transaction(['songs'], 'readwrite');
      const store = new EDBObjectStore<SongIndex>({ store: transaction.objectStore('songs') });
      const index = store.index(SongIndex.name);
      console.log(await index.get('上水的花'));
      console.log(await index.getAll());
      console.log(await index.getKey('上水的花'));
      console.log(await index.getAllKeys());
    })();
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
                <Button
                  className="cursor-pointer rounded bg-slate-300 px-2 py-1 text-sm"
                  onClick={() => {
                    requestedSongModel.mutate(draft => draft.data.push(song));
                  }}
                >
                  點播
                </Button>
                <Button
                  className="cursor-pointer rounded bg-slate-300 px-2 py-1 text-sm"
                  onClick={() => {
                    interludeSong(song);
                  }}
                >
                  插播
                </Button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
