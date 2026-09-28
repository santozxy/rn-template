import type { ToastConfig } from "react-native-toast-message";
import { createToast } from "./custom";

export const toastConfig: ToastConfig = {
  success: createToast("success"),
  error: createToast("error"),
  info: createToast("info"),
  warning: createToast("warning"),
};
