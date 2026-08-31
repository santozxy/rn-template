import React from "react";
import { View } from "react-native";
import { Text } from "./text";

export function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <View className="rounded-2xl border border-border bg-secondary p-4">
      <Text className="mb-2 font-semibold text-base text-foreground">
        {title}
      </Text>
      {children}
    </View>
  );
}
