import { useNavigation } from "@react-navigation/native";
import { useCallback } from "react";
import { ScreenHeader } from "./header";
import type { ScreenBaseProps } from "../helpers";

type ScreenChromeProps = Pick<
  ScreenBaseProps,
  "title" | "header" | "actions" | "canGoBack" | "onBackPress" | "contentSize"
>;
// Responsável por renderizar o cabeçalho da tela, incluindo o título, ações e botão de voltar, se aplicável. Ele utiliza a navegação para gerenciar o comportamento do botão de voltar e permite personalização do cabeçalho através das props fornecidas.
export function ScreenChrome({
  title,
  header,
  actions,
  canGoBack,
  onBackPress,
  contentSize,
}: ScreenChromeProps) {
  const navigation = useNavigation();
  const handleBackPress = useCallback(() => {
    if (onBackPress) {
      onBackPress();
      return;
    }
    if (navigation.canGoBack()) navigation.goBack();
  }, [navigation, onBackPress]);

  if (header !== undefined) return header;
  if (!title) return null;

  return (
    <ScreenHeader
      title={title}
      actions={actions}
      canGoBack={canGoBack ?? navigation.canGoBack()}
      onBackPress={handleBackPress}
      contentSize={contentSize}
    />
  );
}
