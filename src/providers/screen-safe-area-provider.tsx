import React, { createContext, useMemo } from "react";
import { StatusBar as NativeStatusBar } from "react-native";
import {
  useSafeAreaInsets,
  type EdgeInsets,
} from "react-native-safe-area-context";

export interface ScreenInsets extends EdgeInsets {
  topInsetConsumed: boolean;
}

export const ScreenSafeAreaContext = createContext<ScreenInsets | null>(null);

export function resolveTopInset(top: number) {
  if (process.env.EXPO_OS !== "android") return top;
  return Math.max(top, NativeStatusBar.currentHeight ?? 0);
}

export function ScreenSafeAreaProvider({
  children,
  consumeTop = false,
}: {
  children: React.ReactNode;
  consumeTop?: boolean;
}) {
  const insets = useSafeAreaInsets();
  const topInset = resolveTopInset(insets.top);
  const value = useMemo<ScreenInsets>(
    () => ({
      ...insets,
      top: consumeTop ? 0 : topInset,
      topInsetConsumed: consumeTop,
    }),
    [consumeTop, insets, topInset],
  );

  return (
    <ScreenSafeAreaContext.Provider value={value}>
      {children}
    </ScreenSafeAreaContext.Provider>
  );
}
