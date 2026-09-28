import { Icon, type IconName } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import React from "react";
import { ActivityIndicator, Modal } from "react-native";
import { View } from "@/components/ui/view";

interface ModalLoadingModalProps {
  title: string;
  description: string;
  iconName: IconName;
  visible: boolean;
  loadingComponent?: React.ReactNode;
}

export function ModalLoading({
  visible,
  title,
  description,
  iconName,
  loadingComponent,
}: ModalLoadingModalProps) {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View className="absolute inset-0 items-center justify-center bg-black/40">
        <View className="w-[85%] max-w-[320px] items-center gap-4 rounded-2xl border border-border bg-secondary p-6 shadow-lg">
          <Icon name={iconName} size={42} className="text-primary" />
          <Text className="font-semibold text-lg text-foreground">{title}</Text>
          <Text className="text-sm text-description">{description}</Text>
          {loadingComponent || (
            <ActivityIndicator
              size="small"
              className="color-primary"
              style={{ marginTop: 10 }}
            />
          )}
        </View>
      </View>
    </Modal>
  );
}
