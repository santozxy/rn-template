import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import React from "react";
import {
  Controller,
  type FieldValues,
  type UseControllerProps,
} from "react-hook-form";
import { TouchableOpacity, View } from "react-native";

interface ControlledRatingProps {
  containerClassName?: string;
  maxRating?: number; // default 5
  label?: string;
  size?: number; // default 32
}

export function ControlledRating<FormType extends FieldValues>({
  control,
  name,
  rules,
  containerClassName,
  maxRating = 5,
  size = 32,
  label,
}: UseControllerProps<FormType> & ControlledRatingProps) {
  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      render={({ field: { onChange, value = 0 }, fieldState: { error } }) => {
        return (
          <View
            className={`w-full items-center gap-1 ${containerClassName || ""}`}
          >
            {label && (
              <Text className="text-center font-medium text-foreground">
                {rules?.required && <Text className="text-destructive">*</Text>}{" "}
                {label}
              </Text>
            )}

            {/* Rating */}
            <View className="flex-row justify-center">
              {Array.from({ length: maxRating }).map((_, index) => {
                const ratingValue = index + 1;
                const isFilled = ratingValue <= value;

                return (
                  <TouchableOpacity
                    key={index}
                    onPress={() => onChange(ratingValue)}
                    activeOpacity={0.7}
                  >
                    <Icon
                      name={isFilled ? "star" : "star-o"}
                      color={isFilled ? "#facc15" : "#d1d5db"}
                      fill={isFilled ? "#facc15" : "transparent"}
                      size={size}
                      style={{ marginHorizontal: 6 }}
                    />
                  </TouchableOpacity>
                );
              })}
            </View>

            {error?.message && (
              <Text className="text-sm text-destructive">{error.message}</Text>
            )}
          </View>
        );
      }}
    />
  );
}
