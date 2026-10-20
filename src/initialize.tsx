import { LoadingScreen } from "@/routes/loading";
import {
  PlusJakartaSans_400Regular,
  PlusJakartaSans_500Medium,
  PlusJakartaSans_600SemiBold,
  PlusJakartaSans_700Bold,
  PlusJakartaSans_800ExtraBold,
  useFonts,
} from "@expo-google-fonts/plus-jakarta-sans";
import type { PropsWithChildren } from "react";
import { useCallback, useEffect, useState } from "react";
import { ThemeProvider } from "./providers/theme-provider";

const LOADING_ANIMATION_TIMEOUT_MS = 4000;

export function Initialize({ children }: PropsWithChildren) {
  const [animationFinished, setAnimationFinished] = useState(false);
  const [animationTimedOut, setAnimationTimedOut] = useState(false);
  const [fontsLoaded, fontError] = useFonts({
    PlusJakartaSans_400Regular,
    PlusJakartaSans_500Medium,
    PlusJakartaSans_600SemiBold,
    PlusJakartaSans_700Bold,
    PlusJakartaSans_800ExtraBold,
  });

  useEffect(() => {
    const timeout = setTimeout(
      () => setAnimationTimedOut(true),
      LOADING_ANIMATION_TIMEOUT_MS,
    );

    return () => clearTimeout(timeout);
  }, []);

  const handleAnimationFinish = useCallback((isCancelled: boolean) => {
    if (!isCancelled) {
      setAnimationFinished(true);
    }
  }, []);

  const fontsReady = fontsLoaded || !!fontError;
  const animationReady = animationFinished || animationTimedOut;

  if (!fontsReady || !animationReady) {
    return (
      <ThemeProvider>
        <LoadingScreen onAnimationFinish={handleAnimationFinish} />
      </ThemeProvider>
    );
  }

  return children;
}
