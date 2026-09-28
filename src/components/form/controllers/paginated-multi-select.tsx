import { Button } from "@/components/ui/button";
import type { ApiResponsePaginated } from "@/api/types";
import { ListPaginated } from "@/components/list/list-paginated";
import { Icon } from "@/components/ui/icon";
import { Modal } from "@/components/ui/modal";
import { Search } from "@/components/ui/search";
import { Skeleton } from "@/components/ui/skeleton";
import { Text } from "@/components/ui/text";
import { usePaginatedList } from "@/hooks/use-paginated-list";
import type { QueryKey } from "@tanstack/react-query";
import { useCallback, useMemo, useState } from "react";
import {
  Controller,
  type FieldValues,
  UseControllerProps,
} from "react-hook-form";
import { View } from "@/components/ui/view";

interface ControlledPaginatedSelectMultipleOption {
  id: number;
  [key: string]: any;
}

interface ControlledPaginatedSelectMultipleProps<
  TOption extends ControlledPaginatedSelectMultipleOption =
    ControlledPaginatedSelectMultipleOption,
> {
  label: string;
  placeholder?: string;
  disabled?: boolean;
  queryKey: QueryKey;
  queryFn: (params: {
    pageParam: number;
    search?: string;
    perPage?: number;
  }) => Promise<ApiResponsePaginated<TOption[]>>;
  getOptionLabel: (option: TOption) => string;
  getOptionValue: (option: TOption) => string | number;
  searchPlaceholder?: string;
  emptyText?: string;
  perPage?: number;
  modalTitle?: string;
  loading?: boolean;
  maxSelection?: number;
}

export function ControlledPaginatedMultiSelect<
  FormType extends FieldValues,
  TOption extends ControlledPaginatedSelectMultipleOption =
    ControlledPaginatedSelectMultipleOption,
