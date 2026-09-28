import { Switch } from "@/components/ui/switch"; // Ajuste o caminho se necessário
import { Text } from "@/components/ui/text";
import React from "react";
import {
  FieldValues,
  useController,
  UseControllerProps,
} from "react-hook-form";
import { View } from "@/components/ui/view";

interface ControlledSwitchProps<
  FormType extends FieldValues,
> extends UseControllerProps<FormType> {
  label: string;
  disabled?: boolean;
  activeColor?: string;
  inactiveColor?: string;
  thumbColor?: string;
  icon?: React.ReactNode;
}

export function ControlledSwitch<FormType extends FieldValues>({
  name,
  control,
  rules,
  label,
  ...switchProps
}: ControlledSwitchProps<FormType>) {
  const {
    field: { value, onChange },
    fieldState: { error },
  } = useController({
    name,
    control,
    rules,
  });

  return (
    <View className="gap-1 py-1">
      <View className="flex-row items-center justify-between">
        <Text className="font-medium text-foreground">{label}</Text>
        <Switch
          value={!!value} // Força o valor a ser booleano
          onValueChange={onChange}
          {...switchProps}
        />
      </View>

      {/* Exibe mensagem de erro caso exista alguma regra de validação */}
      {error && (
        <Text className="text-sm text-destructive">{error.message}</Text>
      )}
    </View>
  );
}
