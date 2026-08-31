import { createEncryptedStorage } from "./create-encrypted-storage";

const queryStorage = createEncryptedStorage({
  storageId: "template-query-cache-v1",
  secureStoreKey: "template.query-cache.encryption-key.v1",
});

export const initializeQueryStorage = queryStorage.initialize;
export const isQueryStoragePersistent = queryStorage.isPersistent;
export const tanstackStorage = queryStorage.storage;
