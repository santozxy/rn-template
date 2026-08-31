import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import React, { useCallback, useEffect, useMemo } from "react";
import {
  FieldValues,
  useController,
  UseControllerProps,
} from "react-hook-form";
import {
  FlatList,
  TouchableOpacity,
  View,
  type ListRenderItem,
} from "react-native";

export interface QuantityItemValue {
  id: string | number;
  name: string;
  quantity: number;
}

export interface QuantityItemOption {
  id: string | number;
  name: string;
  quantity?: number;
}

interface ControlledQuantityItemProps<
  FormType extends FieldValues,
> extends UseControllerProps<FormType> {
  data: QuantityItemOption[];
  label: string;
  emptyMessage?: string;
}

const LIST_ITEM_HEIGHT = 56;
const LIST_GAP = 8;

const QuantityListItem = React.memo(function QuantityListItem({
  item,
  onDecrease,
  onIncrease,
}: {
  item: QuantityItemValue;
  onDecrease: (itemId: string | number) => void;
  onIncrease: (itemId: string | number) => void;
}) {
  return (
    <View className="flex-row items-center gap-x-2">
      <View className="flex-1 justify-center rounded-xl border border-border bg-input px-4 py-3">
        <Text className="font-semibold text-foreground">{item.name}</Text>
      </View>

      <View className="flex-row items-center gap-x-4 rounded-xl border border-border bg-input p-2">
        <TouchableOpacity
          onPress={() => onDecrease(item.id)}
          activeOpacity={0.7}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Icon name="minus-circle" size={24} className="text-destructive" />
        </TouchableOpacity>

        <Text className="w-8 text-center font-bold text-lg text-foreground">
          {item.quantity}
        </Text>

        <TouchableOpacity
          onPress={() => onIncrease(item.id)}
          activeOpacity={0.7}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Icon name="plus-circle" size={24} className="text-success" />
        </TouchableOpacity>
      </View>
    </View>
  );
});

export function ControlledQuantityItem<FormType extends FieldValues>({
  name,
  control,
  rules,
  data,
  label,
  emptyMessage = "Nenhum item disponível",
}: ControlledQuantityItemProps<FormType>) {
  const [showList, setShowList] = React.useState(false);
  const {
    field: { value, onChange },
    fieldState: { error },
  } = useController({
    name,
    control,
    rules,
  });

  const currentItems = useMemo<QuantityItemValue[]>(
    () => (Array.isArray(value) ? value : []),
    [value],
  );

  const items = useMemo(
    () =>
      data.length > 0
        ? data.map((option) => {
            const currentItem = currentItems.find(
              (item) => String(item.id) === String(option.id),
            );

            return {
              id: option.id,
              name: currentItem?.name || option.name,
              quantity: currentItem?.quantity ?? option.quantity ?? 0,
            };
          })
        : currentItems,
    [currentItems, data],
  );

  useEffect(() => {
    const hasSameShape =
      items.length === currentItems.length &&
      items.every((item, index) => {
        const currentItem = currentItems[index];

        return (
          currentItem &&
          String(currentItem.id) === String(item.id) &&
          currentItem.name === item.name &&
          currentItem.quantity === item.quantity
        );
      });

    if (!hasSameShape) {
      onChange(items);
    }
  }, [currentItems, items, onChange]);

  const updateQuantity = useCallback(
    (itemId: string | number, delta: number) => {
      const updatedItems = items.map((item) => {
        if (String(item.id) !== String(itemId)) {
          return item;
        }

        return {
          ...item,
          quantity: Math.max(0, item.quantity + delta),
        };
      });

      onChange(updatedItems);
    },
    [items, onChange],
  );

  const handleDecrease = useCallback(
    (itemId: string | number) => updateQuantity(itemId, -1),
    [updateQuantity],
  );

  const handleIncrease = useCallback(
    (itemId: string | number) => updateQuantity(itemId, 1),
    [updateQuantity],
  );

  const keyExtractor = useCallback(
    (item: QuantityItemValue) => String(item.id),
    [],
  );

  const getItemLayout = useCallback(
    (_: ArrayLike<QuantityItemValue> | null | undefined, index: number) => ({
      length: LIST_ITEM_HEIGHT + LIST_GAP,
      offset: (LIST_ITEM_HEIGHT + LIST_GAP) * index,
      index,
    }),
    [],
  );

  const renderItem = useCallback<ListRenderItem<QuantityItemValue>>(
    ({ item }) => (
      <QuantityListItem
        item={item}
        onDecrease={handleDecrease}
        onIncrease={handleIncrease}
      />
    ),
    [handleDecrease, handleIncrease],
  );

  return (
    <View className="gap-2">
      {label && (
        <View className="w-full flex-row items-center rounded-2xl border border-border bg-input p-3">
          <Text className="text-center font-semibold text-base text-foreground  ">
            {label}
          </Text>
          <View className="flex-1 flex-row items-center justify-end">
            <TouchableOpacity
              onPress={() => setShowList((prev) => !prev)}
              activeOpacity={0.7}
              hitSlop={10}
            >
              <Icon
                name={showList ? "chevron-up" : "chevron-down"}
                size={20}
                className="text-primary"
              />
            </TouchableOpacity>
          </View>
        </View>
      )}
      {showList &&
        (items.length > 0 ? (
          <FlatList
            data={items}
            renderItem={renderItem}
            keyExtractor={keyExtractor}
            getItemLayout={getItemLayout}
            scrollEnabled={false}
            contentContainerStyle={{ gap: LIST_GAP }}
          />
        ) : null)}
      {items.length === 0 && (
        <View className="w-full items-center rounded-xl border border-dashed border-border p-4">
          <Text className="text-sm text-foreground">{emptyMessage}</Text>
        </View>
      )}

      {error && (
        <Text className="mt-1 text-sm text-destructive">{error.message}</Text>
      )}
    </View>
  );
}
