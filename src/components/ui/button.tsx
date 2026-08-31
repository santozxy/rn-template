import {
  buttonSizeStyles,
  buttonVariantStyles,
  type ButtonSize,
  type ButtonVariant,
} from "@/theme/variants/button";
import React from "react";
import { ActivityIndicator, TouchableOpacity, View } from "react-native";
import { Text } from "./text";

export interface ButtonProps extends React.ComponentProps<
  typeof TouchableOpacity
> {
  title: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  leftIcon?: React.ReactNode;
}

export function Button({
  title,
  variant = "default",
  size = "md",
  loading = false,
  leftIcon,
  disabled,
  className,
  ...props
}: ButtonProps) {
  const isDisabled = disabled || loading;
  const variantStyle = buttonVariantStyles[variant];
  const sizeStyle = buttonSizeStyles[size];

  return (
    <TouchableOpacity
      {...props}
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      activeOpacity={0.72}
      disabled={isDisabled}
      className={`items-center justify-center ${variantStyle.container} ${sizeStyle.container} ${isDisabled ? "opacity-60" : ""} ${className ?? ""}`}
    >
      {loading ? (
        <ActivityIndicator size="small" className={variantStyle.loading} />
      ) : (
        <View
          className={`flex-row items-center justify-center ${sizeStyle.content}`}
        >
          {leftIcon}
          <Text
            className={`text-center ${variantStyle.text} ${sizeStyle.text}`}
          >
            {title}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
}
