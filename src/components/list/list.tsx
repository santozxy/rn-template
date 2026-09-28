import type { IconName } from "@/components/ui/icon";
import { View } from "@/components/ui/view";
import { useBottomTabBarContentPadding } from "@/hooks/use-bottom-tab-bar-content-padding";
import { useNetwork } from "@/hooks/use-network";
import { DEFAULT_OFFLINE_MESSAGE } from "@/lib/network/offline";
import { toast } from "@/lib/toast";
import React, { useCallback, useEffect, useRef } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  type ListRenderItem,
  type ListRenderItemInfo,
} from "react-native";
import { OfflineDataUnavailable } from "../ui/offline-data-unavailable";
import { Separator } from "../ui/separator";
import { Empty } from "./empty";
import { defaultListKeyExtractor } from "./helpers";
import { useListLayout, type ListLayout } from "./use-list-layout";

export interface ListProps<T> {
  data?: T[];
  renderItem: ListRenderItem<T>;
  onRefresh?: () => void;
  onEndReached?: () => void;
  isRefetching?: boolean;
  emptyText?: string;
  emptyIconName?: IconName;
  ListEmptyComponent?: React.ComponentType<any> | React.ReactElement | null;
  ListHeaderComponent?: React.ComponentType<any> | React.ReactElement | null;
  ListFooterComponent?: React.ComponentType<any> | React.ReactElement | null;
  horizontal?: boolean;
  paddingBottom?: number;
  scrollEnabled?: boolean;
  separator?: boolean;
  isLoading?: boolean;
  isOfflineUnavailable?: boolean;
  loadingComponent?: React.ReactNode;
  layout?: ListLayout;
  keyExtractor?: (item: T, index: number) => string;
}

export function List<T>({
  data,
  renderItem,
  onRefresh,
  onEndReached,
  emptyIconName = "alert",
  isRefetching = false,
  emptyText = "Nenhum registro encontrado",
  horizontal = false,
  ListHeaderComponent,
  ListFooterComponent,
  ListEmptyComponent,
  paddingBottom,
  scrollEnabled = true,
  separator = false,
  loadingComponent,
  isLoading = false,
  isOfflineUnavailable = false,
  layout = { minItemWidth: 320, maxColumns: 3 },
  keyExtractor = defaultListKeyExtractor,
}: ListProps<T>) {
  const { status } = useNetwork();
  const bottomTabBarContentPadding = useBottomTabBarContentPadding();
  const flatListRef = useRef<FlatList<T>>(null);
  const items = data ?? [];
  const waitingForNetwork = status === "checking" && data === undefined;
  const unavailableOffline =
    status !== "checking" &&
    (isOfflineUnavailable || (status !== "online" && data === undefined));
  const { columns, gap, itemWidth, onLayout } = useListLayout({
    horizontal: horizontal,
    layout,
  });

  const renderGridItem = useCallback(
    (info: ListRenderItemInfo<T>) => {
      const item = renderItem(info);
      if (columns === 1) return item;
      return <View style={{ width: itemWidth }}>{item}</View>;
    },
    [columns, itemWidth, renderItem],
  );

  useEffect(() => {
    if (flatListRef.current) {
      flatListRef.current.scrollToOffset({ animated: true, offset: 0 });
    }
  }, [data]);

  const handleRefresh = () => {
    if (status !== "online") {
      toast.warning(DEFAULT_OFFLINE_MESSAGE);
      return;
    }

    onRefresh?.();
  };

  if (isLoading || waitingForNetwork) {
    return (
      <>
        {loadingComponent || (
          <ActivityIndicator size="large" className="color-primary" />
        )}
      </>
    );
  }

  return (
    <FlatList
      key={`list-${columns}-${horizontal ? "horizontal" : "vertical"}`}
      ref={flatListRef}
      horizontal={horizontal}
      numColumns={columns}
      data={items}
      onLayout={onLayout}
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={{
        paddingBottom: horizontal
          ? 0
          : (paddingBottom ?? (bottomTabBarContentPadding || 24)),
        gap,
      }}
      columnWrapperStyle={columns > 1 ? { gap } : undefined}
      renderItem={renderGridItem}
      showsHorizontalScrollIndicator={false}
      scrollEnabled={scrollEnabled}
      refreshControl={
        onRefresh && (
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={handleRefresh}
            enabled={status === "online"}
            className="color-primary"
          />
        )
      }
      keyExtractor={keyExtractor}
      ListEmptyComponent={
        unavailableOffline ? (
          <OfflineDataUnavailable />
        ) : (
          ListEmptyComponent || (
            <Empty message={emptyText} iconName={emptyIconName} />
          )
        )
      }
      showsVerticalScrollIndicator={false}
      onEndReached={onEndReached}
      onEndReachedThreshold={0.1}
      ListHeaderComponent={ListHeaderComponent}
      ListFooterComponent={ListFooterComponent}
      ItemSeparatorComponent={
        separator && columns === 1 ? () => <Separator /> : null
      }
    />
  );
}
