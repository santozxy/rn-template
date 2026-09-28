import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import React, { useState } from "react";
import {
  Controller,
  type FieldValues,
  type UseControllerProps,
} from "react-hook-form";
import { View } from "@/components/ui/view";

interface ControlledArrayInputProps {
  label?: string;
  placeholder?: string;
  containerClassName?: string;
  buttonLabel?: string;
}

export function ControlledArrayInput<FormType extends FieldValues>({
  control,
  name,
  rules,
  label,
  placeholder,
  containerClassName,
}: UseControllerProps<FormType> & ControlledArrayInputProps) {
  const [text, setText] = useState("");

  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      render={({
        field: { value = [] as string[], onChange },
        fieldState: { error },
      }) => {
        const handleTextChange = (input: string) => {
          if (input.includes(",")) {
            const items = input
              .split(",")
              .map((t) => t.trim())
              .filter((t) => t.length > 0 && !value.includes(t));

            if (items.length > 0) {
              onChange([...value, ...items]);
            }
            const lastPart = input.split(",").pop() || "";
            setText(lastPart);
          } else {
            setText(input);
          }
        };

        return (
          <View className={containerClassName}>
            {label && (
              <Text className="mb-2 font-medium text-foreground">
                {label}
                {rules?.required && <Text className="text-destructive">*</Text>}
              </Text>
            )}

            <Input
              placeholder={placeholder}
              value={text}
              onChangeText={handleTextChange}
              returnKeyType="done"
            />

            {Array.isArray(value) && value.length > 0 && (
              <View className="mt-3 flex-row flex-wrap gap-2">
                {value.map((item: string, index: number) => (
                  <Button
                    variant="unstyled"
                    size="content"
                    onPress={() =>
                      onChange(value.filter((_, i) => i !== index))
                    }
                    key={`${item}-${index}`}
                    className="flex-row items-center rounded-full border border-border bg-secondary px-3 py-1.5"
                  >
                    <Text className="mr-2 text-foreground">{item}</Text>
                    <Icon name="x" size={14} className="text-destructive" />
                  </Button>
                ))}
              </View>
            )}

            {error?.message && (
              <Text className="text-sm text-destructive">{error.message}</Text>
            )}
          </View>
        );
      }}
    />
  );
}
