import { FLOATING_TAB_BAR_BOTTOM_GAP } from "@/routes/floating-tab-bar";
import { BottomTabBarHeightContext } from "@react-navigation/bottom-tabs";
import { use } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const DEFAULT_CONTENT_GAP = 16;

export function useHasBottomTabBar() {
  return use(BottomTabBarHeightContext) !== undefined;
}

export function useBottomTabBarContentPadding(
  contentGap = DEFAULT_CONTENT_GAP,
) {
  const tabBarHeight = use(BottomTabBarHeightContext);
  const insets = useSafeAreaInsets();

  if (tabBarHeight === undefined) return 0;

  return (
    tabBarHeight + insets.bottom + FLOATING_TAB_BAR_BOTTOM_GAP + contentGap
  );
}
