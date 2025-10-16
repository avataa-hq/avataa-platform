import { useCallback } from 'react';

interface StoredFile {
  name: string;
  content: ArrayBuffer;
}

// Function for IndexedDB opening and getting link to database
const openDatabase = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('fileStorage', 1);

    request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
      const db = (event.target as IDBOpenDBRequest).result;
      db.createObjectStore('files', { keyPath: 'name' });
    };

    request.onsuccess = (event: Event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      resolve(db);
    };

    request.onerror = () => {
      reject(new Error('Database failed to open.'));
    };
  });
};

export const useIndexedDbFileStorage = () => {
  // Saving file in IndexedDB
  const saveFile = useCallback(async (file: File, fileName: string): Promise<void> => {
    const fileContent = await file.arrayBuffer();
    const db = await openDatabase();

    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['files'], 'readwrite');
      const store = transaction.objectStore('files');

      store.put({ name: fileName, content: fileContent });

      transaction.oncomplete = () => {
        resolve();
      };

      transaction.onerror = () => {
        console.error('Transaction failed.');
        reject(new Error('Transaction failed.'));
      };
    });
  }, []);

  // Getting file from IndexedDB
  const getFile = useCallback(async (fileName: string): Promise<StoredFile | null> => {
    const db = await openDatabase();

    return new Promise((resolve, reject) => {
      const transaction = db.transaction(['files'], 'readonly');
      const store = transaction.objectStore('files');
      const getRequest = store.get(fileName);

      getRequest.onsuccess = (event: Event) => {
        const file = (event.target as IDBRequest).result;
        resolve(file);
      };

      getRequest.onerror = () => {
        reject(new Error('Failed to retrieve file.'));
      };
    });
  }, []);

  return { saveFile, getFile };
};
