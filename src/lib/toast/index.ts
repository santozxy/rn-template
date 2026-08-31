import { Vibration } from "react-native";
import Toast, { ToastShowParams } from "react-native-toast-message";

const DURATION = 3000;
export const TOP_OFFSET = 105;

const toastGlobalConfig: ToastShowParams = {
  topOffset: TOP_OFFSET,
  visibilityTime: DURATION,
  swipeable: false,
};

function showToast(
  type: "success" | "error" | "info" | "warning",
  text1: "Ops..." | "Sucesso" | "Informação" | "Atenção" | string,
  text2?: string,
  topOffset: number = TOP_OFFSET,
) {
  Toast.show({
    type,
    // text1,
    text2,
    ...toastGlobalConfig,
    topOffset,
  });
}

/**
 * Exibe um toast de erro com vibração.
 * @param text O texto a ser exibido no toast.
 * @function error - Exibe um toast de erro com vibração.
 * @function success - Exibe um toast de sucesso.
 * @function info - Exibe um toast de informação.
 * @function warning - Exibe um toast de aviso.
 * @example
 * toast.error("Ocorreu um erro ao processar sua solicitação.");
 * toast.success("Operação realizada com sucesso!");
 * toast.info("Esta é uma informação importante.");
 * toast.warning("Atenção! Verifique os dados inseridos.");
 */
export const toast = {
  error: (text: string, topOffset?: number) => {
    Vibration.vibrate(1000);
    showToast("error", "Ops..", text, topOffset);
  },
  success: (text: string, topOffset?: number) =>
    showToast("success", "Tudo certo!", text, topOffset),
  info: (text: string, topOffset?: number) =>
    showToast("info", "Informação", text, topOffset),
  warning: (text: string, topOffset?: number) =>
    showToast("warning", "Aviso", text, topOffset),
};
