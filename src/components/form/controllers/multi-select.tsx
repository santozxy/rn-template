import { Icon } from "@/components/ui/icon";
import { Modal } from "@/components/ui/modal";
import { Search } from "@/components/ui/search";
import { Text } from "@/components/ui/text";
import { removeAccents } from "@/utils/text";
import { memo, useCallback, useMemo, useState } from "react";
import {
  FieldValues,
  UseControllerProps,
  useController,
} from "react-hook-form";
import { FlatList, TouchableOpacity, View } from "react-native";

interface Option {
  id: string | number;
  name: string;
}

interface ControlledMultiSelectProps {
  label: string;
  data?: Option[];
  placeholder: string;
  loading?: boolean;
  search?: boolean;
  disabled?: boolean;
  modalTitle?: string;
  emptyText?: string;
  wrap?: boolean;
  limit?: number;
  rightComponent?: React.ReactNode;
}

export function ControlledMultiSelect<FormType extends FieldValues>({
  name,
  label,
  rules,
  control,
  data = [],
  placeholder,
  loading = false,
  search = true,
  disabled = false,
  wrap = true,
  limit,
  modalTitle = "Selecione opções",
  emptyText = "Nenhuma informação encontrada!",
  rightComponent,
}: ControlledMultiSelectProps & UseControllerProps<FormType>) {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [searchText, setSearchText] = useState("");

  const {
    field: { onChange, value },
    fieldState: { error },
  } = useController<FormType>({
    control,
    name,
    rules,
  });

  const currentValue = useMemo<(string | number)[]>(
    () => (Array.isArray(value) ? value : []),
    [value],
  );

  const normalizedLimit =
    typeof limit === "number" && limit > 0 ? limit : undefined;
  const isLimitReached = normalizedLimit
    ? currentValue.length >= normalizedLimit
    : false;

  const selectedValueSet = useMemo(() => new Set(currentValue), [currentValue]);

  const optionById = useMemo(() => {
    const map = new Map<string | number, Option>();
    for (const item of data) {
      map.set(item.id, item);
    }
    return map;
  }, [data]);

  const openModal = useCallback(() => {
    if (!disabled) setIsModalVisible(true);
  }, [disabled]);

  const closeModal = useCallback(() => {
    setIsModalVisible(false);
    setSearchText("");
  }, []);

  const filteredData = useMemo(() => {
    if (!search || !searchText) return data;
    return data.filter((item) =>
      removeAccents(item.name)
        .toLowerCase()
        .includes(removeAccents(searchText).toLowerCase()),
    );
  }, [data, search, searchText]);

  const selectedItems = useMemo(
    () =>
      currentValue
        .map((id) => optionById.get(id))
        .filter((item): item is Option => !!item),
    [currentValue, optionById],
  );

  const handleToggleSelection = useCallback(
    (itemId: string | number) => {
      const isSelected = selectedValueSet.has(itemId);

      if (isSelected) {
        onChange(currentValue.filter((v) => v !== itemId));
        return;
      }

      if (normalizedLimit && currentValue.length >= normalizedLimit) {
        return;
      }

      onChange([...currentValue, itemId]);
    },
    [selectedValueSet, onChange, currentValue, normalizedLimit],
  );

  const renderItem = useCallback(
    ({ item }: { item: Option }) => {
      const isSelected = selectedValueSet.has(item.id);
      const isSelectionBlocked = isLimitReached && !isSelected;

      return (
        <MultiSelectItem
          item={item}
          isSelected={isSelected}
          disabled={isSelectionBlocked}
          onToggleSelection={handleToggleSelection}
        />
      );
    },
    [selectedValueSet, isLimitReached, handleToggleSelection],
  );

  const keyExtractor = useCallback((item: Option) => String(item.id), []);

  return (
    <View className="flex-col gap-1">
      <View className="flex-row justify-between">
        {label && (
          <Text className="font-medium text-foreground" numberOfLines={1}>
            {label}{" "}
            {rules?.required && <Text className="text-destructive">*</Text>}
          </Text>
        )}
        <View className="flex-1 flex-row items-center justify-end">
          {rightComponent && <View>{rightComponent}</View>}
        </View>
      </View>

      <TouchableOpacity
        className={`flex-row items-center justify-between rounded-2xl border p-3 ${
          disabled ? "bg-input-disabled" : "bg-input"
        } ${error ? "border-destructive" : "border-border"}`}
        onPress={openModal}
        disabled={disabled}
      >
        {currentValue.length === 0 && (
          <Text className="font-medium text-description">
            {loading ? "Carregando..." : placeholder}
          </Text>
        )}

        {currentValue.length > 0 && (
          <Text className="flex-1 text-foreground" numberOfLines={1}>
            {`${currentValue.length} selecionado${
              currentValue.length > 1 ? "s" : ""
            }`}
          </Text>
        )}

        <Icon name="chevron-down" size={16} className="color-primary" />
      </TouchableOpacity>

      {selectedItems.length > 0 && (
        <View
          className={` ${wrap ? "flex-row flex-wrap" : "flex-col"} mt-2 gap-2`}
        >
          {selectedItems.map((item) => (
            <View
              key={String(item.id)}
              className="flex-row items-center gap-2 rounded-xl border border-border bg-secondary p-2"
            >
              <Text
                className={`text-sm text-primary ${wrap ? "" : "flex-1"}`}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {item.name}
              </Text>
              <TouchableOpacity
                onPress={() =>
                  onChange(currentValue.filter((v) => v !== item.id))
                }
                className="w-4"
                hitSlop={{ top: 5, bottom: 5, left: 5, right: 5 }}
              >
                <Icon name="x" size={16} className="color-destructive" />
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}

      {error && (
        <Text className="text-sm text-destructive">{error.message}</Text>
      )}

      <Modal
        visible={isModalVisible}
        onClose={closeModal}
        type="full"
        title={modalTitle}
      >
        <View className="flex-1 gap-6">
          {search && (
            <Search
              value={searchText}
              loading={loading}
              placeholder="Pesquisar..."
              onChangeText={setSearchText}
              debounceDelay={200}
            />
          )}
          <View className="flex-row items-center justify-between">
            {normalizedLimit ? (
              <Text className="text-sm text-description">
                {currentValue.length}/{normalizedLimit} selecionados
              </Text>
            ) : (
              <Text className="text-sm text-description">
                {currentValue.length} selecionado
                {currentValue.length !== 1 && "s"}
              </Text>
            )}
            {currentValue.length > 0 && (
              <TouchableOpacity
                onPress={() => onChange([])}
                className="flex self-end"
              >
                <Text className="text-sm text-primary">Limpar seleção</Text>
              </TouchableOpacity>
            )}
          </View>
          <FlatList
            data={filteredData}
            keyExtractor={keyExtractor}
            renderItem={renderItem}
            extraData={currentValue}
            contentContainerStyle={{ gap: 16 }}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            removeClippedSubviews
            initialNumToRender={12}
            maxToRenderPerBatch={16}
            windowSize={8}
            ListEmptyComponent={() => (
              <Text className="mt-10 text-center text-description">
                {emptyText}
              </Text>
            )}
          />
        </View>
      </Modal>
    </View>
  );
}

/* Item no mesmo padrão do Select */
const MultiSelectItem = memo(function MultiSelectItem({
  item,
  isSelected,
  disabled,
  onToggleSelection,
}: {
  item: Option;
  isSelected: boolean;
  disabled?: boolean;
  onToggleSelection: (itemId: string | number) => void;
}) {
  return (
    <TouchableOpacity
      onPress={() => onToggleSelection(item.id)}
      disabled={disabled}
      className={`flex-row items-center justify-between  rounded-2xl border bg-secondary p-3  ${
        isSelected ? "border-primary" : "border-border"
      } ${disabled ? "opacity-50" : ""}`}
    >
      <Text
        className={`flex-1  ${
          isSelected ? "font-semibold text-primary" : "text-foreground"
        }`}
      >
        {item.name}
      </Text>

      {isSelected ? (
        <Icon name="check-circle" size={18} className="color-primary" />
      ) : (
        <Icon name="circle" size={18} className="color-border" />
      )}
    </TouchableOpacity>
  );
});
