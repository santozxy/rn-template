import { ResponsiveContainer } from "@/components/layout/responsive/container";
import type { StyleProp, ViewStyle } from "react-native";
import type { ScreenBaseProps } from "../helpers";

interface ScreenContentProps extends Pick<
  ScreenBaseProps,
  "children" | "contentSize" | "padded" | "center"
> {
  style?: StyleProp<ViewStyle>;
}

// Responsável por renderizar o conteúdo da tela, aplicando estilos de layout responsivo, espaçamento e alinhamento conforme especificado pelas props. Ele utiliza o ResponsiveContainer para garantir que o conteúdo se ajuste corretamente ao tamanho da tela e às preferências de padding e centralização.
export function ScreenContent({
  children,
  contentSize,
  padded = true,
  center,
  style,
}: ScreenContentProps) {
  return (
    <ResponsiveContainer
      size={contentSize}
      padded={padded}
      style={[
        {
          flex: 1,
          paddingTop: 24,
          gap: 24,
          alignItems: center ? "center" : undefined,
          justifyContent: center ? "center" : undefined,
        },
        style,
      ]}
    >
      {children}
    </ResponsiveContainer>
  );
}
