import { useScreenSafeAreaInsets } from "@/hooks/use-screen-safe-area-insets";
import { useTheme } from "@/hooks/use-theme";
import { useCallback, useState } from "react";
import { RefreshControl, ScrollView, View } from "react-native";
import { ScreenChrome } from "./components/chrome";
import { ScreenContainer } from "./components/container";
import { ScreenContent } from "./components/content";
import { ScreenDescription } from "./components/description";
import type { ScrollableScreenProps } from "./helpers";
import { hasScreenChrome, resolveScreenStatusBarStyle } from "./helpers";

export type { ScrollableScreenProps } from "./helpers";

export function ScrollableScreen({
  children,
  title,
  description,
  header,
  headerPlacement = "fixed",
  contentHeader,
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
  onRefresh,
  refreshEnabled = true,
  onRefreshUnavailable,
  onRefreshError,
  scrollViewProps,
}: ScrollableScreenProps) {
  const [refreshing, setRefreshing] = useState(false);
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
  const chrome = (
    <ScreenChrome
      title={title}
      header={header}
      actions={actions}
      canGoBack={canGoBack}
      onBackPress={onBackPress}
      contentSize={contentSize}
    />
  );

  const handleRefresh = useCallback(async () => {
    if (!refreshEnabled) {
      onRefreshUnavailable?.();
      return;
    }

    setRefreshing(true);
    try {
      await onRefresh?.();
    } catch (error) {
      onRefreshError?.(error);
    } finally {
      setRefreshing(false);
    }
  }, [onRefresh, onRefreshError, onRefreshUnavailable, refreshEnabled]);

  return (
    <ScreenContainer
      backgroundColor={backgroundColor}
      statusBarStyle={resolvedStatusBarStyle}
      style={style}
    >
      {headerPlacement === "fixed" ? chrome : null}
      <View
        style={{
          flex: 1,
          paddingRight: insets.right,
          paddingLeft: insets.left,
        }}
      >
        <ScrollView
          {...scrollViewProps}
          contentInsetAdjustmentBehavior={
            scrollViewProps?.contentInsetAdjustmentBehavior ?? "automatic"
          }
          nestedScrollEnabled={scrollViewProps?.nestedScrollEnabled ?? true}
          showsVerticalScrollIndicator={
            scrollViewProps?.showsVerticalScrollIndicator ?? false
          }
          contentContainerStyle={[
            {
              flexGrow: 1,
              paddingTop: hasChrome ? 0 : insets.top,
              paddingBottom: 24 + insets.bottom,
            },
            scrollViewProps?.contentContainerStyle,
          ]}
          refreshControl={
            onRefresh ? (
              <RefreshControl
                refreshing={refreshing}
                onRefresh={handleRefresh}
                className="color-primary"
              />
            ) : undefined
          }
        >
          {headerPlacement === "content" ? chrome : null}
          {contentHeader}
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
        </ScrollView>
      </View>
    </ScreenContainer>
  );
}
