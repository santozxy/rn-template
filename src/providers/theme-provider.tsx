import {
  colorsTheme,
  type ColorsTheme,
  type Theme,
  type ThemePreference,
} from "@/theme/colors";
import { themeStorage } from "@/storage/theme/storage";
import { Transition } from "@/theme/transition";
import { themeVariables } from "@/theme/variables";
import { logger } from "logger";
import { useColorScheme } from "nativewind";
import React, {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useColorScheme as useSystemColorScheme, View } from "react-native";

export interface ThemeContextData {
  theme: Theme;
  preference: ThemePreference;
  colors: ColorsTheme;
  setThemePreference: (preference: ThemePreference) => void;
  toggleTheme: () => void;
  transitioning: boolean;
}

export const ThemeContext = createContext<ThemeContextData | undefined>(
  undefined,
);

export function ThemeProvider({ children }: React.PropsWithChildren) {
  const { setColorScheme } = useColorScheme();
  const systemColorScheme = useSystemColorScheme();
  const [preference, setPreference] = useState<ThemePreference>("system");
  const [transitioning, setTransitioning] = useState(false);
  const transitionTimer = useRef<ReturnType<typeof setTimeout>>(undefined);
  const systemTheme: Theme = systemColorScheme === "dark" ? "dark" : "light";
  const theme: Theme = preference === "system" ? systemTheme : preference;

  useEffect(() => {
    let cancelled = false;

    themeStorage
      .get()
      .then((savedTheme) => {
        const savedPreference = savedTheme?.theme;
        if (
          cancelled ||
          (savedPreference !== "system" &&
            savedPreference !== "light" &&
            savedPreference !== "dark")
        ) {
          return;
        }

        setPreference(savedPreference);
        setColorScheme(savedPreference);
      })
      .catch((error) =>
        logger.warn("Não foi possível restaurar o tema", error),
      );

    return () => {
      cancelled = true;
      if (transitionTimer.current) clearTimeout(transitionTimer.current);
    };
  }, [setColorScheme]);

  const setThemePreference = useCallback(
    (nextPreference: ThemePreference) => {
      const nextTheme =
        nextPreference === "system" ? systemTheme : nextPreference;
      if (transitionTimer.current) clearTimeout(transitionTimer.current);
      setTransitioning(nextTheme !== theme);
      setPreference(nextPreference);
      setColorScheme(nextPreference);
      themeStorage
        .set({ theme: nextPreference })
        .catch((error) => logger.warn("Não foi possível salvar o tema", error))
        .finally(() => {
          transitionTimer.current = setTimeout(
            () => setTransitioning(false),
            900,
          );
        });
    },
    [setColorScheme, systemTheme, theme],
  );

  const toggleTheme = useCallback(() => {
    setThemePreference(theme === "dark" ? "light" : "dark");
  }, [setThemePreference, theme]);

  const value = useMemo(
    () => ({
      colors: colorsTheme[theme],
      preference,
      setThemePreference,
      theme,
      toggleTheme,
      transitioning,
    }),
    [preference, setThemePreference, theme, toggleTheme, transitioning],
  );

  return (
    <ThemeContext.Provider value={value}>
      <View className="flex-1" style={themeVariables[theme]}>
        {children}
        {transitioning ? (
          <Transition colors={value.colors} theme={theme} />
        ) : null}
      </View>
    </ThemeContext.Provider>
  );
}
