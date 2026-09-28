import { OTPInput } from "@/components/ui/input-otp";
import { Text } from "@/components/ui/text";
import {
  Controller,
  type FieldValues,
  type UseControllerProps,
} from "react-hook-form";
import { View } from "@/components/ui/view";

interface ControlledOTPInputProps {
  label?: string;
  containerClassName?: string;
  length?: number;
  disabled?: boolean;
}

export function ControlledOTPInput<FormType extends FieldValues>({
  control,
  name,
  rules,
  label,
  containerClassName,
  length = 6,
  disabled = false,
}: UseControllerProps<FormType> & ControlledOTPInputProps) {
  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <View className={containerClassName}>
          {label && (
            <Text className="mb-2 font-medium text-foreground">
              {rules?.required && <Text className="text-destructive">*</Text>}{" "}
              {label}
            </Text>
          )}

          <OTPInput
            value={value || ""}
            onChange={onChange}
            length={length}
            focusError={!!error}
            disabled={disabled}
          />

          {error?.message && (
            <Text className="text-sm text-destructive">{error.message}</Text>
          )}
        </View>
      )}
    />
  );
}
