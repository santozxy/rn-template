import { Button } from "@/components/ui/button";
import { useTheme } from "@/hooks/use-theme";
import { Eye, EyeOff, Lock, Search } from "lucide-react-native";
import React, { useState } from "react";
import { TextInput } from "react-native";
import { View } from "@/components/ui/view";

export interface InputProps extends React.ComponentProps<typeof TextInput> {
  hasError?: boolean;
  focusError?: boolean;
  textArea?: boolean;
  search?: boolean;
  rightComponent?: React.ReactNode;
}

export function Input({
  hasError,
  focusError,
  editable = true,
  textArea = false,
  search = false,
  rightComponent,
  secureTextEntry,
  onBlur,
  onFocus,
  ...props
}: InputProps) {
  const { colors } = useTheme();
  const [focused, setFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const invalid = hasError || focusError;

  return (
    <View className="relative">
      {search ? (
        <View className="absolute left-3 top-3 z-10">
          <Search color={colors.description} size={21} />
        </View>
      ) : null}
      <TextInput
        {...props}
        editable={editable}
        secureTextEntry={secureTextEntry && !showPassword}
        placeholderTextColor={colors.placeholder}
        selectionColor={colors.primary}
        multiline={textArea || props.multiline}
        textAlignVertical={textArea ? "top" : props.textAlignVertical}
        className={`${textArea ? "max-h-56 min-h-28 py-4" : "h-12"} rounded-xl border bg-input px-4 font-medium text-foreground ${search ? "pl-12" : ""} ${secureTextEntry || rightComponent || !editable ? "pr-12" : ""} ${
          invalid
            ? "border-destructive"
            : focused
              ? "border-primary"
              : "border-border-input"
        } ${editable ? "" : "bg-input-disabled opacity-60"}`}
        onFocus={(event) => {
          setFocused(true);
          onFocus?.(event);
        }}
        onBlur={(event) => {
          setFocused(false);
          onBlur?.(event);
        }}
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
