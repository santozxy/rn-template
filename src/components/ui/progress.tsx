import { useTheme } from "@/hooks/use-theme";
import React, { useEffect, useRef } from "react";
import { Animated } from "react-native";
import { View } from "@/components/ui/view";

interface ProgressProps {
  /** Valor atual do progresso (0 a 1) */
  progress: number;
  /** Largura da barra (ex: 200 ou '100%') */
  width?: number | string;
  /** Altura da barra */
  height?: number;
  /** Cor da barra preenchida */
  borderRadius?: number;
  /** Duração da animação (ms) */
  duration?: number;
  /** Estilo adicional */
}

export function Progress({
  progress,
  width = "100%",
  height = 10,
  borderRadius = 8,
  duration = 300,
}: ProgressProps) {
  const { colors } = useTheme();
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animatedValue, {
      toValue: progress,
      duration,
      useNativeDriver: false,
    }).start();
  }, [animatedValue, duration, progress]);

  const progressWidth = animatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: ["0%", "100%"],
  });

  return (
    <View
      style={[
        {
          width: width as any,
          height,
          backgroundColor: colors.border,
          borderRadius,
          overflow: "hidden",
        },
      ]}
    >
      <Animated.View
        style={{
          width: progressWidth,
          height: "100%",
          backgroundColor: colors.primary,
        }}
      />
    </View>
  );
}
