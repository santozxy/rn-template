import { createMMKV } from "react-native-mmkv";
export interface Storage {
  getItem: <T = unknown>(key: string) => Promise<T | null>;
  setItem: <T>(key: string, value: T) => Promise<void>;
  removeItem: (key: string) => Promise<boolean>;
  clearAll: () => Promise<void>;
}

export let storage: Storage;

export function initializeStorage(storageImpl: Storage) {
  storage = storageImpl;
}
const MMKVInstance = createMMKV();

export const MMKVStorage: Storage = {
  getItem: (key) => {
    const item = MMKVInstance.getString(key);
    if (item) {
      return JSON.parse(item);
    }
    return null;
  },
  setItem: async (key, value) => {
    MMKVInstance.set(key, JSON.stringify(value));
  },
  removeItem: async (key) => MMKVInstance.remove(key),
  clearAll: async () => MMKVInstance.clearAll(),
};
