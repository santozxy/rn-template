import { useTheme } from "@/hooks/use-theme";
import React from "react";
import { Pressable, type ViewStyle } from "react-native";
import Animated, {
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";

interface SwitchProps {
  value: boolean;
  onValueChange: (value: boolean) => void;
  disabled?: boolean;
  activeColor?: string;
  inactiveColor?: string;
  thumbColor?: string;
  style?: ViewStyle;
  icon?: React.ReactNode;
}

export function Switch({
  value,
  onValueChange,
  disabled = false,
  activeColor,
  inactiveColor,
  thumbColor,
  style,
  icon,
}: SwitchProps) {
  const { colors } = useTheme();
  const resolvedActiveColor = activeColor ?? colors.success;
  const resolvedInactiveColor = inactiveColor ?? colors.inputDisabled;
  const resolvedThumbColor = thumbColor ?? colors.surface;
  const toggleSwitch = () => {
    if (!disabled) {
      onValueChange(!value);
    }
  };

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: withSpring(value ? 18 : 2, {
            mass: 1,
            damping: 15,
            stiffness: 120,
          }),
        },
      ],
    };
  });

  return (
    <Pressable
      onPress={toggleSwitch}
      className="justify-center border border-border"
      style={[
        {
          height: 30,
          width: 48,
          borderRadius: 16,
          backgroundColor: value ? resolvedActiveColor : resolvedInactiveColor,
          opacity: disabled ? 0.5 : 1,
        },
        style,
      ]}
      accessibilityRole="switch"
      accessibilityState={{ checked: value, disabled }}
    >
      <Animated.View
        className="flex-row items-center justify-center rounded-2xl border border-border"
        style={[
          animatedStyle,
          {
            backgroundColor: resolvedThumbColor,
            width: 24,
            height: 24,
            borderRadius: 50,
            justifyContent: "center",
            alignItems: "center",
          },
        ]}
      >
        {icon}
      </Animated.View>
    </Pressable>
  );
}
