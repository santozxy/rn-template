import { resolveAdaptiveColumns, responsiveTokens } from "@/theme/responsive";
import { useCallback, useMemo, useState } from "react";
import { useWindowDimensions, type LayoutChangeEvent } from "react-native";

export type AdaptiveColumnsOptions = {
  minItemWidth: number;
  maxColumns?: number;
  gap?: number;
  scaleWithFont?: boolean;
};

export function useAdaptiveColumns(options?: AdaptiveColumnsOptions) {
  const { fontScale } = useWindowDimensions();
  const [containerWidth, setContainerWidth] = useState(0);
  const minItemWidth = options?.minItemWidth ?? 0;
  const maxColumns = options?.maxColumns ?? 1;
  const gap = options?.gap ?? responsiveTokens.grid.gap;
  const columnFontScale =
    options?.scaleWithFont === false
      ? 1
      : Math.max(1, Math.min(fontScale, responsiveTokens.grid.maxFontScale));
  const columns = useMemo(
    () =>
      options
        ? resolveAdaptiveColumns({
            containerWidth,
            minItemWidth,
            maxColumns,
            gap,
            fontScale: columnFontScale,
          })
        : 1,
    [columnFontScale, containerWidth, gap, maxColumns, minItemWidth, options],
  );

  const onLayout = useCallback((event: LayoutChangeEvent) => {
    const nextWidth = Math.round(event.nativeEvent.layout.width);
    setContainerWidth((currentWidth) =>
      currentWidth === nextWidth ? currentWidth : nextWidth,
    );
  }, []);

  return { columns, containerWidth, onLayout };
}
