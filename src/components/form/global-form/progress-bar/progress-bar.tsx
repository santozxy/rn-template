import React, { useEffect } from "react";
import { View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { StepCircle } from "./step-circle";

interface ProgressBarProps {
  totalSteps: number;
  currentStep: number;
  steps: string[];
}

export function ProgressBar({
  totalSteps,
  currentStep,
  steps,
}: ProgressBarProps) {
  const progress = useSharedValue(0);

  useEffect(() => {
    const step = currentStep + 1 / 3;
    const widthPerStep = (step / (totalSteps - 1)) * 100;
    const widthProgress = Math.min(widthPerStep, 100);
    progress.value = withTiming(widthProgress, { duration: 500 });
  }, [currentStep, totalSteps, progress]);

  const progressStyle = useAnimatedStyle(() => ({
    width: `${progress.value}%`,
  }));

  return (
    <View className="relative mb-4">
      <View className="absolute top-3 h-2 w-full rounded-md bg-description" />
      <Animated.View
        className="absolute top-3 h-2 rounded-full bg-primary"
        style={progressStyle}
      />
      <View
        className={`flex-row ${
          steps.length > 2 ? "justify-between" : "justify-around"
        }`}
      >
        {steps.map((step, index) => (
          <StepCircle
            key={step}
            step={step}
            index={index}
            currentStep={currentStep}
          />
        ))}
      </View>
    </View>
  );
}
