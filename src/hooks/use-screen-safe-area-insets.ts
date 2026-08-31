import {
  resolveTopInset,
  ScreenSafeAreaContext,
  type ScreenInsets,
} from "@/providers/screen-safe-area-provider";
import { useContext } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export function useScreenSafeAreaInsets(): ScreenInsets {
  const scopedInsets = useContext(ScreenSafeAreaContext);
  const insets = useSafeAreaInsets();

  return (
    scopedInsets ?? {
      ...insets,
      top: resolveTopInset(insets.top),
      topInsetConsumed: false,
    }
  );
}
