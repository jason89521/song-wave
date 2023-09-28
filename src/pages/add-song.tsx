import { useState } from 'react';
import { SONG_STORE_NAME } from '../constants';
import { useIndexedDB } from '../indexedDB';
import { Song } from '../type';

const inputClassName = 'border border-cyan-950 border-solid';

export function AddSongPage() {
  const db = useIndexedDB();
  const [disabled, setDisabled] = useState(false);

  if (!db) return <div>loading db...</div>;

  return (
    <form
      onSubmit={e => {
        e.preventDefault();
        setDisabled(true);
        const formData = new FormData(e.currentTarget);
        const transaction = db.transaction(SONG_STORE_NAME, 'readwrite');
        const songStore = transaction.objectStore(SONG_STORE_NAME);

        songStore.put({
          lang: formData.get('lang') as string,
          singer: formData.get('singer') as string,
          name: formData.get('name') as string,
          file: formData.get('file') as File,
        } satisfies Song);

        transaction.oncomplete = () => {
          setDisabled(false);
        };
        transaction.onabort = () => {
          setDisabled(false);
        };
        transaction.onerror = () => {
          setDisabled(false);
        };
      }}
      className="flex flex-col gap-2 px-4 py-8"
    >
      <label>
        Lang:
        <input disabled={disabled} type="text" name="lang" className={inputClassName} required />
      </label>
      <label>
        Singer:
        <input disabled={disabled} type="text" name="singer" className={inputClassName} required />
      </label>
      <label>
        Name:
        <input disabled={disabled} type="text" name="name" className={inputClassName} required />
      </label>
      <label>
        File:
        <input disabled={disabled} name="file" type="file" accept="audio/*" required />
      </label>
      <button type="submit" className="bg-slate-300 px-4 py-2 rounded">
        Submit
      </button>
    </form>
  );
}
