/**
 * JUBA Editor Pro - High Performance Storage Layer (v6.0)
 * Hybrid Storage: IndexedDB (Primordial) -> LocalStorage (Fallback)
 */

const DB_NAME = 'JUBA_EDITOR_DB';
const STORE_NAME = 'projects';
const DB_VERSION = 1;

export interface ProjectFile {
  id: string;
  name: string;
  content: string;
  language: 'html' | 'css' | 'javascript';
}

export interface ProjectData {
  id: string;
  files: ProjectFile[];
  activeFileId: string;
  updatedAt: number;
}

export const initDB = (): Promise<IDBDatabase> => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };
  });
};

export const saveProject = async (data: ProjectData) => {
  try {
    const db = await initDB();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    store.put(data);
    
    // Also sync to LocalStorage as double-safety
    localStorage.setItem(`juba_backup_${data.id}`, JSON.stringify(data));
  } catch (err) {
    console.error('IndexedDB Save Failed, using LocalStorage fallback:', err);
    localStorage.setItem(`juba_backup_${data.id}`, JSON.stringify(data));
  }
};

export const loadProject = async (id: string): Promise<ProjectData | null> => {
  const migrate = (data: any): ProjectData => {
    if (data && !data.files) {
      return {
        id: data.id || id,
        files: [
          { id: '1', name: 'index.html', language: 'html', content: data.html || '' },
          { id: '2', name: 'styles.css', language: 'css', content: data.css || '' },
          { id: '3', name: 'main.js', language: 'javascript', content: data.js || '' },
        ],
        activeFileId: '1',
        updatedAt: data.updatedAt || Date.now()
      };
    }
    return data;
  };

  try {
    const db = await initDB();
    return new Promise((resolve) => {
      const tx = db.transaction(STORE_NAME, 'readonly');
      const store = tx.objectStore(STORE_NAME);
      const request = store.get(id);
      request.onsuccess = () => {
        if (request.result) resolve(migrate(request.result));
        else {
          const fallback = localStorage.getItem(`juba_backup_${id}`);
          resolve(fallback ? migrate(JSON.parse(fallback)) : null);
        }
      };
      request.onerror = () => {
        const fallback = localStorage.getItem(`juba_backup_${id}`);
        resolve(fallback ? migrate(JSON.parse(fallback)) : null);
      };
    });
  } catch (err) {
    const fallback = localStorage.getItem(`juba_backup_${id}`);
    return fallback ? migrate(JSON.parse(fallback)) : null;
  }
};
