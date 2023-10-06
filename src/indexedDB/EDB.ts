type IDBQuery = IDBValidKey | IDBKeyRange;

class EDBRequest<S extends IDBObjectStore | IDBIndex | IDBCursor, T> {
  #req: IDBRequest<T>;

  #unlisten() {
    this.#req.onerror = null;
    this.#req.onsuccess = null;
  }

  constructor(req: IDBRequest<T>) {
    this.#req = req;
  }

  get source(): S {
    return this.#req.source as S;
  }

  get readyState(): IDBRequestReadyState {
    return this.#req.readyState;
  }

  get result(): T {
    return this.#req.result;
  }

  get transaction(): IDBTransaction | null {
    return this.#req.transaction;
  }

  get error(): DOMException | null {
    return this.#req.error;
  }

  get done(): Promise<T> {
    return new Promise((resolve, reject) => {
      this.#req.onsuccess = () => {
        resolve(this.result);
        this.#unlisten();
      };
      this.#req.onerror = () => {
        reject(this.error);
        this.#unlisten;
      };
    });
  }
}

class EDBIndex {
  #index: IDBIndex;

  constructor(index: IDBIndex) {
    this.#index = index;
  }

  count(query?: IDBQuery): Promise<number> {
    return new EDBRequest(this.#index.count(query)).done;
  }

  get<T>(query: IDBQuery): Promise<T | undefined> {
    return new EDBRequest(this.#index.get(query)).done;
  }

  getAll<T>(query?: IDBQuery | null, count?: number): Promise<T[]> {
    return new EDBRequest(this.#index.getAll(query, count)).done;
  }

  getAllKeys(query?: IDBQuery | null, count?: number): Promise<IDBValidKey[]> {
    return new EDBRequest(this.#index.getAllKeys(query, count)).done;
  }

  getKey(query: IDBQuery): Promise<IDBValidKey | undefined> {
    return new EDBRequest(this.#index.getKey(query)).done;
  }
}

export class EDBObjectStore<I extends string | null> {
  #store: IDBObjectStore;

  constructor({ store }: { store: IDBObjectStore }) {
    this.#store = store;
  }

  createIndex(
    name: NonNullable<I>,
    keyPath: string | Iterable<string>,
    options?: IDBIndexParameters
  ): EDBIndex {
    return new EDBIndex(this.#store.createIndex(name, keyPath, options));
  }

  index(name: NonNullable<I>) {
    return new EDBIndex(this.#store.index(name));
  }
}

class EDB<C extends Record<string, { value: unknown }>> {
  #db: IDBDatabase;

  constructor({ db }: { db: IDBDatabase }) {
    this.#db = db;
  }

  transaction<N extends Extract<keyof C, string>>(name: N[], mode?: IDBTransactionMode) {
    return this.#db.transaction(name, mode);
  }

  createObjectStore<N extends Extract<keyof C, string>>(
    name: N,
    options?: IDBObjectStoreParameters
  ): EDBObjectStore<C[N] extends { index: string } ? C[N]['index'] : null> {
    const store = this.#db.createObjectStore(name, options);

    return new EDBObjectStore({ store });
  }
}

export async function openDB<C extends Record<string, { value: unknown }>>({
  name,
  onUpgrade,
  version,
  onSuccess,
  onError,
  onBlocked,
  onBlocking,
  onClose,
}: {
  name: string;
  onUpgrade: (payload: { event: IDBVersionChangeEvent; db: EDB<C> }) => void;
  version?: number;
  onSuccess?: (payload: { event: Event; db: EDB<C> }) => void;
  onError?: (payload: { event: Event; request: IDBOpenDBRequest }) => void;
  onBlocked?: (payload: { event: IDBVersionChangeEvent; request: IDBOpenDBRequest }) => void;
  onBlocking?: (payload: { event: IDBVersionChangeEvent; db: EDB<C> }) => void;
  onClose?: (payload: { event: Event; db: EDB<C> }) => void;
}): Promise<EDB<C>> {
  const openRequest = indexedDB.open(name, version);

  openRequest.addEventListener('upgradeneeded', event => {
    const db = new EDB<C>({ db: openRequest.result });
    onUpgrade({ event, db });
  });

  if (onBlocked) {
    openRequest.addEventListener('blocked', event => {
      onBlocked?.({ event, request: openRequest });
    });
  }

  return new Promise((resolve, reject) => {
    openRequest.addEventListener('success', event => {
      const db = new EDB<C>({ db: openRequest.result });
      onSuccess?.({ event, db });
      if (onBlocking) {
        openRequest.result.addEventListener('versionchange', event => {
          onBlocking({ event, db });
        });
      }

      if (onClose) {
        openRequest.result.addEventListener('close', event => {
          onClose({ event, db });
        });
      }

      resolve(db);
    });

    openRequest.addEventListener('error', event => {
      onError?.({ event, request: openRequest });
      reject(event);
    });
  });
}

const db = await openDB<{
  song: {
    index: 'name' | 'lang';
    value: {
      name: string;
      lang: string;
    };
  };
  foo: { value: number };
}>({
  name: 'test-db',
  onUpgrade({ event, db }) {
    switch (event.oldVersion) {
      case 0: {
        const songStore = db.createObjectStore('song', { autoIncrement: true });
        songStore.createIndex('name', 'name');
      }
      // falls through
    }
  },
});