>({
  control,
  name,
  rules,
  label,
  placeholder = "Selecione uma ou mais opções",
  disabled = false,
  queryKey,
  queryFn,
  getOptionLabel,
  getOptionValue,
  searchPlaceholder = "Pesquisar...",
  emptyText = "Nenhuma informação encontrada!",
  perPage = 10,
  modalTitle = "Selecionar",
  loading = false,
  maxSelection,
}: UseControllerProps<FormType> &
  ControlledPaginatedSelectMultipleProps<TOption>) {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [search, setSearch] = useState("");

  const {
    items,
    isLoading,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isRefetching,
    refetch,
    total,
    currentTotal,
  } = usePaginatedList({
    queryKey: [...queryKey, search],
    queryFn: ({ pageParam: page }) =>
      queryFn({ pageParam: page, search, perPage }),
  });

  const openModal = useCallback(() => {
    if (!disabled) {
      setIsModalVisible(true);
    }
  }, [disabled]);

  const closeModal = useCallback(() => {
    setIsModalVisible(false);
    setSearch("");
  }, []);

  const handleToggleSelection = useCallback(
    (
      itemValue: string | number,
      currentValues: any[],
      onChange: (value: any) => void,
    ) => {
      const values = currentValues || [];
      const isSelected = values.includes(itemValue);

      if (isSelected) {
        // Remove item
        onChange(values.filter((v) => v !== itemValue));
      } else {
        // Add item if not exceeding max selection
        if (maxSelection && values.length >= maxSelection) {
          return;
        }
        onChange([...values, itemValue]);
      }
    },
    [maxSelection],
  );

  const handleRemoveBadge = useCallback(
    (
      itemValue: string | number,
      currentValues: any[],
      onChange: (value: any) => void,
    ) => {
      const values = currentValues || [];
      onChange(values.filter((v) => v !== itemValue));
    },
    [],
  );

  const renderItem = useCallback(
    ({
      item,
      onChange,
      value,
    }: {
      item: TOption;
      onChange: (value: any) => void;
      value: any[];
    }) => {
      const values = value || [];
      const itemValue = getOptionValue(item);
      const isSelected = values.includes(itemValue);
      const isMaxReached = maxSelection
        ? values.length >= maxSelection && !isSelected
        : false;

      return (
        <Button
          variant="unstyled"
          size="content"
          onPress={() => handleToggleSelection(itemValue, values, onChange)}
          disabled={isMaxReached}
          className={`flex-row items-center justify-between  rounded-2xl border bg-secondary p-3 ${
            isSelected ? "border-primary" : "border-border"
          } ${isMaxReached ? "opacity-50" : ""}`}
        >
          <Text className="font-semibold text-lg text-foreground">
            {getOptionLabel(item)}
          </Text>
          {isSelected ? (
            <Icon name="check-circle" size={18} className="color-primary" />
          ) : (
            <Icon name="circle" size={18} className="color-border" />
          )}
        </Button>
      );
    },
    [getOptionLabel, getOptionValue, handleToggleSelection, maxSelection],
  );

  const findSelectedItems = useCallback(
    (values: any[]): TOption[] => {
      if (!values || values.length === 0) return [];
      return items.filter((item) => values.includes(getOptionValue(item)));
    },
    [items, getOptionValue],
  );

  const selectedItems = useMemo(
    () => findSelectedItems([]),
    [findSelectedItems],
  );

  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({
        field: { onChange, value },
        fieldState: { error: fieldError },
      }) => {
        return (
          <View className="flex-col gap-1">
            <Text className="font-medium text-foreground">
              {label}
              {rules?.required && <Text className="text-destructive"> *</Text>}
            </Text>

            <Button
              variant="unstyled"
              size="content"
              className={`flex-row items-center justify-between rounded-md border p-3 ${
                disabled ? "bg-input-disabled" : "bg-input"
              } ${fieldError ? "border-destructive" : "border-border"}`}
              onPress={openModal}
              disabled={disabled}
            >
              <View className="flex-1">
                {selectedItems.length === 0 && (
                  <Text
                    className={
                      placeholder.includes("Selecione")
                        ? "font-medium text-description"
                        : "font-medium text-foreground"
                    }
                  >
                    {loading ? "Carregando..." : placeholder}
                  </Text>
                )}
                {selectedItems.length > 0 && (
                  <View className="flex-row flex-wrap gap-2">
                    {selectedItems.map((item) => (
                      <View
                        key={String(getOptionValue(item))}
                        className="rounded-full border border-border bg-background px-3 py-1"
                      >
                        <View className="flex-row items-center">
                          <Text
                            className="mr-2 text-sm text-primary"
                            numberOfLines={1}
                          >
                            {getOptionLabel(item)}
                          </Text>
                          <Button
                            variant="unstyled"
                            size="content"
                            onPress={() =>
                              handleRemoveBadge(
                                getOptionValue(item),
                                value,
                                onChange,
                              )
                            }
                            activeOpacity={0.7}
                            hitSlop={{ top: 5, bottom: 5, left: 5, right: 5 }}
                          >
                            <Icon
                              name="x"
                              size={16}
                              className="color-primary"
                            />
                          </Button>
                        </View>
                      </View>
                    ))}
                  </View>
                )}
              </View>
              <View className="ml-2">
                <Icon name="chevron-down" size={16} className="color-primary" />
              </View>
            </Button>

            {fieldError && (
              <Text className="text-sm text-destructive">
                {fieldError?.message}
              </Text>
            )}

            <Modal
              visible={isModalVisible}
              onClose={closeModal}
              type="full"
              title={modalTitle}
            >
              <View className="flex-1 flex-col gap-6">
                <Search
                  value={search}
                  loading={isLoading}
                  placeholder={searchPlaceholder}
                  onChangeText={setSearch}
                  debounceDelay={200}
                />

                <View className="flex-row items-center justify-between">
                  <Text className="text-label">
                    Total: {currentTotal} de {total}
                  </Text>
                  {(value || []).length > 0 && (
                    <Text className="font-medium text-primary">
                      {value.length} selecionado
                      {value.length !== 1 ? "s" : ""}
                    </Text>
                  )}
                </View>

                <ListPaginated
                  data={items}
                  renderItem={({ item }) =>
                    renderItem({ item, onChange, value })
                  }
                  loadingComponent={<Loading />}
                  emptyText={emptyText}
                  hasNextPage={hasNextPage}
                  isFetchingNextPage={isFetchingNextPage}
                  isRefetching={isRefetching}
                  fetchNextPage={fetchNextPage}
                  onRefresh={refetch}
                  isLoading={isLoading}
                  initialNumToRender={perPage}
                />
              </View>
            </Modal>
          </View>
        );
      }}
    />
  );
}

export function Loading() {
  const array = Array.from({ length: 10 }, (_, i) => i + 1);
  return (
    <View className="flex-1 flex-col gap-6">
      {array.map((item) => (
        <Skeleton key={item} height={100} style={{ borderRadius: 6 }} />
      ))}
    </View>
  );
}
