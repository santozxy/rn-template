import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Modal } from "@/components/ui/modal";
import { Text } from "@/components/ui/text";
import { View } from "@/components/ui/view";
import { useTheme } from "@/hooks/use-theme";
import DateTimePicker from "@expo/ui/community/datetime-picker";
import { format, isValid, parse, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useState } from "react";
import {
  type FieldValues,
  type UseControllerProps,
  useController,
} from "react-hook-form";

export type DatePickerMode = "date" | "time" | "datetime";

interface ControlledDatePickerProps {
  label: string;
  mode?: DatePickerMode;
  title?: string;
  placeholder?: string;
  minimumDate?: Date;
  maximumDate?: Date;
  disabled?: boolean;
  className?: string;
}

function parseValue(value: unknown, mode: DatePickerMode) {
  if (value instanceof Date) {
    return isValid(value) ? value : null;
  }

  if (typeof value !== "string" || !value) return null;

  const parsedValue =
    mode === "time" ? parse(value, "HH:mm", new Date()) : parseISO(value);

  return isValid(parsedValue) ? parsedValue : null;
}

function formatValue(value: unknown, mode: DatePickerMode) {
  if (!value) return null;

  const date = parseValue(value, mode);
  if (!date) return null;

  switch (mode) {
    case "time":
      return format(date, "HH:mm", { locale: ptBR });
    case "datetime":
      return format(date, "dd/MM/yyyy 'às' HH:mm", { locale: ptBR });
    default:
      return format(date, "dd/MM/yyyy", { locale: ptBR });
  }
}

function serializeValue(value: Date, mode: DatePickerMode) {
  switch (mode) {
    case "time":
      return format(value, "HH:mm");
    case "datetime":
      return format(value, "yyyy-MM-dd'T'HH:mm:ss");
    default:
      return format(value, "yyyy-MM-dd");
  }
}

function getPlaceholder(mode: DatePickerMode) {
  switch (mode) {
    case "time":
      return "Selecione um horário";
    case "datetime":
      return "Selecione data e horário";
    default:
      return "Selecione uma data";
  }
}

export function ControlledDatePicker<FormType extends FieldValues>({
  control,
  name,
  rules,
  label,
  mode = "date",
  title = label,
  placeholder = getPlaceholder(mode),
  minimumDate,
  maximumDate,
  disabled = false,
  className,
}: UseControllerProps<FormType> & ControlledDatePickerProps) {
  const { colors, theme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [draftValue, setDraftValue] = useState(new Date());
  const {
    field: { onChange, value },
    fieldState: { error },
  } = useController({ control, name, rules });
  const displayedValue = formatValue(value, mode);

  const openPicker = () => {
    setDraftValue(parseValue(value, mode) ?? new Date());
    setIsOpen(true);
  };

  const closePicker = () => setIsOpen(false);

  return (
    <View className={`gap-2 ${className ?? ""}`}>
      <Text className="font-semibold" selectable>
        {label}
        {rules?.required ? <Text className="text-destructive"> *</Text> : null}
      </Text>

      <Button
        variant="unstyled"
        size="content"
        disabled={disabled}
        accessibilityLabel={`${label}: ${displayedValue ?? placeholder}`}
        onPress={openPicker}
        className={`flex-row items-center justify-between rounded-xl border p-3 ${
          disabled ? "bg-input-disabled" : "bg-input"
        } ${error ? "border-destructive" : "border-border"}`}
      >
        <Text
          className={`flex-1 ${displayedValue ? "text-foreground" : "text-description"}`}
        >
          {displayedValue ?? placeholder}
        </Text>
        <Icon name="chevron-down" size={16} color={colors.description} />
      </Button>

      {error?.message ? (
        <Text
          accessibilityRole="alert"
          className="text-sm text-destructive"
          selectable
        >
          {error.message}
        </Text>
      ) : null}

      <Modal visible={isOpen} onClose={closePicker}>
        <View className="gap-5">
          <Text className="font-bold text-lg">{title}</Text>

          <DateTimePicker
            value={draftValue}
            mode={mode}
            presentation="inline"
            display="spinner"
            is24Hour
            locale="pt_BR"
            minimumDate={minimumDate}
            maximumDate={maximumDate}
            accentColor={colors.primary}
            themeVariant={theme}
            style={{ height: mode === "time" ? 180 : 320 }}
            onValueChange={(_event, selectedValue) =>
              setDraftValue(selectedValue)
            }
          />

          <View className="flex-row gap-3">
            <Button className="flex-1" variant="outline" onPress={closePicker}>
              Cancelar
            </Button>
            <Button
              className="flex-1"
              onPress={() => {
                onChange(serializeValue(draftValue, mode));
                closePicker();
              }}
            >
              Aplicar
            </Button>
          </View>
        </View>
      </Modal>
    </View>
  );
}
