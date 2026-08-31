import type { IconName } from "@/components/ui/icon";
import { useNetwork } from "@/hooks/use-network";
import { DEFAULT_OFFLINE_MESSAGE } from "@/lib/network/offline";
import { toast } from "@/lib/toast";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  View,
  type ListRenderItem,
  type ListRenderItemInfo,
} from "react-native";
import { OfflineDataUnavailable } from "../ui/offline-data-unavailable";
import { Separator } from "../ui/separator";
import { Empty } from "./empty";
import { defaultListKeyExtractor } from "./helpers";
import { useListLayout, type ListLayout } from "./use-list-layout";

export interface ListPaginatedProps<T> {
  data: T[] | undefined;
  hasNextPage: boolean | undefined;
  isFetchingNextPage: boolean;
  isRefetching: boolean;
  isLoading?: boolean;
  isOfflineUnavailable?: boolean;
  emptyText?: string;
  emptyIconName?: IconName;
  horizontal?: boolean;
  initialNumToRender?: number;
  renderItem: ListRenderItem<T>;
  onRefresh?: () => void | Promise<unknown>;
  fetchNextPage: () => void;
  ListHeaderComponent?: React.ComponentType<any> | React.ReactElement | null;
  ListEmptyComponent?: React.ComponentType<any> | React.ReactElement | null;
  separator?: boolean;
  loadingComponent: React.ReactNode;
  keyExtractor?: (item: T, index: number) => string;
  layout?: ListLayout;
}

export function ListPaginated<T>({
  data,
  renderItem,
  onRefresh,
  fetchNextPage,
  hasNextPage,
  isFetchingNextPage,
  isRefetching,
  emptyText = "Nenhum registro encontrado",
  ListHeaderComponent,
  ListEmptyComponent,
  emptyIconName = "alert",
  horizontal = false,
  isLoading,
  isOfflineUnavailable = false,
  initialNumToRender = 10,
  separator = false,
  loadingComponent,
  keyExtractor = defaultListKeyExtractor,
  layout = { minItemWidth: 320, maxColumns: 3 },
}: ListPaginatedProps<T>) {
  const { status } = useNetwork();
  const flatListRef = useRef<FlatList<T>>(null);
  const [refreshing, setRefreshing] = useState(false);
  const { columns, gap, itemWidth, onLayout } = useListLayout({
    horizontal,
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
    if (!isRefetching) setRefreshing(false);
  }, [isRefetching]);

  const handleRefresh = async () => {
    if (status !== "online") {
      toast.warning(DEFAULT_OFFLINE_MESSAGE);
      return;
    }

    setRefreshing(true);
    try {
      await onRefresh?.();
    } finally {
      setRefreshing(false);
    }
  };

  const handleLoadMore = () => {
    if (
      status === "online" &&
      hasNextPage &&
      !isFetchingNextPage &&
      !isLoading
    ) {
      fetchNextPage();
    }
  };

  const renderFooter = () => {
    if (!isFetchingNextPage) return <View className="pb-8" />;
    return (
      <View style={{ paddingVertical: 60 }}>
        <ActivityIndicator size="small" className="color-primary" />
      </View>
    );
  };

  if (isLoading || (status === "checking" && isOfflineUnavailable)) {
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
      key={`paginated-list-${columns}-${horizontal ? "horizontal" : "vertical"}`}
      ref={flatListRef}
      horizontal={horizontal}
      numColumns={columns}
      data={data}
      renderItem={renderGridItem}
      onLayout={onLayout}
      contentInsetAdjustmentBehavior="automatic"
      initialNumToRender={initialNumToRender}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={handleRefresh}
          enabled={status === "online"}
          className="color-primary"
        />
      }
      keyExtractor={keyExtractor}
      ListEmptyComponent={
        isOfflineUnavailable && status !== "checking" ? (
          <OfflineDataUnavailable />
        ) : ListEmptyComponent ? (
          ListEmptyComponent
        ) : (
          <Empty message={emptyText} iconName={emptyIconName} />
        )
      }
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ gap, flexGrow: 1, paddingBottom: 20 }}
      columnWrapperStyle={columns > 1 ? { gap } : undefined}
      onEndReached={handleLoadMore}
      onEndReachedThreshold={0.1}
      ListHeaderComponent={ListHeaderComponent}
      ListFooterComponent={renderFooter()}
      ItemSeparatorComponent={
        separator && columns === 1 ? () => <Separator /> : null
      }
    />
  );
}
