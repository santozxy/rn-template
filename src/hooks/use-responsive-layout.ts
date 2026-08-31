import { useWindowDimensions } from "react-native";
import {
  getResponsiveBreakpoint,
  responsiveTokens,
  type ResponsiveBreakpoint,
} from "@/theme/responsive";

export const responsiveBreakpoints = responsiveTokens.breakpoints;

export interface ResponsiveColumns {
  compact?: number;
  medium: number;
  expanded?: number;
}

export function useResponsiveLayout() {
  const { width, height, fontScale, scale } = useWindowDimensions();
  const breakpoint = getResponsiveBreakpoint(width);
  const isMedium = breakpoint !== "compact";
  const isExpanded = breakpoint === "expanded";

  return {
    width,
    height,
    fontScale,
    scale,
    breakpoint,
    isCompact: !isMedium,
    isMedium,
    isExpanded,
    horizontalPadding: responsiveTokens.gutter[breakpoint],
    contentMaxWidth: responsiveTokens.maxWidth.content,
    formMaxWidth: responsiveTokens.maxWidth.form,
  };
}

export function resolveResponsiveColumns(
  columns: ResponsiveColumns | undefined,
  width: number,
) {
  if (!columns) return 1;
  const breakpoint: ResponsiveBreakpoint = getResponsiveBreakpoint(width);
  if (breakpoint === "expanded") {
    return columns.expanded ?? columns.medium;
  }
  if (breakpoint === "medium") return columns.medium;
  return columns.compact ?? 1;
}
