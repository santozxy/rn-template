import { createMMKV } from "react-native-mmkv";

import {
  createMMKVStorage,
  createMMKVStringStorage,
  type Storage,
  type StringStorage,
} from "@/storage/config";
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

export interface UserStorage extends Storage {
  scope: Readonly<NormalizedUserStorageScope>;
  scopeKey: string;
  stringStorage: StringStorage;
}

const storageRegistry = new Map<string, UserStorage>();

function createUserStorage(scope: UserStorageScope): UserStorage {
  const normalizedScope = normalizeUserStorageScope(scope);
  const scopeKey = getUserStorageScopeKey(normalizedScope);
  const instance = createMMKV({
    id: `${USER_STORAGE_ID_PREFIX}:${scopeKey}`,
  });
  return {
    ...createMMKVStorage(instance),
    scope: normalizedScope,
    scopeKey,
    stringStorage: createMMKVStringStorage(instance),
  };
}

export function getUserStorage(scope: UserStorageScope) {
  const scopeKey = getUserStorageScopeKey(scope);
  const existingStorage = storageRegistry.get(scopeKey);

  if (existingStorage) return existingStorage;

  const storage = createUserStorage(scope);
  storageRegistry.set(scopeKey, storage);
  return storage;
}
