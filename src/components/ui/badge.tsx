import React, { JSX } from "react";
import { View } from "react-native";
import { Text } from "./text";
import { BadgeVariant, badgeVariantStyles } from "@/theme/variants/badge";

interface BadgeProps {
  text: string;
  variant?: BadgeVariant;
  className?: string;
  iconLeft?: JSX.Element;
  iconRight?: JSX.Element;
}

export function Badge({
  text,
  variant = "default",
  className,
  iconLeft,
  iconRight,
}: BadgeProps): JSX.Element {
  return (
    <View
      className={`inline-flex flex-row items-center justify-center gap-2 rounded-full px-2.5 py-1
      ${className}
      ${badgeVariantStyles[variant].background}
      ${badgeVariantStyles[variant].border}`}
    >
      {iconLeft && <View className="mr-1">{iconLeft}</View>}
      <Text
        className={`font-semibold text-xs ${badgeVariantStyles[variant].text}`}
      >
        {text}
      </Text>

      {iconRight && (
        <View className="rounded-full bg-destructive">{iconRight}</View>
      )}
    </View>
  );
}
