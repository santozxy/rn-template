import {
  ResponsiveContainer,
  type ResponsiveContainerSize,
} from "@/components/layout/responsive/container";
import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { useScreenSafeAreaInsets } from "@/hooks/use-screen-safe-area-insets";
import { useTheme } from "@/hooks/use-theme";
import { StatusBar } from "expo-status-bar";
import React from "react";
import { View } from "@/components/ui/view";

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
  const { colors, theme, toggleTheme } = useTheme();
  const insets = useScreenSafeAreaInsets();

  return (
    <View style={{ paddingLeft: insets.left, paddingRight: insets.right }}>
      <StatusBar style={theme === "dark" ? "light" : "dark"} animated />
      <ResponsiveContainer
        padded
        className="flex-row items-center justify-between gap-4"
        style={{
          minHeight: 64 + insets.top,
          paddingTop: insets.top + 16,
        }}
      >
        {canGoBack ? (
          <Button
            accessibilityLabel="Voltar"
            variant="unstyled"
            size="content"
            hitSlop={8}
            onPress={onBackPress}
            className="h-12 w-12 items-center justify-center rounded-full border border-border bg-background"
          >
            <Icon name="arrow-back" size={26} className="text-foreground" />
          </Button>
        ) : null}

        <Text
          className={`flex-1 font-semibold text-lg text-foreground ${
            canGoBack || actions ? "text-left" : "text-center"
          }`}
          numberOfLines={2}
        >
          {title}
        </Text>

        {actions ? (
          <View className="min-h-11 items-end justify-center">{actions}</View>
        ) : null}
        <Button
          accessibilityLabel={
            theme === "dark" ? "Ativar tema claro" : "Ativar tema escuro"
          }
          variant="unstyled"
          size="content"
          className="h-12 w-12 items-center justify-center rounded-full border border-border bg-background"
          hitSlop={8}
          style={{
            shadowColor: colors.black,
            shadowOpacity: 0.2,
            shadowOffset: { width: 0, height: 3 },
            elevation: 4,
            shadowRadius: 4,
          }}
          onPress={toggleTheme}
        >
          <Icon
            name={theme === "dark" ? "sun" : "moon"}
            size={21}
            className="text-primary"
          />
        </Button>
      </ResponsiveContainer>
    </View>
  );
}
