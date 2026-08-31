import { StatusBar, type StatusBarStyle } from "expo-status-bar";
import type { ReactNode } from "react";
import {
  View,
  type ColorValue,
  type StyleProp,
  type ViewStyle,
} from "react-native";

interface ScreenContainerProps {
  children: ReactNode;
  backgroundColor?: ColorValue;
  statusBarStyle: StatusBarStyle;
  style?: StyleProp<ViewStyle>;
}

// Responsável por fornecer um contêiner de tela que envolve o conteúdo da tela, definindo a cor de fundo, o estilo da barra de status e aplicando estilos adicionais conforme necessário. Ele garante que a tela ocupe todo o espaço disponível e que a barra de status seja configurada corretamente.
export function ScreenContainer({
  children,
  backgroundColor,
  statusBarStyle,
  style,
}: ScreenContainerProps) {
  return (
    <View
      className="flex-1 bg-background"
      style={[backgroundColor ? { backgroundColor } : undefined, style]}
    >
      <StatusBar style={statusBarStyle} animated />
      {children}
    </View>
  );
}
