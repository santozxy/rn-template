import {
  ResponsiveContainer,
  type ResponsiveContainerSize,
} from "@/components/layout/responsive/container";
import { Text } from "@/components/ui/text";
import type { ReactNode } from "react";

interface ScreenDescriptionProps {
  children: ReactNode;
  contentSize?: ResponsiveContainerSize;
}

// Responsável por renderizar uma descrição ou texto informativo dentro de uma tela, aplicando estilos de layout responsivo e espaçamento adequado. Ele utiliza o ResponsiveContainer para garantir que o conteúdo se ajuste corretamente ao tamanho da tela e às preferências de padding.
export function ScreenDescription({
  children,
  contentSize,
}: ScreenDescriptionProps) {
  return (
    <ResponsiveContainer size={contentSize} padded className="pt-6">
      <Text className="font-semibold text-foreground">{children}</Text>
    </ResponsiveContainer>
  );
}
