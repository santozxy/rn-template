import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Input } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { View } from "@/components/ui/view";
import { useTheme } from "@/hooks/use-theme";
import { type MaskType } from "@/utils/masks";
import React from "react";
import {
  Control,
  FieldValues,
  Path,
  useController,
  useFormContext,
} from "react-hook-form";
import { ActivityIndicator, ViewProps } from "react-native";

export interface ControlledSearchInputProps<T extends FieldValues> extends Omit<
  ViewProps,
  "style"
> {
  name: Path<T>;
  control?: Control<T>;
  label?: string;
  rules?: any;
  load?: boolean;
  mask?: MaskType;
  isUppercase?: boolean;
  placeHolder?: string;
  keyboardType?: "default" | "numeric" | "email-address" | "number-pad";
  onSearch?: () => void;
  disabled?: boolean;
  maxLength?: number; // 👈 Adicionado aqui
  rightComponent?: React.ReactNode;
}

export function ControlledSearchInput<T extends FieldValues>({
  name,
  control,
  label,
  rules,
  load = false,
  mask,
  isUppercase = false,
  placeHolder,
  keyboardType = "default",
  onSearch,
  disabled = false,
  maxLength, // 👈 Extraído das props
  rightComponent,
  ...rest
}: ControlledSearchInputProps<T>) {
  const { colors } = useTheme();

  const formContext = useFormContext<T>();
  const activeControl = control || formContext?.control;

  if (!activeControl) {
    throw new Error(
      "ControlledSearchInput deve ser usado dentro de um FormProvider ou receber a prop 'control'",
    );
  }

  const {
    field: { onChange, value },
    fieldState: { error },
  } = useController({
    name,
    control: activeControl,
    rules,
  });

  // Garante que o valor é uma string para não quebrar a contagem
  const stringValue = (value as string) || "";

  return (
    <View className="gap-1" {...rest}>
      <View className="flex-row items-center justify-between">
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
      <Input
        value={stringValue}
        mask={mask}
        placeholder={placeHolder}
        editable={!disabled}
        keyboardType={keyboardType}
        hasError={Boolean(error)}
        maxLength={maxLength}
        autoCapitalize={isUppercase ? "characters" : "none"}
        onChangeText={(text) => {
          let newValue = text;
          if (isUppercase) {
            newValue = text.toUpperCase();
          }
          onChange(newValue);
        }}
        rightComponent={
          <Button
            variant="unstyled"
            size="content"
            className="h-full w-12 items-center justify-center rounded-r-2xl"
            disabled={disabled || load}
            onPress={onSearch}
            testID={`search-button-${name}`}
          >
            {load ? (
              <ActivityIndicator color={colors.primary} size="small" />
            ) : (
              <Icon
                name="search"
                size={22}
                color={disabled ? colors.description : colors.foreground}
              />
            )}
          </Button>
        }
      />

      {/* Container inferior para alinhar a mensagem de erro e o contador */}
      <View className="mt-1 flex-row items-start justify-between px-1">
        <View className="flex-1 pr-2">
          {error?.message && (
            <Text className="text-sm text-destructive">{error.message}</Text>
          )}
        </View>
      </View>
    </View>
  );
}
