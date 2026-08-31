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

interface ControlledSelectProps {
  label: string;
  data?: Option[];
  placeholder: string;
  loading?: boolean;
  search?: boolean;
  disabled?: boolean;
  modalTitle?: string;
  emptyText?: string;
  className?: string;
}

export function ControlledSelect<FormType extends FieldValues>({
  name,
  label,
  rules,
  control,
  data = [],
  placeholder,
  loading = false,
  search = true,
  disabled = false,
  modalTitle = "Selecione uma opção",
  emptyText = "Nenhuma informação encontrada!",
  className = "",
}: ControlledSelectProps & UseControllerProps<FormType>) {
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

  const valueAsString = value ? String(value) : "";

  const optionById = useMemo(() => {
    const map = new Map<string, Option>();
    for (const item of data) {
      map.set(String(item.id), item);
    }
    return map;
  }, [data]);

  const selectedItem = useMemo(
    () => optionById.get(valueAsString),
    [optionById, valueAsString],
  );

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

  const handleSelect = useCallback(
    (itemId: string | number, isSelected: boolean) => {
      onChange(isSelected ? null : itemId);
      closeModal();
    },
    [onChange, closeModal],
  );

  const keyExtractor = useCallback((item: Option) => String(item.id), []);

  const renderItem = useCallback(
    ({ item }: { item: Option }) => {
      const isSelected = String(item.id) === valueAsString;

      return (
        <SelectItem
          item={item}
          isSelected={isSelected}
          onSelect={handleSelect}
        />
      );
    },
    [valueAsString, handleSelect],
  );

  return (
    <View className="flex-col gap-1">
      <Text className="font-medium text-foreground">
        {label}
        {rules?.required && <Text className="text-destructive"> *</Text>}
      </Text>
      <TouchableOpacity
        className={` ${className} flex-row items-center justify-between rounded-xl border p-3 ${
          disabled ? "bg-input-disabled" : "bg-input"
        } ${error ? "border-destructive" : "border-border"} `}
        onPress={openModal}
        disabled={disabled}
      >
        {!selectedItem && (
          <Text className="font-medium text-description">
            {loading ? "Carregando..." : placeholder}
          </Text>
        )}

        {selectedItem && (
          <Text className="flex-1 text-foreground">{selectedItem.name}</Text>
        )}
        <Icon name="chevron-down" size={16} className="color-primary" />
      </TouchableOpacity>
      {error?.message && (
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
          <FlatList
            data={filteredData}
            keyExtractor={keyExtractor}
            renderItem={renderItem}
            extraData={valueAsString}
            contentContainerStyle={{ gap: 16, flexGrow: 1 }}
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

export const SelectItem = memo(function SelectItem({
  item,
  isSelected,
  onSelect,
}: {
  item: Option;
  isSelected: boolean;
  onSelect: (itemId: string | number, isSelected: boolean) => void;
}) {
  return (
    <TouchableOpacity
      onPress={() => onSelect(item.id, isSelected)}
      className={`flex-row items-center justify-between  rounded-xl border bg-background p-3 ${
        isSelected ? "border-primary" : "border-border"
      }`}
    >
      <Text
        className={`flex-1 ${
          isSelected ? "font-bold text-primary" : "text-foreground"
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
