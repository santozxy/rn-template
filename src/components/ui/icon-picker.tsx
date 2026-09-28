import { Button } from "@/components/ui/button";
import {
  Icon,
  iconNames,
  isIconName,
  type IconName,
} from "@/components/ui/icon";
import { Search } from "@/components/ui/search";
import { memo, useCallback, useMemo, useState } from "react";
import { FlatList } from "react-native";
import { Modal } from "./modal";
import { Text } from "./text";
import { View } from "@/components/ui/view";

const DEFAULT_ICON: IconName = "tag-outline";

const INITIAL_ICON_LIMIT = 100;

interface IconPickerProps {
  value?: string | null;
  onChange?: (icon: string) => void;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  error?: string;
  modalTitle?: string;
}

export function IconPicker({
  value,
  onChange,
  label,
  placeholder = "Selecione um ícone",
  disabled = false,
  error,
  modalTitle = "Selecionar ícone",
}: IconPickerProps) {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [searchText, setSearchText] = useState("");
  const selectedIcon = normalizeIconName(value);
  const hasSelectedIcon = Boolean(value && selectedIcon);

  const filteredIcons = useMemo(() => {
    const normalizedSearch = searchText.trim().toLowerCase();
    if (!normalizedSearch) {
      return iconNames.slice(0, INITIAL_ICON_LIMIT);
    }

    return iconNames.filter((icon) =>
      icon.toLowerCase().includes(normalizedSearch),
    );
  }, [searchText]);

  const openModal = useCallback(() => {
    if (!disabled) {
      setIsModalVisible(true);
    }
  }, [disabled]);

  const closeModal = useCallback(() => {
    setIsModalVisible(false);
    setSearchText("");
  }, []);

  const handleSelectIcon = useCallback(
    (icon: IconName) => {
      onChange?.(icon);
      closeModal();
    },
    [closeModal, onChange],
  );

  const renderItem = useCallback(
    ({ item }: { item: IconName }) => (
      <IconOption
        icon={item}
        selected={item === selectedIcon}
        onPress={handleSelectIcon}
      />
    ),
    [handleSelectIcon, selectedIcon],
  );

  return (
    <View className="gap-1">
      {label && (
        <Text className="font-medium text-foreground" numberOfLines={1}>
          {label}
        </Text>
      )}

      <Button
        variant="unstyled"
        size="content"
        activeOpacity={0.75}
        disabled={disabled}
        onPress={openModal}
        className={`flex-row items-center justify-between rounded-xl border p-3 ${
          disabled ? "bg-input-disabled" : "bg-input"
        } ${error ? "border-destructive" : "border-border"}`}
      >
        <View className="flex-1 flex-row items-center gap-3">
          <View className="h-5 w-5 items-center justify-center rounded-full bg-primary-light">
            <Icon
              name={selectedIcon ?? DEFAULT_ICON}
              size={18}
              className="text-primary"
            />
          </View>
          <Text
            className={
              hasSelectedIcon
                ? "flex-1 text-foreground"
                : "flex-1 text-placeholder"
            }
            numberOfLines={1}
          >
            {hasSelectedIcon ? selectedIcon : placeholder}
          </Text>
        </View>

        <Icon name="chevron-down" size={18} className="text-description" />
      </Button>

      {error && <Text className="text-sm text-destructive">{error}</Text>}

      <Modal
        visible={isModalVisible}
        onClose={closeModal}
        type="full"
        title={modalTitle}
      >
        <View className="flex-1 gap-4">
          <Search
            value={searchText}
            onChangeText={setSearchText}
            debounceDelay={150}
            placeholder="Pesquisar ícone..."
            autoCapitalize="none"
          />

          <View className="flex-row items-center gap-3 rounded-2xl border border-border bg-primary-light p-4">
            <View className="h-5 w-5 items-center justify-center rounded-full bg-primary/15">
              <Icon
                name={selectedIcon ?? DEFAULT_ICON}
                size={18}
                className="text-primary"
              />
            </View>
            <View className="flex-1">
              <Text className="text-sm text-description">
                Ícone selecionado
              </Text>
              <Text className="font-semibold text-foreground" numberOfLines={1}>
                {hasSelectedIcon ? selectedIcon : "Nenhum ícone selecionado"}
              </Text>
            </View>
          </View>

          <FlatList
            data={filteredIcons}
            renderItem={renderItem}
            keyExtractor={(item) => item}
            numColumns={4}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            initialNumToRender={40}
            maxToRenderPerBatch={48}
            windowSize={9}
            columnWrapperStyle={{ gap: 10 }}
            contentContainerStyle={{ gap: 10, paddingBottom: 24 }}
            ListEmptyComponent={
              <Text className="mt-8 text-center text-description">
                Nenhum ícone encontrado
              </Text>
            }
          />

          <Button variant="light" onPress={closeModal}>
            Fechar
          </Button>
        </View>
      </Modal>
    </View>
  );
}

const IconOption = memo(function IconOption({
  icon,
  selected,
  onPress,
}: {
  icon: IconName;
  selected: boolean;
  onPress: (icon: IconName) => void;
}) {
  return (
    <Button
      variant="unstyled"
      size="content"
      activeOpacity={0.75}
      onPress={() => onPress(icon)}
      className={`flex-1 items-center gap-2 rounded-2xl border p-3 ${
        selected ? "border-primary bg-primary" : "border-border bg-background"
      }`}
    >
      <Icon
        name={icon}
        size={24}
        className={selected ? "text-primary-foreground" : "text-foreground"}
      />
      <Text
        className={`text-center text-xs ${
          selected ? "text-primary-foreground" : "text-description"
        }`}
        numberOfLines={1}
      >
        {icon}
      </Text>
    </Button>
  );
});

function normalizeIconName(value?: string | null) {
  if (!value) return null;

  const icon = value.trim();
  if (!icon || !isIconName(icon)) return null;

  return icon;
}
