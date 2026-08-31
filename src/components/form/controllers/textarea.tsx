import { Input, type InputProps } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import {
  Controller,
  type FieldValues,
  type UseControllerProps,
} from "react-hook-form";
import { View } from "react-native";

interface ControlledTextAreaProps {
  label?: string;
  containerClassName?: string;
  leftLabelIconComponent?: React.ReactNode;
}

export function ControlledTextArea<FormType extends FieldValues>({
  control,
  name,
  rules,
  label,
  containerClassName,
  rightComponent,
  leftLabelIconComponent,
  ...textInputProps
}: UseControllerProps<FormType> &
  Omit<InputProps, "textArea"> &
  ControlledTextAreaProps) {
  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      render={({
        field: { onChange, onBlur, value },
        fieldState: { error },
      }) => {
        const currentLength = value ? value.length : 0;
        const maxLength = textInputProps.maxLength ?? 0;
        let counterColor = "text-primary";
        if (maxLength) {
          const ratio = currentLength / maxLength;
          if (ratio >= 1) counterColor = "text-destructive";
          else if (ratio >= 1 / 3) counterColor = "text-warning";
        }

        return (
          <View className={containerClassName}>
            <View className="mb-2 flex-row justify-between">
              {label && (
                <View className="flex-row items-center gap-2">
                  {leftLabelIconComponent && leftLabelIconComponent}
                  <Text className="font-medium text-foreground">
                    {label}{" "}
                    {rules?.required && (
                      <Text className="text-destructive">*</Text>
                    )}
                  </Text>
                </View>
              )}
              <View className="flex-1 flex-row items-center justify-end">
                {rightComponent && <View>{rightComponent}</View>}
              </View>
            </View>

            <Input
              {...textInputProps}
              textArea
              multiline
              scrollEnabled={false}
              onChangeText={onChange}
              value={value}
              focusError={!!error}
              rightComponent={rightComponent}
            />
            <View
              className={`flex-row items-center ${error?.message ? "justify-between" : "justify-end"}`}
            >
              {error?.message && (
                <Text className="text-sm text-destructive">
                  {error.message}
                </Text>
              )}
              {maxLength > 0 && (
                <Text className={`${counterColor}`}>
                  ({currentLength}/{maxLength})
                </Text>
              )}
            </View>
          </View>
        );
      }}
    />
  );
}
