import { useAdaptiveColumns } from "@/hooks/use-adaptive-columns";
import { responsiveTokens } from "@/theme/responsive";
import React from "react";
import { View, type ViewProps } from "react-native";

export interface ResponsiveGridProps extends Omit<ViewProps, "children"> {
  children: React.ReactNode;
  minItemWidth?: number;
  maxColumns?: number;
  gap?: number;
  scaleWithFont?: boolean;
}

export function ResponsiveGrid({
  children,
  minItemWidth = responsiveTokens.grid.minItemWidth,
  maxColumns = responsiveTokens.grid.maxColumns,
  gap = responsiveTokens.grid.gap,
  scaleWithFont = true,
  style,
  ...props
}: ResponsiveGridProps) {
  const items = React.Children.toArray(children);
  const { columns, containerWidth, onLayout } = useAdaptiveColumns({
    minItemWidth,
    maxColumns,
    gap,
    scaleWithFont,
  });
  const itemWidth =
    containerWidth > 0
      ? (containerWidth - gap * (columns - 1)) / columns
      : "100%";

  return (
    <View
      {...props}
      onLayout={onLayout}
      style={[{ flexDirection: "row", flexWrap: "wrap", gap }, style]}
    >
      {items.map((child, index) => (
        <View
          key={React.isValidElement(child) ? (child.key ?? index) : index}
          style={{ width: itemWidth }}
        >
          {child}
        </View>
      ))}
    </View>
  );
}
