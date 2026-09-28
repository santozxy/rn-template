import type { ResponsiveContainerSize } from "@/components/layout/responsive/container";
import type { Theme } from "@/theme/colors";
import type { StatusBarStyle } from "expo-status-bar";
import type { ReactNode } from "react";
import type {
  ColorValue,
  ScrollViewProps,
  StyleProp,
  ViewStyle,
} from "react-native";

export type HeaderPlacement = "fixed" | "content";

export interface ScreenBaseProps {
  children: ReactNode;
  title?: string;
  description?: string;
  header?: ReactNode;
  actions?: ReactNode;
  canGoBack?: boolean;
  onBackPress?: () => void;
  contentSize?: ResponsiveContainerSize;
  padded?: boolean;
  center?: boolean;
  gradientBackground?: boolean;
  backgroundColor?: ColorValue;
  statusBarStyle?: StatusBarStyle;
  style?: StyleProp<ViewStyle>;
  contentContainerStyle?: StyleProp<ViewStyle>;
}

export type ScreenProps = ScreenBaseProps;

export interface ScrollableScreenProps extends ScreenBaseProps {
  headerPlacement?: HeaderPlacement;
  contentHeader?: ReactNode;
  onRefresh?: () => void | Promise<void>;
  refreshEnabled?: boolean;
  onRefreshUnavailable?: () => void;
  onRefreshError?: (error: unknown) => void;
  scrollViewProps?: Omit<
    ScrollViewProps,
    "children" | "contentContainerStyle" | "refreshControl"
  > & {
    contentContainerStyle?: ScrollViewProps["contentContainerStyle"];
  };
}

export function hasScreenChrome({
  header,
  title,
}: Pick<ScreenBaseProps, "header" | "title">) {
  return header !== undefined ? header !== null : Boolean(title);
}

export function resolveScreenStatusBarStyle({
  topInsetConsumed,
  statusBarStyle,
  header,
  title,
  theme,
}: Pick<ScreenBaseProps, "statusBarStyle" | "header" | "title"> & {
  topInsetConsumed: boolean;
  theme: Theme;
}): StatusBarStyle {
  if (topInsetConsumed) return "light";

  return (
    statusBarStyle ??
    (header === undefined && title
      ? "light"
      : theme === "dark"
        ? "light"
        : "dark")
  );
}
