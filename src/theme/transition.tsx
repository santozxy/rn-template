import { colorsTheme, type ColorsTheme, type Theme } from "@/theme/colors";
import { Moon } from "lucide-react-native";
import { useEffect } from "react";
import { useWindowDimensions } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withTiming,
} from "react-native-reanimated";

interface TransitionProps {
  theme: Theme;
  colors: ColorsTheme;
}
export const THEME_TRANSITION_DURATION_MS = 1400;
export function Transition({ theme, colors }: TransitionProps) {
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();
  const oldColors = colorsTheme[theme === "dark" ? "light" : "dark"];
  const newColors = colors;

  const centerToCorner = Math.sqrt(
    (screenWidth / 2) ** 2 + (screenHeight / 2) ** 2,
  );
  const diameter = 2 * centerToCorner * 1.1;
  const radius = diameter / 2;

  const waveProgress = useSharedValue(0);
  const scale = useSharedValue(1);
  const opacity = useSharedValue(0);
  const iconScale = useSharedValue(0);
  const rotate = useSharedValue(0);

  useEffect(() => {
    waveProgress.value = 0;
    scale.value = 1.05;
    opacity.value = 0;
    iconScale.value = 0;
    rotate.value = 0;

    waveProgress.value = withTiming(1, {
      duration: 800,
      easing: Easing.bezier(0.4, 0, 0.2, 1),
    });

    opacity.value = withSequence(
      withTiming(1, { duration: 350, easing: Easing.out(Easing.cubic) }),
      withDelay(
        650,
        withTiming(0, { duration: 250, easing: Easing.in(Easing.cubic) }),
      ),
    );

    scale.value = withSequence(
      withTiming(1.03, { duration: 500, easing: Easing.out(Easing.cubic) }),
      withTiming(1, { duration: 550, easing: Easing.inOut(Easing.cubic) }),
    );

    iconScale.value = withSequence(
      withDelay(
        300,
        withTiming(1, { duration: 550, easing: Easing.out(Easing.elastic(1)) }),
      ),
      withDelay(
        300,
        withTiming(0, { duration: 250, easing: Easing.in(Easing.cubic) }),
      ),
    );

    rotate.value = withSequence(
      withDelay(
        250,
        withTiming(180, { duration: 500, easing: Easing.out(Easing.cubic) }),
      ),
      withTiming(360, { duration: 450, easing: Easing.in(Easing.cubic) }),
    );
  }, [iconScale, opacity, rotate, scale, theme, waveProgress]);

  const containerStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
    backgroundColor: oldColors.background,
  }));

  const waveStyle = useAnimatedStyle(() => ({
    transform: [{ scale: waveProgress.value }],
  }));

  const iconStyle = useAnimatedStyle(() => ({
    transform: [{ scale: iconScale.value }, { rotate: `${rotate.value}deg` }],
    opacity: iconScale.value,
  }));

  return (
    <Animated.View
      pointerEvents="none"
      className="absolute inset-0 z-50 items-center justify-center"
      style={containerStyle}
    >
      <Animated.View
        style={[
          {
            position: "absolute",
            width: diameter,
            height: diameter,
            borderRadius: radius,
            backgroundColor: newColors.background,
            top: (screenHeight - diameter) / 2,
            left: (screenWidth - diameter) / 2,
          },
          waveStyle,
        ]}
      />
      <Animated.View style={iconStyle}>
        <Moon size={70} color={newColors.foreground} />
      </Animated.View>
    </Animated.View>
  );
}
