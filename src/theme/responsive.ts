export const responsiveTokens = {
  breakpoints: {
    compact: 0,
    medium: 600,
    expanded: 1024,
  },
  gutter: {
    compact: 16,
    medium: 24,
    expanded: 32,
  },
  maxWidth: {
    content: 1200,
    form: 720,
  },
  grid: {
    gap: 16,
    minItemWidth: 320,
    maxColumns: 3,
    maxFontScale: 1.2,
  },
} as const;

export type ResponsiveBreakpoint = keyof typeof responsiveTokens.breakpoints;

export function getResponsiveBreakpoint(width: number): ResponsiveBreakpoint {
  if (width >= responsiveTokens.breakpoints.expanded) return "expanded";
  if (width >= responsiveTokens.breakpoints.medium) return "medium";
  return "compact";
}

export function resolveAdaptiveColumns({
  containerWidth,
  minItemWidth,
  maxColumns,
  gap,
  fontScale,
}: {
  containerWidth: number;
  minItemWidth: number;
  maxColumns: number;
  gap: number;
  fontScale: number;
}) {
  if (containerWidth <= 0) return 1;

  const safeGap = Math.max(0, gap);
  const safeMaxColumns = Math.max(1, Math.floor(maxColumns));
  const accessibleItemWidth = Math.max(1, minItemWidth) * fontScale;

  return Math.max(
    1,
    Math.min(
      safeMaxColumns,
      Math.floor((containerWidth + safeGap) / (accessibleItemWidth + safeGap)),
    ),
  );
}
