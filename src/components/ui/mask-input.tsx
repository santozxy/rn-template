// src/components/ui/mask-input.tsx
import { Icon } from "@/components/ui/icon";
import { useTheme } from "@/hooks/use-theme";
import React, { useState } from "react";
import { Pressable, View } from "react-native";
import MaskInputLib from "react-native-mask-input";

export interface MaskInputProps extends React.ComponentProps<
  typeof MaskInputLib
> {
  focusError?: boolean;
  search?: boolean;
  rightComponent?: React.ReactNode;
}

export function MaskInput({
  focusError = false,
  search = false,
  rightComponent,
  secureTextEntry,
  editable = true,
  ...props
}: MaskInputProps) {
  const { colors } = useTheme();
  const [focused, setFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View className="relative justify-center">
      {search && (
        <Icon
          name="search"
          size={20}
          className="absolute left-3 top-3.5 z-10 color-description"
        />
      )}

      <MaskInputLib
        {...props}
        secureTextEntry={secureTextEntry && !showPassword}
        editable={editable}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        className={`rounded-xl border p-3 font-medium text-foreground ${
          editable ? "bg-input" : "bg-input-disabled"
        } ${
          focusError
            ? "border-destructive"
            : focused
              ? "border-primary"
              : "border-border"
        } ${search ? "pl-11" : ""} ${rightComponent ? "pr-12" : ""}`}
        placeholderTextColor={colors.description}
      />

      {/* RENDERIZAÇÃO ÚNICA DO RIGHT COMPONENT */}
      {rightComponent && (
        <View className="absolute right-3 z-10">{rightComponent}</View>
      )}

      {!editable && !rightComponent && (
        <Icon
          name="lock"
          size={20}
          className="absolute right-3 top-3.5 z-10 color-description"
        />
      )}

      {secureTextEntry && (
        <Pressable
          className="absolute right-3 top-3.5 z-10"
          onPress={() => setShowPassword((prev) => !prev)}
        >
          <Icon
            name={showPassword ? "eye" : "eye-off"}
            size={20}
            className="color-description"
          />
        </Pressable>
      )}
    </View>
  );
}
