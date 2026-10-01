import { Icon, type IconName } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { View } from "@/components/ui/view";
import { useTheme } from "@/hooks/use-theme";
import { BlurView } from "expo-blur";
import type { ToastConfigParams } from "react-native-toast-message";

type ToastVariant = "success" | "error" | "info" | "warning";
type ToastColor = "success" | "destructive" | "info" | "warning";

interface ToastStyle {
  color: ToastColor;
  icon: IconName;
}

const toastStyles: Record<ToastVariant, ToastStyle> = {
  success: { color: "success", icon: "checkmark-circle" },
  error: { color: "destructive", icon: "close-circle" },
  info: { color: "info", icon: "information-circle" },
  warning: { color: "warning", icon: "alert" },
};

function mixHexColors(foreground: string, background: string, ratio: number) {
  const foregroundValue = Number.parseInt(foreground.slice(1), 16);
  const backgroundValue = Number.parseInt(background.slice(1), 16);
  const channels = [16, 8, 0].map((shift) => {
    const foregroundChannel = (foregroundValue >> shift) & 255;
    const backgroundChannel = (backgroundValue >> shift) & 255;

    return Math.round(
      foregroundChannel * ratio + backgroundChannel * (1 - ratio),
    );
  });

  return `#${channels.map((channel) => channel.toString(16).padStart(2, "0")).join("")}`;
}

function hexToRgba(color: string, opacity: number) {
  const colorValue = Number.parseInt(color.slice(1), 16);
  const red = (colorValue >> 16) & 255;
  const green = (colorValue >> 8) & 255;
  const blue = colorValue & 255;

  return `rgba(${red}, ${green}, ${blue}, ${opacity})`;
}

export function createToast(variant: ToastVariant) {
  const ToastRenderer = ({ text1, text2 }: ToastConfigParams<unknown>) => {
    const { colors, theme } = useTheme();
    const { color, icon } = toastStyles[variant];
    const accentColor = colors[color];

    return (
      <View
        accessible
        accessibilityRole="alert"
        accessibilityLiveRegion="polite"
        className="w-[92%] max-w-[420px] rounded-xl"
        style={{
          borderCurve: "continuous",
          boxShadow:
            theme === "dark"
              ? "0 8px 24px rgba(0, 0, 0, 0.32)"
              : "0 8px 24px rgba(30, 25, 37, 0.14)",
        }}
      >
        <BlurView
          intensity={6}
          style={{
            borderColor: mixHexColors(accentColor, colors.surface, 0.3),
            borderCurve: "continuous",
            borderRadius: 12,
            borderWidth: 1,
            overflow: "hidden",
          }}
        >
          <View
            pointerEvents="none"
            className="absolute inset-0"
            style={{
              backgroundColor: hexToRgba(
                accentColor,
                theme === "dark" ? 0.14 : 0.08,
              ),
            }}
          />
          <View className="flex-row items-start gap-3 p-3">
            <View className="pt-0.5">
              <Icon
                name={icon}
                size={20}
                color={accentColor}
                strokeWidth={2.25}
              />
            </View>
            <View className="min-w-0 flex-1 gap-0.5">
              {text1 ? (
                <Text
                  className={` text-${color} font-semibold`}
                  numberOfLines={1}
                >
                  {text1}
                </Text>
              ) : null}
              {text2 ? (
                <Text className="text-foreground" numberOfLines={5}>
                  {text2}
                </Text>
              ) : null}
            </View>
          </View>
        </BlurView>
      </View>
    );
  };

  ToastRenderer.displayName = `ToastRenderer(${variant})`;

  return ToastRenderer;
}
