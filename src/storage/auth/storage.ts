import type { Auth } from "@/domains/auth/types";
import * as SecureStore from "expo-secure-store";

const AUTH_KEY = "template.auth";
const options: SecureStore.SecureStoreOptions = {
  keychainAccessible: SecureStore.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
};

async function set(auth: Auth) {
  await SecureStore.setItemAsync(AUTH_KEY, JSON.stringify(auth), options);
}

async function get(): Promise<Auth | null> {
  const value = await SecureStore.getItemAsync(AUTH_KEY, options);
  if (!value) return null;

  try {
    return JSON.parse(value) as Auth;
  } catch {
    await remove();
    return null;
  }
}

async function remove() {
  await SecureStore.deleteItemAsync(AUTH_KEY, options);
}

export const authStorage = { get, remove, set };
