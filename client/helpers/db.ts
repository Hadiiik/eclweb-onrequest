import { openDB } from 'idb';

const DB_NAME = 'fileRatingsDB';
const DB_VERSION = 1;
const STORE_NAME = 'ratings';

export const initDB = async () => {
  return openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, {
          keyPath: ['fileId', 'ip'], // المفتاح الأساسي مركب من fileId و ip
        });
        store.createIndex('byFile', 'fileId');
      }
    },
  });
};

export const saveRating = async (fileId: string, ip: string, rating: number) => {
  const db = await initDB();
  await db.put(STORE_NAME, { fileId, ip, rating });
};

export const getRating = async (fileId: string, ip: string) => {
  const db = await initDB();
  return db.get(STORE_NAME, [fileId, ip]);
};
