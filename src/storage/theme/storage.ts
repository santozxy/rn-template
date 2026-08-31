import type { ThemePreference } from "@/theme/colors";
import { storage } from "../config";

const Theme = "@Theme";

interface ThemeData {
  theme: ThemePreference;
}

async function set(ac: ThemeData): Promise<void> {
  await storage.setItem(Theme, ac);
}
async function get(): Promise<ThemeData | null> {
  const ac = await storage.getItem<ThemeData>(Theme);
  return ac;
}
async function remove(): Promise<void> {
  await storage.removeItem(Theme);
}

export const themeStorage = { set, get, remove };
