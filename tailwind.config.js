/** @type {import('tailwindcss').Config} */
const semanticColor = (name) => `rgb(var(--color-${name}))`;

module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: "class",
  presets: [require("nativewind/preset")],
  corePlugins: {
    backgroundOpacity: true,
  },
  theme: {
    extend: {
      colors: {
        background: semanticColor("background"),
        surface: semanticColor("surface"),
        secondary: semanticColor("secondary"),
        foreground: semanticColor("foreground"),
        primary: semanticColor("primary"),
        "primary-foreground": semanticColor("primary-foreground"),
        "primary-light": semanticColor("primary-light"),
        "surface-muted": semanticColor("surface-muted"),
        border: semanticColor("border"),
        "border-input": semanticColor("border-input"),
        description: semanticColor("description"),
        placeholder: semanticColor("placeholder"),
        label: semanticColor("label"),
        input: semanticColor("input"),
        "input-disabled": semanticColor("input-disabled"),
        destructive: semanticColor("destructive"),
        disabled: semanticColor("disabled"),
        success: semanticColor("success"),
        warning: semanticColor("warning"),
        "warning-orange": semanticColor("warning-orange"),
        info: semanticColor("info"),
        error: semanticColor("error"),
      },
      fontFamily: {
        regular: ["PlusJakartaSans_400Regular"],
        medium: ["PlusJakartaSans_500Medium"],
        semibold: ["PlusJakartaSans_600SemiBold"],
        bold: ["PlusJakartaSans_700Bold"],
        extrabold: ["PlusJakartaSans_800ExtraBold"],
      },
    },
  },
};
