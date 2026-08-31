import { vars } from "nativewind";
import { colorsTheme, type ColorsTheme, type Theme } from "./colors";

function toKebabCase(value: string) {
  return value.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);
}

function toRgbChannels(hex: string) {
  const normalized = hex.replace("#", "");
  const value = Number.parseInt(normalized, 16);

  return `${(value >> 16) & 255} ${(value >> 8) & 255} ${value & 255}`;
}

function createThemeVariables(colors: ColorsTheme) {
  return vars(
    Object.fromEntries(
      Object.entries(colors).map(([name, value]) => [
        `--color-${toKebabCase(name)}`,
        toRgbChannels(value),
      ]),
    ),
  );
}

export const themeVariables: Record<Theme, ReturnType<typeof vars>> = {
  light: createThemeVariables(colorsTheme.light),
  dark: createThemeVariables(colorsTheme.dark),
};
