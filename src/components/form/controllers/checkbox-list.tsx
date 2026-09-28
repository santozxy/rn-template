import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import {
  Controller,
  type FieldValues,
  type UseControllerProps,
} from "react-hook-form";
import { View } from "@/components/ui/view";

interface CheckboxOption {
  name: string;
  id: string | number;
}

interface CheckboxListProps {
  label?: string;
  options: CheckboxOption[];
}

export function ControlledCheckboxList<FormType extends FieldValues>({
  name,
  label,
  options,
  control,

  rules,
}: CheckboxListProps & UseControllerProps<FormType>) {
  return (
    <Controller
      name={name}
      rules={rules}
      control={control}
      render={({ field: { onChange, value }, fieldState: { error } }) => (
        <View className="flex-col gap-2">
          {label && (
            <Text className="font-medium text-foreground">
              {rules?.required && <Text className="text-destructive">*</Text>}{" "}
              {label}
            </Text>
          )}
          <View className="flex-row items-center gap-4">
            {options.map((option) => (
              <Button
                variant="unstyled"
                size="content"
                key={option.id}
                onPress={() => {
                  if (value === option.id) {
                    onChange(null);
                  } else {
                    onChange(option.id);
                  }
                }}
                className="mb-2 flex-row items-center"
                activeOpacity={0.8}
              >
                {value === option.id ? (
                  <View className="mr-2 h-6 w-6 items-center justify-center rounded-md border border-border bg-primary">
                    <Icon
                      name="check"
                      size={16}
                      className="color-primary-foreground"
                    />
                  </View>
                ) : (
                  <View className="mr-2 h-6 w-6 items-center justify-center rounded-md border border-border bg-input" />
                )}
                <Text className="text-foreground">{option.name}</Text>
              </Button>
            ))}
          </View>
          {error?.message && (
            <Text className="text-sm text-destructive">{error.message}</Text>
          )}
        </View>
      )}
    />
  );
}
