import * as Crypto from "expo-crypto";

import type { Storage } from "@/storage/config";
import {
  createEncryptedStorage,
  type StringStorage,
} from "@/storage/core/create-encrypted-storage";
import {
  getUserStorageScopeKey,
  normalizeUserStorageScope,
  type NormalizedUserStorageScope,
  type UserStorageScope,
} from "@/storage/user/scope";

export { getUserStorageScopeKey } from "@/storage/user/scope";
export type {
  NormalizedUserStorageScope,
  UserStorageScope,
} from "@/storage/user/scope";

const USER_STORAGE_VERSION = "v1";
const USER_STORAGE_ID_PREFIX = `template-user-data-${USER_STORAGE_VERSION}`;
const USER_STORAGE_KEY_PREFIX = `template.user-data.encryption-key.${USER_STORAGE_VERSION}`;

export interface UserStorage extends Storage {
  isPersistent: boolean;
  scope: Readonly<NormalizedUserStorageScope>;
  scopeKey: string;
  stringStorage: StringStorage;
}

const storageRegistry = new Map<string, Promise<UserStorage>>();

async function createUserStorage(
  scope: UserStorageScope,
): Promise<UserStorage> {
  const normalizedScope = normalizeUserStorageScope(scope);
  const scopeKey = getUserStorageScopeKey(normalizedScope);
  const scopeHash = await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    scopeKey,
  );
  const encryptedStorage = createEncryptedStorage({
    storageId: `${USER_STORAGE_ID_PREFIX}-${scopeHash}`,
    secureStoreKey: `${USER_STORAGE_KEY_PREFIX}.${scopeHash}`,
  });

  let isPersistent = false;

  try {
    isPersistent = await encryptedStorage.initialize();
  } catch {
    // Mantém o app funcional em memória quando o storage nativo não inicializa.
  }

  const storage: UserStorage = {
    scope: normalizedScope,
    scopeKey,
    stringStorage: encryptedStorage.storage,
    isPersistent,

    async getItem<T>(key: string) {
      const value = encryptedStorage.storage.getItem(key);
      if (value === null) return null;

      try {
        return JSON.parse(value) as T;
      } catch {
        encryptedStorage.storage.removeItem(key);
        return null;
      }
    },

    async setItem<T>(key: string, value: T) {
      const serializedValue = JSON.stringify(value);

      if (serializedValue === undefined) {
        throw new Error(`Não foi possível serializar o valor de "${key}".`);
      }

      encryptedStorage.storage.setItem(key, serializedValue);
    },

    async removeItem(key: string) {
      const exists = encryptedStorage.storage.getItem(key) !== null;
      encryptedStorage.storage.removeItem(key);
      return exists;
    },

    async clearAll() {
      encryptedStorage.storage.clearAll();
    },
  };

  return storage;
}

export function getUserStorage(scope: UserStorageScope) {
  const scopeKey = getUserStorageScopeKey(scope);
  const existingStorage = storageRegistry.get(scopeKey);

  if (existingStorage) return existingStorage;

  const storage = createUserStorage(scope).catch((error) => {
    storageRegistry.delete(scopeKey);
    throw error;
  });

  storageRegistry.set(scopeKey, storage);
  return storage;
}
