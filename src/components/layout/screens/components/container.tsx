import { View } from "@/components/ui/view";
import { useTheme } from "@/hooks/use-theme";
import { LinearGradient } from "expo-linear-gradient";
import { StatusBar, type StatusBarStyle } from "expo-status-bar";
import type { ReactNode } from "react";
import type { ColorValue, StyleProp, ViewStyle } from "react-native";

interface ScreenContainerProps {
  children: ReactNode;
  gradientBackground?: boolean;
  backgroundColor?: ColorValue;
  statusBarStyle: StatusBarStyle;
  style?: StyleProp<ViewStyle>;
}

// Responsável por fornecer um contêiner de tela que envolve o conteúdo da tela, definindo a cor de fundo, o estilo da barra de status e aplicando estilos adicionais conforme necessário. Ele garante que a tela ocupe todo o espaço disponível e que a barra de status seja configurada corretamente.
export function ScreenContainer({
  children,
  gradientBackground = true,
  backgroundColor,
  statusBarStyle,
  style,
}: ScreenContainerProps) {
  const { colors } = useTheme();

  return (
    <View
      className="flex-1 bg-background"
      style={[backgroundColor ? { backgroundColor } : undefined, style]}
    >
      {gradientBackground ? (
        <LinearGradient
          pointerEvents="none"
          colors={[colors.primaryLight, colors.background, colors.background]}
          locations={[0, 0.3, 1]}
          start={{ x: 0.8, y: 0 }}
          end={{ x: 0.4, y: 0.8 }}
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            bottom: 0,
            left: 0,
          }}
        />
      ) : null}
      <StatusBar style={statusBarStyle} animated />
      {children}
    </View>
  );
}
