import { Button } from "@/components/ui/button";
import { View } from "@/components/ui/view";
import { useTheme } from "@/hooks/use-theme";
import { applyMask, removeMask, type MaskType } from "@/utils/masks";
import { Eye, EyeOff, Lock, Search } from "lucide-react-native";
import React, { useState } from "react";
import { TextInput } from "react-native";

export interface InputProps extends React.ComponentProps<typeof TextInput> {
  hasError?: boolean;
  focusError?: boolean;
  textArea?: boolean;
  search?: boolean;
  rightComponent?: React.ReactNode;
  mask?: MaskType;
  returnMasked?: boolean;
}

export function Input({
  hasError,
  focusError,
  editable = true,
  textArea = false,
  search = false,
  rightComponent,
  mask,
  returnMasked = false,
  secureTextEntry,
  value,
  maxLength,
  onChangeText,
  onBlur,
  onFocus,
  ...props
}: InputProps) {
  const { colors } = useTheme();
  const [focused, setFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const invalid = hasError || focusError;
  const inputClassName = `${textArea ? "max-h-56 min-h-28 py-4" : "h-12"} rounded-xl border bg-input px-4 font-medium text-foreground ${search ? "pl-12" : ""} ${secureTextEntry || rightComponent || !editable ? "pr-12" : ""} ${
    invalid
      ? "border-destructive"
      : focused
        ? "border-primary"
        : "border-border-input"
  } ${editable ? "" : "bg-input-disabled opacity-60"}`;

  const handleFocus: NonNullable<InputProps["onFocus"]> = (event) => {
    setFocused(true);
    onFocus?.(event);
  };

  const handleBlur: NonNullable<InputProps["onBlur"]> = (event) => {
    setFocused(false);
    onBlur?.(event);
  };

  const handleChangeText: NonNullable<InputProps["onChangeText"]> = (text) => {
    if (!mask) {
      onChangeText?.(text);
      return;
    }

    const unmaskedValue = removeMask(text, mask);
    onChangeText?.(
      returnMasked ? applyMask(unmaskedValue, mask) : unmaskedValue,
    );
  };

  const displayValue = mask ? applyMask(value ?? "", mask) : value;

  return (
    <View className="relative">
      {search ? (
        <View className="absolute left-3 top-3 z-10">
          <Search color={colors.description} size={21} />
        </View>
      ) : null}
      <TextInput
        {...props}
        value={displayValue}
        editable={editable}
        secureTextEntry={secureTextEntry && !showPassword}
        placeholderTextColor={colors.placeholder}
        selectionColor={colors.primary}
        multiline={textArea || props.multiline}
        textAlignVertical={textArea ? "top" : props.textAlignVertical}
        maxLength={mask ? (maxLength ?? mask.length) : maxLength}
        className={inputClassName}
        onChangeText={handleChangeText}
        onFocus={handleFocus}
        onBlur={handleBlur}
      />
      {rightComponent ? (
        <View className="absolute right-4 top-4">{rightComponent}</View>
      ) : null}
      {!editable && !rightComponent ? (
        <View className="absolute right-4 top-4">
          <Lock color={colors.description} size={21} />
        </View>
      ) : null}
      {secureTextEntry ? (
        <Button
          accessibilityLabel={showPassword ? "Ocultar senha" : "Mostrar senha"}
          variant="unstyled"
          size="content"
          hitSlop={10}
          className="absolute right-4 top-4"
          onPress={() => setShowPassword((current) => !current)}
        >
          {showPassword ? (
            <EyeOff color={colors.description} size={22} />
          ) : (
            <Eye color={colors.description} size={22} />
          )}
        </Button>
      ) : null}
    </View>
  );
}
