import type { Credentials } from "@/domains/auth/types";
import * as SecureStore from "expo-secure-store";

const CREDENTIALS_KEY = "template.credentials";
const options: SecureStore.SecureStoreOptions = {
  keychainAccessible: SecureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
};

export type StoredCredentials = Credentials & {
  name: string;
  biometricEnabled: boolean;
};

async function set(credentials: StoredCredentials) {
  await SecureStore.setItemAsync(
    CREDENTIALS_KEY,
    JSON.stringify(credentials),
    options,
  );
}

async function get(): Promise<StoredCredentials | null> {
  const value = await SecureStore.getItemAsync(CREDENTIALS_KEY, options);
  if (!value) return null;

  try {
    const credentials = JSON.parse(value) as Partial<StoredCredentials>;
    if (!credentials.email || !credentials.password) {
      await remove();
      return null;
    }

    return {
      email: credentials.email,
      password: credentials.password,
      name: credentials.name ?? credentials.email,
      biometricEnabled: credentials.biometricEnabled ?? false,
    };
  } catch {
    await remove();
    return null;
  }
}

async function remove() {
  await SecureStore.deleteItemAsync(CREDENTIALS_KEY, options);
}

export const credentialsStorage = { get, remove, set };
