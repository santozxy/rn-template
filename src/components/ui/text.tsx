import { StyleSheet, Text as NativeText, type TextProps } from "react-native";

const semanticColorClasses = new Set([
  "background",
  "surface",
  "surface-muted",
  "secondary",
  "foreground",
  "primary",
  "primary-light",
  "border",
  "border-input",
  "description",
  "placeholder",
  "label",
  "input",
  "input-disabled",
  "destructive",
  "disabled",
  "success",
  "warning",
  "warning-orange",
  "info",
  "error",
]);

const tailwindColorPattern =
  /^(?:black|white|transparent|current|inherit|(?:slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-\d{2,3}|\[.+\])(?:\/\d+)?$/;

function hasColorClass(className?: string) {
  return className?.split(/\s+/).some((classToken) => {
    const token = classToken.split(":").at(-1);
    const match = token?.match(/^(?:text|color)-(.+)$/);

    if (!match) return false;

    const color = match[1];
    const semanticColor = color.split("/")[0];

    return (
      semanticColorClasses.has(semanticColor) ||
      tailwindColorPattern.test(color)
    );
  });
}

export function Text({ className, style, ...props }: TextProps) {
  const hasStyleColor = StyleSheet.flatten(style)?.color !== undefined;
  const colorClass =
    hasColorClass(className) || hasStyleColor ? "" : "text-foreground";
  const weightClass = className?.includes("font-") ? "" : "font-medium";

  return (
    <NativeText
      {...props}
      style={style}
      className={`${colorClass} ${weightClass} ${className ?? ""}`.trim()}
    />
  );
}
