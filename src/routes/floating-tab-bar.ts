import type { BottomTabNavigationOptions } from "@react-navigation/bottom-tabs";
import type { ColorValue } from "react-native";
import type { EdgeInsets } from "react-native-safe-area-context";

export interface FloatingTabBarColors {
  background: ColorValue;
  border: ColorValue;
  activeBackground: string;
  activeContent: string;
  inactiveContent: string;
}

export interface FloatingTabBarOptions {
  colors: FloatingTabBarColors;
  insets: Pick<EdgeInsets, "bottom" | "left" | "right">;
  dark?: boolean;
  showLabels?: boolean;
  height?: number;
  horizontalGap?: number;
  bottomGap?: number;
  radius?: number;
  itemRadius?: number;
}

export const FLOATING_TAB_BAR_SAFE_AREA_INSETS: EdgeInsets = {
  top: 0,
  right: 0,
  bottom: 0,
  left: 0,
};

export const FLOATING_TAB_BAR_BOTTOM_GAP = 10;

/**
 * Creates a floating appearance while keeping React Navigation's native tab
 * behavior, accessibility, keyboard handling and content measurement.
 */
export function createFloatingTabBarOptions({
  colors,
  insets,
  dark = false,
  showLabels = false,
  height,
  horizontalGap = 20,
  bottomGap = FLOATING_TAB_BAR_BOTTOM_GAP,
  radius = 30,
  itemRadius = 40,
}: FloatingTabBarOptions): BottomTabNavigationOptions {
  const resolvedHeight = height ?? (showLabels ? 62 : 56);

  return {
    tabBarHideOnKeyboard: true,
    tabBarShowLabel: showLabels,
    tabBarLabelPosition: "below-icon",
    tabBarActiveTintColor: colors.activeContent,
    tabBarInactiveTintColor: colors.inactiveContent,
    tabBarActiveBackgroundColor: colors.activeBackground,
    tabBarInactiveBackgroundColor: "transparent",
    tabBarStyle: {
      position: "absolute",
      height: resolvedHeight,
      marginLeft: horizontalGap + insets.left,
      marginRight: horizontalGap + insets.right,
      marginBottom: Math.max(bottomGap, insets.bottom + bottomGap),
      paddingHorizontal: 4,
      paddingTop: 6,
      paddingBottom: 6,
      backgroundColor: colors.background,
      borderWidth: 1,
      borderTopWidth: 1,
      borderColor: colors.border,
      borderRadius: radius,
      borderCurve: "continuous",
      boxShadow: dark
        ? "0 10px 10px rgba(0, 0, 0, 0.32)"
        : "0 10px 10px rgba(39, 26, 21, 0.05)",
    },
    tabBarItemStyle: {
      marginHorizontal: 3,
      borderRadius: itemRadius,
      borderCurve: "continuous",
      overflow: "hidden",
    },
    tabBarIconStyle: {
      marginTop: showLabels ? 1 : 0,
    },
    tabBarLabelStyle: {
      fontSize: 10,
      fontWeight: "600",
      marginBottom: 0,
    },
  };
}
