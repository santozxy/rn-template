import {
  useAdaptiveColumns,
  type AdaptiveColumnsOptions,
} from "@/hooks/use-adaptive-columns";

const DEFAULT_GAP = 16;

export type ListLayout = AdaptiveColumnsOptions;

export function useListLayout({
  horizontal,
  layout,
}: {
  horizontal: boolean;
  layout?: ListLayout;
}) {
  const adaptive = useAdaptiveColumns(layout);
  const columns = horizontal ? 1 : adaptive.columns;
  const gap = layout?.gap ?? DEFAULT_GAP;
  const itemWidth =
    columns > 1 && adaptive.containerWidth > 0
      ? (adaptive.containerWidth - gap * (columns - 1)) / columns
      : undefined;

  return {
    columns,
    gap,
    itemWidth,
    onLayout: adaptive.onLayout,
  };
}
