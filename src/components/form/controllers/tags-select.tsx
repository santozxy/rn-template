import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import React from "react";
import {
  Controller,
  type FieldValues,
  type UseControllerProps,
} from "react-hook-form";
import { View } from "@/components/ui/view";

interface TagItem {
  id: string;
  name: string;
}

interface ControlledTagsSelectProps {
  label?: string;
  data: TagItem[]; // recebe objetos com id e name
  containerClassName?: string;
}

export function ControlledTagsSelect<FormType extends FieldValues>({
  control,
  name,
  rules,
  label,
  data,
  containerClassName,
}: UseControllerProps<FormType> & ControlledTagsSelectProps) {
  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      render={({
        field: { value = [] as string[], onChange },
        fieldState: { error },
      }) => (
        <View className={containerClassName}>
          {label && (
            <Text className="mb-2 font-medium text-foreground">
              {label}
              {rules?.required && <Text className="text-destructive">*</Text>}
            </Text>
          )}

          <View className="flex-row flex-wrap gap-2">
            {data.map((tag) => {
              const isSelected = value.includes(tag.id);
              return (
                <Button
                  variant="unstyled"
                  size="content"
                  key={`${tag.id}`}
                  onPress={() => {
                    if (isSelected) {
                      onChange(value.filter((id: string) => id !== tag.id));
                    } else {
                      onChange([...value, tag.id]);
                    }
                  }}
                  className={`rounded-full px-3 py-2 ${
                    isSelected ? "bg-primary" : "border border-border bg-input"
                  }`}
                >
                  <Text
                    className={`text-sm ${
                      isSelected
                        ? "font-semibold text-primary-foreground"
                        : "text-foreground"
                    }`}
                  >
                    {tag.name}
                  </Text>
                </Button>
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
