import { ReactNode, createContext, useContext, useEffect, useState } from 'react';

const context = createContext<IDBDatabase | undefined>(undefined);

export function IndexedDBProvider({
  name,
  children,
  version,
  onUpgradeNeeded,
}: {
  name: string;
  children: ReactNode;
  version: number;
  onUpgradeNeeded: (db: IDBDatabase, e: IDBVersionChangeEvent) => void;
}) {
  const [db, setDB] = useState<IDBDatabase>();

  useEffect(() => {
    const openRequest = indexedDB.open(name, version);
    openRequest.addEventListener('upgradeneeded', e => {
      onUpgradeNeeded(openRequest.result, e);
    });
    openRequest.addEventListener('success', () => {
      setDB(openRequest.result);
    });
  }, [name, version, onUpgradeNeeded]);

  if (!db) return null;

  return <context.Provider value={db}>{children}</context.Provider>;
}

export function useIndexedDB() {
  const db = useContext(context);
  if (!db) throw new Error('There is no indexed db');

  return db;
}
