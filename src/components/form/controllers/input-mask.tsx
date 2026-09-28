import { InputProps } from "@/components/ui/input";
import { MaskInput } from "@/components/ui/mask-input";
import { Text } from "@/components/ui/text";
import { Controller, FieldValues, UseControllerProps } from "react-hook-form";
import { MaskInputProps } from "react-native-mask-input";
import { View } from "@/components/ui/view";

interface ControlledMaskInputProps extends MaskInputProps {
  label: string;
  returnMasked?: boolean;
  rightComponent?: React.ReactNode;
}

export function ControlledMaskInput<FormType extends FieldValues>({
  control,
  name,
  rules,
  label,
  returnMasked = false,
  rightComponent, // Garantir que está aqui
  ...textInputProps
}: UseControllerProps<FormType> & InputProps & ControlledMaskInputProps) {
  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      render={({
        field: { onChange, onBlur, value },
        fieldState: { error },
      }) => {
        return (
          <View className="flex-1 flex-col gap-1">
            <Text className="font-medium text-foreground">
              {label}
              {rules?.required && <Text className="text-destructive"> *</Text>}
            </Text>

            {/* Passamos o rightComponent direto para o MaskInput.
              O MaskInput (seu componente UI) deve saber renderizá-lo 
              (como fizemos no MaskInput da seção anterior).
            */}
            <MaskInput
              value={value ?? ""}
              onChangeText={(masked, unmasked) =>
                onChange(returnMasked ? masked : unmasked || "")
              }
              onBlur={onBlur}
              focusError={!!error}
              rightComponent={rightComponent} // <--- AQUI A MÁGICA
              {...textInputProps}
            />

            {error?.message && (
              <Text className="text-sm text-destructive">{error.message}</Text>
            )}
          </View>
        );
      }}
    />
  );
}
