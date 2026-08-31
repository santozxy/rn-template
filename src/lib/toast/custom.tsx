import { Icon, type IconName } from "@/components/ui/icon";
import { useTheme } from "@/hooks/use-theme";
import { StyleSheet, View } from "react-native";
import {
  BaseToast,
  ErrorToast,
  InfoToast,
  ToastConfigParams,
} from "react-native-toast-message";

type Colors = "success" | "destructive" | "info" | "warning";

const toastIcons: Record<Colors, IconName> = {
  success: "checkmark-circle",
  destructive: "close-circle",
  info: "information-circle",
  warning: "alert-circle",
};

interface ToastStyleProps {
  borderColor: Colors;
  textColor: Colors;
}

export const createToast = (
  { borderColor, textColor }: ToastStyleProps,
  ToastComponent: typeof BaseToast | typeof ErrorToast | typeof InfoToast,
) => {
  const ToastRenderer = (props: ToastConfigParams<any>) => {
    const iconName = toastIcons[borderColor];
    const { colors } = useTheme();

    return (
      <ToastComponent
        {...props}
        style={[
          styles.toast,
          {
            borderLeftColor: colors[borderColor],
            backgroundColor: colors.surface,
            borderRightColor: colors.border,
            borderTopColor: colors.border,
            borderBottomColor: colors.border,
            borderWidth: 1,
            shadowColor: colors[borderColor],
          },
        ]}
        text1Style={[styles.text1, { color: colors[textColor] }]}
        text2Style={[styles.text2, { color: colors[textColor] }]}
        text2NumberOfLines={5}
        renderLeadingIcon={() => (
          <View style={styles.iconContainer}>
            <Icon name={iconName} size={24} color={colors[borderColor]} />
          </View>
        )}
      />
    );
  };

  ToastRenderer.displayName = `ToastRenderer(${borderColor})`;

  return ToastRenderer;
};

const styles = StyleSheet.create({
  toast: {
    height: "auto",
    borderLeftWidth: 8,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    paddingVertical: 12,
    paddingHorizontal: 8,
    zIndex: 9999,
  },
  text1: {
    fontSize: 16,
    fontWeight: "600",
  },
  text2: {
    fontSize: 16,
  },
  iconContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
});
