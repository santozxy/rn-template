import { responsiveTokens } from "@/theme/responsive";
import React from "react";
import { useWindowDimensions, View, type ViewProps } from "react-native";

export type ResponsiveContainerSize = "content" | "form";

interface ResponsiveContainerProps extends ViewProps {
  size?: ResponsiveContainerSize;
  padded?: boolean;
}

export function ResponsiveContainer({
  size = "content",
  padded = true,
  style,
  ...props
}: ResponsiveContainerProps) {
  const { width } = useWindowDimensions();
  const gutter =
    width >= responsiveTokens.breakpoints.expanded
      ? responsiveTokens.gutter.expanded
      : width >= responsiveTokens.breakpoints.medium
        ? responsiveTokens.gutter.medium
        : responsiveTokens.gutter.compact;

  return (
    <View
      {...props}
      style={[
        {
          alignSelf: "center",
          maxWidth: responsiveTokens.maxWidth[size],
          paddingHorizontal: padded ? gutter : 0,
          width: "100%",
        },
        style,
      ]}
    />
  );
}
