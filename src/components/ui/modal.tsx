import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { View } from "@/components/ui/view";
import React from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  Modal as RNModal,
  Platform,
  TouchableWithoutFeedback,
} from "react-native";
import { Text } from "./text";

interface ModalProps {
  visible: boolean;
  onClose?: () => void;
  children: React.ReactNode;
  variant?: keyof typeof variantModal;
  type?: "middle" | "full";
  title?: string;
}

const variantModal = {
  default: "bg-background",
  secondary: "bg-secondary",
};

export const modalTypes = {
  middle: MiddleModal,
  full: FullModal,
};

export function Modal({
  visible,
  onClose,
  children,
  variant = "default",
  type = "middle",
  title,
}: ModalProps) {
  const ModalComponent = modalTypes[type];
  return (
    <ModalComponent
      visible={visible}
      onClose={onClose}
      variant={variant}
      title={title}
    >
      {children}
    </ModalComponent>
  );
}

function MiddleModal({
  visible,
  onClose,
  children,
  variant = "default",
}: ModalProps) {
  return (
    <RNModal
      visible={visible}
      transparent
      animationType="slide" // pode ser "slide" ou "none"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View className="flex-1 items-center justify-center bg-black/40 px-4">
          <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            className="w-full"
          >
            <View
              className={`w-full p-6 ${variantModal[variant]} gap-6 rounded-2xl border border-border shadow-2xl`}
            >
              {children}
            </View>
          </KeyboardAvoidingView>
        </View>
      </TouchableWithoutFeedback>
    </RNModal>
  );
}

function FullModal({
  visible,
  onClose,
  children,
  variant = "default",
  title,
}: ModalProps) {
  return (
    <RNModal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View className={`flex-1 ${variantModal[variant]} p-6`}>
        <View className="flex-row items-center justify-between py-6">
          <Text className="font-semibold text-lg text-foreground">{title}</Text>
          <Button
            variant="unstyled"
            size="content"
            accessibilityLabel="Fechar"
            onPress={onClose}
          >
            <Icon name="x" size={24} className="text-destructive" />
          </Button>
        </View>
        {children}
      </View>
    </RNModal>
  );
}
