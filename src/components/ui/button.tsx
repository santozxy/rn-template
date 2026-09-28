import {
  buttonSizeStyles,
  buttonVariantStyles,
  type ButtonSize,
  type ButtonVariant,
} from "@/theme/variants/button";
import React from "react";
import { ActivityIndicator, TouchableOpacity } from "react-native";
import { Text } from "./text";

export interface ButtonProps extends Omit<
  React.ComponentProps<typeof TouchableOpacity>,
  "children"
> {
  children: React.ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
}

export function Button({
  children,
  variant = "default",
  size = "md",
  activeOpacity = 0.7,
  loading = false,
  disabled,
  accessibilityRole = "button",
  accessibilityState,
  className,
  ...props
}: ButtonProps) {
  const isDisabled = disabled || loading;
  const variantStyle = buttonVariantStyles[variant];
  const sizeStyle = buttonSizeStyles[size];

  return (
    <TouchableOpacity
      {...props}
      accessibilityRole={accessibilityRole}
      accessibilityState={{
        ...accessibilityState,
        disabled: isDisabled,
        busy: loading,
      }}
      activeOpacity={activeOpacity}
      disabled={isDisabled}
      className={`${size === "content" ? "" : "flex-row items-center justify-center"} ${variantStyle.container} ${sizeStyle.container} ${sizeStyle.content} ${isDisabled ? "opacity-60" : ""} ${className ?? ""}`}
    >
      {loading ? (
        <ActivityIndicator size="small" className={variantStyle.loading} />
      ) : (
        <>
          {React.Children.map(children, (child) =>
            typeof child === "string" || typeof child === "number" ? (
              <Text
                className={`text-center ${variantStyle.text} ${sizeStyle.text}`}
              >
                {child}
              </Text>
            ) : (
              child
            ),
          )}
        </>
      )}
    </TouchableOpacity>
  );
}
