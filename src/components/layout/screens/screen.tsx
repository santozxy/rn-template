import { useScreenSafeAreaInsets } from "@/hooks/use-screen-safe-area-insets";
import { useTheme } from "@/hooks/use-theme";
import { Platform, View } from "react-native";
import { ScreenChrome } from "./components/chrome";
import { ScreenContainer } from "./components/container";
import { ScreenContent } from "./components/content";
import { ScreenDescription } from "./components/description";
import type { ScreenProps } from "./helpers";
import { hasScreenChrome, resolveScreenStatusBarStyle } from "./helpers";

export type { ScreenProps } from "./helpers";

export function Screen({
  children,
  title,
  description,
  header,
  actions,
  canGoBack,
  onBackPress,
  contentSize,
  padded,
  center,
  backgroundColor,
  statusBarStyle,
  style,
  contentContainerStyle,
  tabBarScreen,
}: ScreenProps) {
  const noInsetsBottom = tabBarScreen && Platform.OS === "android";
  const insets = useScreenSafeAreaInsets();
  const { theme } = useTheme();
  const hasChrome = hasScreenChrome({ header, title });
  const resolvedStatusBarStyle = resolveScreenStatusBarStyle({
    topInsetConsumed: insets.topInsetConsumed,
    statusBarStyle,
    header,
    title,
    theme,
  });

  return (
    <ScreenContainer
      backgroundColor={backgroundColor}
      statusBarStyle={resolvedStatusBarStyle}
      style={style}
    >
      <ScreenChrome
        title={title}
        header={header}
        actions={actions}
        canGoBack={canGoBack}
        onBackPress={onBackPress}
        contentSize={contentSize}
      />
      <View
        style={{
          flex: 1,
          paddingTop: hasChrome ? 0 : insets.top,
          paddingRight: insets.right,
          paddingBottom: noInsetsBottom ? 0 : insets.bottom,
          paddingLeft: insets.left,
        }}
      >
        {description ? (
          <ScreenDescription contentSize={contentSize}>
            {description}
          </ScreenDescription>
        ) : null}
        <ScreenContent
          contentSize={contentSize}
          padded={padded}
          center={center}
          style={contentContainerStyle}
        >
          {children}
        </ScreenContent>
      </View>
    </ScreenContainer>
  );
}
