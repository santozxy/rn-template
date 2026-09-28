import { Input, type InputProps } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import {
  Controller,
  type FieldValues,
  type UseControllerProps,
} from "react-hook-form";
import { View } from "@/components/ui/view";

interface ControlledInputProps {
  label: string;
}

export function ControlledInput<FormType extends FieldValues>({
  control,
  label,
  name,
  rules,
  ...inputProps
}: UseControllerProps<FormType> & InputProps & ControlledInputProps) {
  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      render={({
        field: { onBlur, onChange, value },
        fieldState: { error },
      }) => (
        <View className="gap-2">
          <Text className="font-semibold" selectable>
            {label}
            {rules?.required ? (
              <Text className="text-destructive"> *</Text>
            ) : null}
          </Text>
          <Input
            {...inputProps}
            value={value ?? ""}
            hasError={Boolean(error)}
            onBlur={onBlur}
            onChangeText={onChange}
          />
          {error?.message ? (
            <Text
              accessibilityRole="alert"
              className="text-sm text-destructive"
              selectable
            >
              {error.message}
            </Text>
          ) : null}
        </View>
      )}
    />
  );
}
