import palettes from "./colors.json";

export const colorsTheme = palettes;

export type Theme = keyof typeof colorsTheme;
export type ThemePreference = Theme | "system";
export type ColorsTheme = (typeof colorsTheme)[Theme];
