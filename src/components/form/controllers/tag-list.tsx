import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Input, type InputProps } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import React, { useState } from "react";
import {
  Controller,
  type FieldValues,
  type UseControllerProps,
} from "react-hook-form";
import { Alert } from "react-native";
import { View } from "@/components/ui/view";

interface ControlledTagListProps extends InputProps {
  label: string;
  title?: string;
  emptyMessage?: string;
  containerClassName?: string;
  maxTags?: number;
  allowDuplicates?: boolean;
  addButtonText?: string;
}

// Sub-componente para a Tag visual
const TagItem = ({
  label,
  onRemove,
}: {
  label: string;
  onRemove: () => void;
}) => (
  <Button
    variant="unstyled"
    size="content"
    onPress={onRemove}
    className="flex-row items-center gap-2 rounded-full border border-border bg-secondary px-4 py-2"
    activeOpacity={0.7}
  >
    <Text className="font-medium text-foreground" numberOfLines={1}>
      {label}
    </Text>
    <Icon name="x" size={14} className="text-destructive" />
  </Button>
);

export function ControlledTagList<FormType extends FieldValues>({
  control,
  name,
  rules,
  title,
  emptyMessage = "Nenhuma tag adicionada",
  label,
  containerClassName,
  maxTags,
  allowDuplicates = false,
  addButtonText = "Adicionar",
  ...textInputProps
}: UseControllerProps<FormType> & ControlledTagListProps) {
  const [input, setInput] = useState("");

  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      render={({ field: { onChange, value }, fieldState: { error } }) => {
        const tags: string[] = value || [];

        const handleAdd = () => {
          const trimmed = input.trim().toUpperCase();
          if (!trimmed) return;
          if (!allowDuplicates && tags.includes(trimmed)) {
            Alert.alert("Atenção", "Esta tag já foi adicionada");
            return;
          }
          if (maxTags && tags.length >= maxTags) {
            Alert.alert("Limite", `Máximo de ${maxTags} tags permitidas`);
            return;
          }
          onChange([...tags, trimmed]);
          setInput("");
        };

        return (
          <View className={containerClassName}>
            <Text className="mb-2 font-semibold text-base text-foreground">
              {rules?.required && <Text className="text-destructive">* </Text>}
              {label}
              {maxTags && (
                <Text className="text-sm text-description">
                  {" "}
                  ({tags.length}/{maxTags})
                </Text>
              )}
            </Text>

            <View className="mb-3 flex-row items-center gap-2">
              <View className="flex-1">
                <Input
                  {...textInputProps}
                  value={input}
                  onChangeText={setInput}
                  onSubmitEditing={handleAdd}
                  placeholder={textInputProps.placeholder || "Digite..."}
                  focusError={!!error}
                  autoCapitalize="characters"
                />
              </View>
              <Button
                variant="unstyled"
                size="content"
                onPress={handleAdd}
                disabled={!input.trim()}
                className="flex-row items-center justify-center rounded-xl bg-primary px-4 py-3 disabled:opacity-50"
              >
                <Text className="font-bold text-primary-foreground">
                  {addButtonText}
                </Text>
              </Button>
            </View>

            <View className="mb-2 flex-row flex-wrap gap-2">
              {tags.length > 0 ? (
                tags.map((tag, index) => (
                  <TagItem
                    key={`${tag}-${index}`}
                    label={tag}
                    onRemove={() =>
                      onChange(tags.filter((_, i) => i !== index))
                    }
                  />
                ))
              ) : (
                <View className="w-full items-center rounded-xl border border-dashed border-border p-4">
                  <Text className="text-sm text-foreground">
                    {emptyMessage}
                  </Text>
                </View>
              )}
            </View>

            {error && (
              <Text className="mt-1 text-sm text-destructive">
                {error.message}
              </Text>
            )}
          </View>
        );
      }}
    />
  );
}
