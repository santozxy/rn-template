import { useTheme } from "@/hooks/use-theme";
import React, { useEffect, useRef } from "react";
import { Animated, ViewStyle } from "react-native";

interface SkeletonProps {
  width?: ViewStyle["width"];
  height: ViewStyle["height"];
  style?: ViewStyle;
  borderRadius?: number;
}

export function Skeleton({
  width = "100%",
  height,
  style,
  borderRadius = 6,
}: SkeletonProps) {
  const { colors } = useTheme();
  const opacity = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 0.3,
          duration: 800,
          useNativeDriver: true,
        }),
      ]),
    );
    loop.start();

    return () => loop.stop();
  }, [opacity]);

  return (
    <Animated.View
      style={[
        {
          width,
          height,
          borderRadius,
          backgroundColor: colors.borderInput,
          opacity,
        },
        style,
      ]}
    />
  );
}
