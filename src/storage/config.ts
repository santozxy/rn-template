import { createMMKV, type MMKV } from "react-native-mmkv";

export interface Storage {
  getItem: <T = unknown>(key: string) => Promise<T | null>;
  setItem: <T>(key: string, value: T) => Promise<void>;
  removeItem: (key: string) => Promise<boolean>;
  clearAll: () => Promise<void>;
}

export interface StringStorage {
  getItem: (key: string) => string | null;
  setItem: (key: string, value: string) => void;
  removeItem: (key: string) => void;
}

export let storage: Storage;

export function initializeStorage(storageImpl: Storage) {
  storage = storageImpl;
}

export function createMMKVStorage(instance: MMKV): Storage {
  return {
    async getItem<T>(key: string) {
      const value = instance.getString(key);
      if (value === undefined) return null;

      try {
        return JSON.parse(value) as T;
      } catch {
        instance.remove(key);
        return null;
      }
    },

    async setItem<T>(key: string, value: T) {
      const serializedValue = JSON.stringify(value);

      if (serializedValue === undefined) {
        throw new Error(`Não foi possível serializar o valor de "${key}".`);
      }

      instance.set(key, serializedValue);
    },

    async removeItem(key: string) {
      return instance.remove(key);
    },

    async clearAll() {
      instance.clearAll();
    },
  };
}

export function createMMKVStringStorage(instance: MMKV): StringStorage {
  return {
    getItem: (key) => instance.getString(key) ?? null,
    setItem: (key, value) => instance.set(key, value),
    removeItem: (key) => {
      instance.remove(key);
    },
  };
}

// Storage do aparelho: use apenas para preferências que não pertencem a um usuário.
export const deviceStorage = createMMKVStorage(createMMKV());
