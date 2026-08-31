import {
  BaseToast,
  ErrorToast,
  InfoToast,
  ToastConfig,
} from "react-native-toast-message";
import { createToast } from "./custom";

export const toastConfig: ToastConfig = {
  success: createToast(
    { textColor: "success", borderColor: "success" },
    BaseToast,
  ),
  error: createToast(
    { textColor: "destructive", borderColor: "destructive" },
    ErrorToast,
  ),
  info: createToast({ textColor: "info", borderColor: "info" }, InfoToast),
  warning: createToast(
    { textColor: "warning", borderColor: "warning" },
    BaseToast,
  ),
};
