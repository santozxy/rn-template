import { useTheme } from "@/hooks/use-theme";
import { useEffect } from "react";
import { View } from "react-native";
import Animated, {
  useSharedValue,
  withTiming,
  useAnimatedStyle,
  interpolateColor,
} from "react-native-reanimated";

interface StepCircleProps {
  step: string;
  index: number;
  currentStep: number;
}
export function StepCircle({ step, index, currentStep }: StepCircleProps) {
  const { colors } = useTheme();
  const animatedValue = useSharedValue(0);

  useEffect(() => {
    animatedValue.value = withTiming(index <= currentStep ? 1 : 0, {
      duration: 300,
    });
  }, [currentStep, index, animatedValue]);

  const circleStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      animatedValue.value,
      [0, 1],
      [colors.border, colors.primary],
    ),
    borderColor: interpolateColor(
      animatedValue.value,
      [0, 1],
      [colors.description, colors.primary],
    ),
  }));

  const textStyle = useAnimatedStyle(() => ({
    color: interpolateColor(
      animatedValue.value,
      [0, 1],
      [colors.description, colors.white],
    ),
  }));

  const labelStyle = useAnimatedStyle(() => ({
    color: interpolateColor(
      animatedValue.value,
      [0, 1],
      [colors.description, colors.primary],
    ),
  }));

  return (
    <View className="relative mb-6 items-center" style={{ flex: 1 }}>
      <Animated.View
        className="h-8 w-8 items-center justify-center rounded-full border-2"
        style={circleStyle}
      >
        <Animated.Text className="font-bold text-label" style={textStyle}>
          {index + 1}
        </Animated.Text>
      </Animated.View>
      {currentStep === index && (
        <Animated.Text
          className="absolute left-1/2 top-full mt-1 w-24 -translate-x-1/2 text-center font-semibold text-sm"
          style={labelStyle}
        >
          {step}
        </Animated.Text>
      )}
    </View>
  );
}
