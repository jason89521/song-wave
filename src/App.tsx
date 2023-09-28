import { useEffect, useState } from 'react';
import { IndexedDBProvider } from './indexedDB';
import {
  SONG_STORE_NAME,
  SongIndex,
  Page,
  pageComponentRecord,
  DB_NAME,
  DB_VERSION,
} from './constants';

function handleUpgrade(db: IDBDatabase, e: IDBVersionChangeEvent) {
  switch (e.oldVersion) {
    case 0: {
      const songStore = db.createObjectStore(SONG_STORE_NAME, { autoIncrement: true });
      songStore.createIndex(SongIndex.name, 'name');
      songStore.createIndex(SongIndex.singer, 'singer');
      songStore.createIndex(SongIndex.lang, 'type');
    }
    // falls through
  }
}

function App() {
  const [currentPage, setCurrentPage] = useState(Page.home);
  const PageComponent = pageComponentRecord[currentPage];
  useEffect(() => {
    // const transaction = db.transaction(SONG_OBJECT_STORE_NAME);
    // const songStore = transaction.objectStore(SONG_OBJECT_STORE_NAME);
    // const nameIndex = songStore.index(SongIndex.name);
    // songStore.getAll();
    // nameIndex.get('林宥嘉');
    // // cursor
    // const cursorReq = songStore.openCursor();
    // cursorReq.addEventListener('success', () => {
    //   const cursor = cursorReq.result;
    //   if (cursor) {
    //     const { key, value, primaryKey } = cursor;
    //     console.log(key, value, primaryKey);
    //     cursor.continue();
    //   } else {
    //     console.log('No more songs');
    //   }
    // });
  }, []);

  return (
    <IndexedDBProvider name={DB_NAME} version={DB_VERSION} onUpgradeNeeded={handleUpgrade}>
      <div className="flex gap-4">
        <button className="px-2 py-1 bg-gray-300 rounded" onClick={() => setCurrentPage(Page.home)}>
          Home
        </button>
        <button
          className="px-2 py-1 bg-gray-300 rounded"
          onClick={() => setCurrentPage(Page.addSong)}
        >
          Add Song
        </button>
      </div>
      <PageComponent />
    </IndexedDBProvider>
  );
}

export default App;
