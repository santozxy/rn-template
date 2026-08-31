import { Text } from "@/components/ui/text";
import { useTheme } from "@/hooks/use-theme";
import React from "react";
import { Controller, FieldValues, UseControllerProps } from "react-hook-form";
import { Pressable, TextStyle, View, ViewStyle } from "react-native";

export interface RadioButtonOption {
  id: string | number;
  name: string;
  color?: string;
}

export interface ControlledRadioGroupProps {
  label?: string;
  layout?: "row" | "column";
  size?: number;
  options: RadioButtonOption[];
  containerStyle?: ViewStyle;
  radioSize?: number;
  textStyle?: TextStyle;
}

export function ControlledRadioGroup<T extends FieldValues>({
  control,
  name,
  rules,
  label,
  layout = "row",
  size = 14,
  options,
  containerStyle,
  radioSize,
  textStyle,
}: ControlledRadioGroupProps & UseControllerProps<T>) {
  const { colors } = useTheme();
  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <View className="flex-col gap-1" style={containerStyle}>
          {label && (
            <Text className="font-medium text-foreground">
              {label}
              {rules?.required && <Text className="text-destructive"> *</Text>}
            </Text>
          )}

          <View
            className={`flex ${
              layout === "row" ? "flex-row flex-wrap gap-3" : "flex-col gap-3"
            }`}
          >
            {options.map((option) => {
              const isSelected = value === option.id;
              const activeColor = option.color || colors.primary;

              return (
                <Pressable
                  key={option.id}
                  onPress={() => onChange(option.id)}
                  className={`flex-row items-center gap-2 rounded-2xl border bg-input p-2 ${
                    layout === "column" ? "w-full" : ""
                  } ${
                    isSelected
                      ? "border-primary"
                      : error
                        ? "border-destructive"
                        : "border-border"
                  }`}
                  testID={`radio-${name}-${option.id}`}
                >
                  <View
                    style={{
                      width: radioSize || 16,
                      height: radioSize || 16,
                      borderRadius: (radioSize || 16) / 2,
                      borderWidth: 2,
                      borderColor: isSelected ? activeColor : colors.border,
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {isSelected && (
                      <View
                        style={{
                          width: size * 0.5,
                          height: size * 0.5,
                          borderRadius: (size * 0.5) / 2,
                          backgroundColor: activeColor,
                        }}
                      />
                    )}
                  </View>

                  <Text
                    className={`font-medium text-sm ${
                      isSelected ? "text-primary" : "text-foreground"
                    }`}
                    style={textStyle}
                  >
                    {option.name}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          {error?.message && (
            <Text className="text-sm text-destructive">{error.message}</Text>
          )}
        </View>
      )}
    />
  );
}
