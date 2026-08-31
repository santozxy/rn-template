import * as Crypto from "expo-crypto";
import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";
import { createMMKV, type MMKV } from "react-native-mmkv";

const ENCRYPTION_KEY_LENGTH = 32;
const ENCRYPTION_KEY_ALPHABET =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_";
const SECURE_STORE_KEY_PATTERN = /^[A-Za-z0-9._-]+$/;

interface EncryptedStorageConfig {
  storageId: string;
  secureStoreKey: string;
}

export interface StringStorage {
  getItem: (key: string) => string | null;
  setItem: (key: string, value: string) => void;
  removeItem: (key: string) => void;
}

function assertValidSecureStoreKey(key: string) {
  if (!key || !SECURE_STORE_KEY_PATTERN.test(key)) {
    throw new Error(
      "A chave do SecureStore deve conter apenas letras, números, '.', '-' ou '_'.",
    );
  }
}

function isValidEncryptionKey(key: string) {
  return (
    key.length === ENCRYPTION_KEY_LENGTH &&
    [...key].every((character) => ENCRYPTION_KEY_ALPHABET.includes(character))
  );
}

async function createEncryptionKey() {
  const bytes = await Crypto.getRandomBytesAsync(ENCRYPTION_KEY_LENGTH);

  return Array.from(bytes, (byte) => ENCRYPTION_KEY_ALPHABET[byte & 63]).join(
    "",
  );
}

export function createEncryptedStorage({
  storageId,
  secureStoreKey,
}: EncryptedStorageConfig) {
  assertValidSecureStoreKey(secureStoreKey);

  let nativeStorage: MMKV | null = null;
  let initializationPromise: Promise<boolean> | null = null;
  const memoryStorage = new Map<string, string>();

  async function getEncryptionKey() {
    const storedKey = await SecureStore.getItemAsync(secureStoreKey);

    if (storedKey && isValidEncryptionKey(storedKey)) {
      return storedKey;
    }

    const encryptionKey = await createEncryptionKey();
    await SecureStore.setItemAsync(secureStoreKey, encryptionKey);

    return encryptionKey;
  }

  async function initializeNativeStorage() {
    if (Platform.OS === "web") {
      return false;
    }

    const encryptionKey = await getEncryptionKey();

    nativeStorage = createMMKV({
      id: storageId,
      encryptionKey,
      encryptionType: "AES-256",
    });
    return true;
  }

  async function initialize() {
    if (nativeStorage) {
      return true;
    }

    initializationPromise ??= initializeNativeStorage().catch((error) => {
      initializationPromise = null;
      throw error;
    });

    return initializationPromise;
  }

  const storage: StringStorage = {
    getItem(key) {
      return nativeStorage?.getString(key) ?? memoryStorage.get(key) ?? null;
    },

    setItem(key, value) {
      if (nativeStorage) {
        nativeStorage.set(key, value);
        return;
      }

      memoryStorage.set(key, value);
    },

    removeItem(key) {
      nativeStorage?.remove(key);
      memoryStorage.delete(key);
    },
  };

  return {
    initialize,
    isPersistent: () => nativeStorage !== null,
    storage,
  };
}
