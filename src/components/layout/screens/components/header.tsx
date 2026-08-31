import {
  ResponsiveContainer,
  type ResponsiveContainerSize,
} from "@/components/layout/responsive/container";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { useScreenSafeAreaInsets } from "@/hooks/use-screen-safe-area-insets";
import React from "react";
import { Pressable, View } from "react-native";

export interface ScreenHeaderProps {
  title: string;
  actions?: React.ReactNode;
  canGoBack?: boolean;
  onBackPress?: () => void;
  contentSize?: ResponsiveContainerSize;
}

// Responsável por renderizar o cabeçalho da tela, incluindo o título, ações e botão de voltar, se aplicável. Ele utiliza a navegação para gerenciar o comportamento do botão de voltar e permite personalização do cabeçalho através das props fornecidas.
export function ScreenHeader({
  title,
  actions,
  canGoBack = false,
  onBackPress,
  contentSize,
}: ScreenHeaderProps) {
  const insets = useScreenSafeAreaInsets();

  return (
    <View
      className="bg-primary"
      style={{ paddingRight: insets.right, paddingLeft: insets.left }}
    >
      <ResponsiveContainer
        size={contentSize}
        padded
        className="flex-row items-center gap-2"
        style={{
          minHeight: 64 + insets.top,
          paddingTop: insets.top + 8,
          paddingBottom: 8,
        }}
      >
        {canGoBack ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Voltar"
            hitSlop={8}
            onPress={onBackPress}
            className="h-11 w-11 items-center justify-center rounded-full active:bg-primary-foreground/15"
          >
            <Icon
              name="arrow-back"
              size={26}
              className="color-primary-foreground"
            />
          </Pressable>
        ) : null}

        <Text
          className={`flex-1 font-semibold text-lg text-primary-foreground ${
            canGoBack || actions ? "text-left" : "text-center"
          }`}
          numberOfLines={2}
        >
          {title}
        </Text>

        {actions ? (
          <View className="min-h-11 items-end justify-center">{actions}</View>
        ) : null}
      </ResponsiveContainer>
    </View>
  );
}
