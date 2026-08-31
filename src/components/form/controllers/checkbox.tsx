import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import {
  Controller,
  type FieldValues,
  type UseControllerProps,
} from "react-hook-form";
import { TouchableOpacity, View } from "react-native";

interface CheckboxProps {
  label?: string;
}

export function ControlledCheckbox<FormType extends FieldValues>({
  name,
  label,
  control,
  rules,
  disabled,
}: CheckboxProps & UseControllerProps<FormType>) {
  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <View className="flex-col gap-2">
          <TouchableOpacity
            onPress={() => onChange(!value)}
            className="flex-row items-center"
            activeOpacity={0.8}
            disabled={disabled}
          >
            {value ? (
              <View className="mr-2 h-6 w-6 items-center justify-center rounded-md border border-border bg-primary">
                <Icon
                  name="check"
                  size={16}
                  className="color-primary-foreground"
                />
              </View>
            ) : (
              <View
                className={`mr-2 h-6 w-6 items-center justify-center rounded-md border border-border ${
                  disabled ? "bg-input-disabled" : "bg-input"
                }`}
              />
            )}
            {label && (
              <Text className="text-foreground">
                {rules?.required && <Text className="text-destructive">*</Text>}{" "}
                {label}
              </Text>
            )}
          </TouchableOpacity>

          {error?.message && (
            <Text className="mt-1 text-sm text-red-500">{error.message}</Text>
          )}
        </View>
      )}
    />
  );
}
