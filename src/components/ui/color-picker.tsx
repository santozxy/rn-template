import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import ReanimatedColorPicker, {
  HueSlider,
  Panel1,
  Preview,
  Swatches,
  type ColorFormatsObject,
} from "reanimated-color-picker";
import { Modal } from "./modal";
import { Text } from "./text";
import { View } from "@/components/ui/view";

const DEFAULT_COLOR = "#FDB913";

const DEFAULT_SWATCHES = [
  "#FDB913",
  "#0E8E49",
  "#0071BD",
  "#EE0133",
  "#FF8C00",
  "#673AB7",
  "#009688",
  "#607D8B",
  "#121212",
  "#9CA3AF",
];

interface ColorPickerProps {
  value?: string | null;
  onChange?: (color: string) => void;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  error?: string;
  modalTitle?: string;
  swatches?: string[];
}

export function ColorPicker({
  value,
  onChange,
  label,
  placeholder = "Selecione uma cor",
  disabled = false,
  error,
  modalTitle = "Selecionar cor",
  swatches = DEFAULT_SWATCHES,
}: ColorPickerProps) {
  const currentColor = normalizeColor(value);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [draftColor, setDraftColor] = useState(currentColor);

  useEffect(() => {
    if (!isModalVisible) {
      setDraftColor(currentColor);
    }
  }, [currentColor, isModalVisible]);

  const selectedLabel = useMemo(
    () => (value ? currentColor.toUpperCase() : placeholder),
    [currentColor, placeholder, value],
  );

  const openModal = useCallback(() => {
    if (!disabled) {
      setDraftColor(currentColor);
      setIsModalVisible(true);
    }
  }, [currentColor, disabled]);

  const closeModal = useCallback(() => {
    setIsModalVisible(false);
    setDraftColor(currentColor);
  }, [currentColor]);

  const handleColorChange = useCallback((colors: ColorFormatsObject) => {
    setDraftColor(normalizeColor(colors.hex));
  }, []);

  const handleConfirm = useCallback(() => {
    onChange?.(draftColor);
    setIsModalVisible(false);
  }, [draftColor, onChange]);

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
        <View className="flex-row items-center gap-3">
          <View
            className="h-5 w-5 rounded-full border border-border"
            style={{ backgroundColor: currentColor }}
          />
          <Text
            className={
              value ? "font-medium text-foreground" : "text-placeholder"
            }
          >
            {selectedLabel}
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
        <SafeAreaView className="flex-1 justify-between gap-6">
          <View className="gap-6">
            <ReanimatedColorPicker
              value={draftColor}
              onCompleteJS={handleColorChange}
              onChangeJS={handleColorChange}
              thumbShape="ring"
              boundedThumb
              style={{ gap: 18, width: "100%" }}
            >
              <Preview
                colorFormat="hex"
                disableOpacityTexture
                style={{ height: 48, borderRadius: 12 }}
                textStyle={{ fontWeight: "700" }}
              />
              <Panel1 style={{ height: 220, borderRadius: 16 }} />
              <HueSlider style={{ borderRadius: 12 }} />
              <Swatches
                colors={swatches}
                style={{ gap: 10, justifyContent: "flex-start" }}
                swatchStyle={{
                  width: 34,
                  height: 34,
                  borderRadius: 999,
                }}
              />
            </ReanimatedColorPicker>
            <View className="flex-row items-center gap-3 rounded-2xl border border-border bg-primary-light p-4">
              <View
                className="h-10 w-10 rounded-full border border-border"
                style={{ backgroundColor: draftColor }}
              />
              <View>
                <Text className="text-sm text-description">
                  Cor selecionada
                </Text>
                <Text className="font-semibold text-foreground">
                  {draftColor.toUpperCase()}
                </Text>
              </View>
            </View>
          </View>

          <View className="gap-3">
            <View className="flex-row gap-3">
              <Button variant="light" className="flex-1" onPress={closeModal}>
                Cancelar
              </Button>
              <Button className="flex-1" onPress={handleConfirm}>
                Aplicar cor
              </Button>
            </View>
          </View>
        </SafeAreaView>
      </Modal>
    </View>
  );
}

function normalizeColor(color?: string | null) {
  if (!color) return DEFAULT_COLOR;

  const trimmedColor = color.trim();
  if (!trimmedColor) return DEFAULT_COLOR;

  return trimmedColor.startsWith("#") ? trimmedColor : `#${trimmedColor}`;
}
