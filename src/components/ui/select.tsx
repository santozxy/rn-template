import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { useTheme } from "@/hooks/use-theme";
import { removeAccents } from "@/utils/text";
import React, { useCallback, useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Modal,
  Pressable,
  TouchableOpacity,
  View,
} from "react-native";
import { Search } from "./search";

export interface Option {
  id: string | number;
  name: string;
}

interface SelectProps {
  value?: string | number | null;
  data?: Option[];
  placeholder?: string;
  disabled?: boolean;
  loading?: boolean;
  search?: boolean;
  error?: boolean;
  title?: string;
  onChange: (value: string | number) => void;
}

export function Select({
  value,
  data = [],
  placeholder = "Selecione",
  disabled = false,
  loading = false,
  search = false,
  error = false,
  title,
  onChange,
}: SelectProps) {
  const { colors } = useTheme();
  const [modalVisible, setModalVisible] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [searchText, setSearchText] = useState("");

  const selected = data.find((item) => item.id === value);

  const filteredData = useMemo(() => {
    if (!search || !searchText) return data;
    const query = removeAccents(searchText.toLowerCase());
    return data.filter((item) =>
      removeAccents(item.name.toLowerCase()).includes(query),
    );
  }, [data, search, searchText]);

  const handleSelect = useCallback(
    (item: Option) => {
      onChange(item.id);
      setModalVisible(false);
      setIsFocused(false);
    },
    [onChange],
  );

  const renderItem = useCallback(
    ({ item }: { item: Option }) => {
      const isSelected = item.id === value;
      return (
        <SelectItem
          item={item}
          isSelected={isSelected}
          onPress={() => handleSelect(item)}
        />
      );
    },
    [handleSelect, value],
  );

  const closeModal = useCallback(() => {
    setModalVisible(false);
    setIsFocused(false);
  }, []);

  const keyExtractor = useCallback((item: Option) => String(item.id), []);

  return (
    <View>
      {title && (
        <Text className="mb-1 font-medium text-sm text-foreground">
          {title}
        </Text>
      )}
      <Pressable
        disabled={disabled}
        onPress={() => {
          if (!disabled && !loading) setModalVisible(true);
          setIsFocused(true);
        }}
        onBlur={() => setIsFocused(false)}
        onFocus={() => setIsFocused(true)}
      >
        <View
          className={`flex-row items-center justify-between rounded-xl border border-border p-3 ${
            disabled ? "bg-input-disabled" : "bg-input"
          }`}
          style={{
            borderColor: error
              ? colors.destructive
              : isFocused
                ? colors.primary
                : colors.border,
          }}
        >
          <Text
            className={`flex-1 ${
              selected ? "text-foreground" : "text-description"
            }`}
          >
            {loading ? "Carregando..." : selected?.name || placeholder}
          </Text>
          {disabled ? (
            <Icon name="lock" size={16} color={colors.description} />
          ) : (
            <Icon
              name={modalVisible ? "chevron-up" : "chevron-down"}
              size={16}
              color={colors.description}
            />
          )}
        </View>
      </Pressable>
      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={closeModal}
      >
        <Pressable
          onPress={closeModal}
          className="flex-1 items-center justify-center bg-black/40 px-6"
        >
          <Pressable
            className="h-96 w-full overflow-hidden rounded-2xl bg-background"
            onPress={(e) => e.stopPropagation()}
          >
            {search && (
              <View className="border-b border-border p-3">
                <Search
                  value={searchText}
                  loading={loading}
                  placeholder={"Pesquisar..."}
                  onChangeText={setSearchText}
                  debounceDelay={200}
                />
              </View>
            )}
            <View className="flex-1">
              {loading ? (
                <View className="flex-1 items-center justify-center py-10">
                  <ActivityIndicator color={colors.primary} />
                </View>
              ) : (
                <FlatList
                  data={filteredData}
                  renderItem={renderItem}
                  keyExtractor={keyExtractor}
                  extraData={value}
                  keyboardShouldPersistTaps="handled"
                  contentContainerStyle={{ gap: 12, padding: 12 }}
                  ListEmptyComponent={() => (
                    <View className="flex-1 items-center justify-center py-10">
                      <Text className="text-sm text-description">
                        Nenhum resultado encontrado
                      </Text>
                    </View>
                  )}
                />
              )}
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

function SelectItem({
  item,
  isSelected,
  onPress,
}: {
  /** Item exibido */
  item: Option;

  /** Indica se o item está selecionado */
  isSelected: boolean;

  /** Função chamada ao selecionar o item */
  onPress: () => void;
}) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className={`flex-row items-center justify-between rounded-2xl border p-4 ${
        isSelected
          ? "border-primary bg-secondary"
          : "border-border bg-background"
      }`}
    >
      <Text
        className={`flex-1 ${
          isSelected ? "font-bold text-primary" : "text-foreground"
        }`}
      >
        {item.name}
      </Text>

      {isSelected && (
        <Icon name="check-circle" size={18} className="color-primary" />
      )}
    </TouchableOpacity>
  );
}
