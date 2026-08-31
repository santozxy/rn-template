import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import React from "react";
import { ActivityIndicator, Modal, View } from "react-native";

interface PDFLoadingModalProps {
  visible: boolean;
}

export function PDFLoading({ visible }: PDFLoadingModalProps) {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View className="absolute inset-0 items-center justify-center bg-black/40">
        <View className="w-[85%] max-w-[320px] items-center gap-4 rounded-2xl border border-border bg-secondary p-6 shadow-lg">
          <Icon
            name="document-text-outline"
            size={42}
            className="text-primary"
          />
          <Text className="font-semibold text-lg text-foreground">
            Gerando PDF
          </Text>
          <Text className="text-sm text-description">
            Aguarde enquanto o arquivo é preparado...
          </Text>
          <ActivityIndicator
            size="small"
            className="color-primary"
            style={{ marginTop: 10 }}
          />
        </View>
      </View>
    </Modal>
  );
}
