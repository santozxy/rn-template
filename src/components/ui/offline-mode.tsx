import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import React, { useEffect } from "react";
import { useWindowDimensions, View } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import { useTheme } from "@/hooks/use-theme";
import type { NetworkStatus } from "@/lib/network/offline";

interface OfflineTransitionProps {
  visible: boolean;
}

interface OfflineBannerProps {
  status: Extract<NetworkStatus, "offline" | "unavailable">;
  hasUnavailableData: boolean;
  persistenceAvailable: boolean;
}

export function OfflineBanner({
  status,
  hasUnavailableData,
  persistenceAvailable,
}: OfflineBannerProps) {
  const { colors } = useTheme();
  const message = !persistenceAvailable
    ? "Cache offline não está disponível nesta sessão."
    : status === "unavailable"
      ? "Não foi possível verificar a conexão. Operações online estão bloqueadas."
      : hasUnavailableData
        ? "Modo offline. Algumas informações não foram sincronizadas."
        : "Modo offline. Exibindo informações salvas.";

  return (
    <View
      pointerEvents="none"
      accessibilityRole="alert"
      className="flex-row items-center justify-center gap-2 px-4 py-2"
      style={{ backgroundColor: colors.warningOrange }}
    >
      <Icon name="wifi-off" size={16} color="white" />
      <Text className="text-center font-semibold text-xs text-white">
        {message}
      </Text>
    </View>
  );
}

export function OfflineTransition({ visible }: OfflineTransitionProps) {
  const { colors } = useTheme();
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();

  const opacity = useSharedValue(0);
  const waveScale = useSharedValue(0);
  const textOpacity = useSharedValue(0);
  const textTranslateY = useSharedValue(10);
  const iconScale = useSharedValue(0);

  useEffect(() => {
    if (visible) {
      opacity.value = 0;
      waveScale.value = 0;
      textOpacity.value = 0;
      textTranslateY.value = 10;
      iconScale.value = 0;

      opacity.value = withTiming(1, {
        duration: 300,
        easing: Easing.out(Easing.cubic),
      });

      waveScale.value = withTiming(3, {
        duration: 1200,
        easing: Easing.out(Easing.exp),
      });

      iconScale.value = withSequence(
        withDelay(
          200,
          withTiming(1.2, {
            duration: 400,
            easing: Easing.out(Easing.elastic(1)),
          }),
        ),
        withTiming(1, { duration: 300 }),
      );

      textOpacity.value = withDelay(
        400,
        withTiming(1, { duration: 600, easing: Easing.out(Easing.cubic) }),
      );

      textTranslateY.value = withDelay(
        400,
        withTiming(0, { duration: 600, easing: Easing.out(Easing.cubic) }),
      );

      const timeout = setTimeout(() => {
        opacity.value = withTiming(0, {
          duration: 800,
          easing: Easing.inOut(Easing.cubic),
        });
      }, 2500);

      return () => clearTimeout(timeout);
    }
  }, [iconScale, opacity, textOpacity, textTranslateY, visible, waveScale]);

  const containerStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const waveStyle = useAnimatedStyle(() => ({
    transform: [{ scale: waveScale.value }],
    opacity: 0.12,
  }));

  const iconStyle = useAnimatedStyle(() => ({
    transform: [{ scale: iconScale.value }],
  }));

  const textStyle = useAnimatedStyle(() => ({
    opacity: textOpacity.value,
    transform: [{ translateY: textTranslateY.value }],
  }));

  const circleDiameter = Math.max(screenWidth, screenHeight) * 1.2;

  return (
    <Animated.View
      pointerEvents="none"
      className="absolute inset-0 z-50 items-center justify-center"
      style={[
        containerStyle,
        {
          backgroundColor: "rgba(0,0,0,0.6)",
        },
      ]}
    >
      <Animated.View
        style={[
          {
            position: "absolute",
            width: circleDiameter,
            height: circleDiameter,
            borderRadius: circleDiameter / 2,
            backgroundColor: "rgba(255, 165, 0, 0.15)",
          },
          waveStyle,
        ]}
      />

      <Animated.View style={iconStyle}>
        <Icon name="wifi-off" size={72} color={colors.warningOrange} />
      </Animated.View>

      <Animated.View style={[{ marginTop: 16 }, textStyle]}>
        <Text
          style={{
            color: colors.warningOrange,
            fontWeight: "600",
            fontSize: 20,
            textAlign: "center",
          }}
        >
          Entrando no modo offline
        </Text>
      </Animated.View>
    </Animated.View>
  );
}
