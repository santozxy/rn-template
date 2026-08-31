import { Icon } from "@/components/ui/icon";
import React from "react";
import { View } from "react-native";
import { Text } from "./text";

export function ErrorMessage({ error }: { error: any }) {
  return (
    <View className="flex flex-row items-center gap-2 rounded-2xl">
      <Icon name="alert-circle" size={20} className="text-destructive" />
      <Text className="flex-1 text-destructive">
        {error.response?.data.message ||
          error.message ||
          "Ocorreu um erro ao processar sua solicitação!"}
      </Text>
    </View>
  );
}
