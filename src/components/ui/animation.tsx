// src/components/ui/animation.tsx
import React from "react";
import LottieView, { LottieViewProps } from "lottie-react-native";

export function Animation({
  source,
  autoPlay = true,
  loop = false,
  style = { width: 300, height: 300 },
  onAnimationFinish,
  ...props
}: LottieViewProps) {
  return (
    <LottieView
      source={source}
      autoPlay={autoPlay}
      loop={loop}
      style={style}
      onAnimationFinish={onAnimationFinish}
      {...props}
    />
  );
}
