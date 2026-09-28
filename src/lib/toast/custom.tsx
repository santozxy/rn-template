import { Icon, type IconName } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { View } from "@/components/ui/view";
import { useTheme } from "@/hooks/use-theme";
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

export function createToast(variant: ToastVariant) {
  const ToastRenderer = ({ text1, text2 }: ToastConfigParams<unknown>) => {
    const { colors, theme } = useTheme();
    const { color, icon } = toastStyles[variant];
    const accentColor = colors[color];
    const backgroundColor = mixHexColors(
      accentColor,
      colors.surface,
      theme === "dark" ? 0.18 : 0.08,
    );

    return (
      <View
        accessible
        accessibilityRole="alert"
        accessibilityLiveRegion="polite"
        className="w-[92%] max-w-[420px] flex-row items-start gap-3 rounded-xl border p-3"
        style={{
          backgroundColor,
          borderColor: mixHexColors(accentColor, colors.surface, 0.3),
          borderCurve: "continuous",
          boxShadow:
            theme === "dark"
              ? "0 8px 24px rgba(0, 0, 0, 0.32)"
              : "0 8px 24px rgba(30, 25, 37, 0.14)",
        }}
      >
        <View className="pt-0.5">
          <Icon name={icon} size={20} color={accentColor} strokeWidth={2.25} />
        </View>
        <View className="min-w-0 flex-1 gap-0.5">
          {text1 ? (
            <Text
              className="font-medium text-sm text-foreground"
              numberOfLines={1}
            >
              {text1}
            </Text>
          ) : null}
          {text2 ? (
            <Text
              className="text-sm font-normal text-description"
              numberOfLines={5}
            >
              {text2}
            </Text>
          ) : null}
        </View>
      </View>
    );
  };

  ToastRenderer.displayName = `ToastRenderer(${variant})`;

  return ToastRenderer;
}
