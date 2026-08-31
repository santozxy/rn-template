import { toast } from "@/lib/toast";
import { isAxiosError } from "axios";
import { api } from "./config";

interface ApiErrorData {
  message?: string;
}

export function getApiErrorMessage(
  error: unknown,
  defaultMessage = "Não foi possível concluir a operação.",
) {
  if (isAxiosError<ApiErrorData>(error)) {
    if (error.code === "ECONNABORTED") {
      return "A requisição excedeu o tempo limite.";
    }
    if (!error.response) {
      return error.code === "ERR_INVALID_URL"
        ? error.message
        : "Verifique sua conexão com a internet e tente novamente.";
    }
    return error.response.data?.message || error.message || defaultMessage;
  }
  return error instanceof Error && error.message
    ? error.message
    : defaultMessage;
}

export function handleApiError(error: unknown) {
  if (isAxiosError(error)) {
    console.error("API Error:", error.message, error.response?.data);
  } else {
    console.error("APP Error:", error);
  }
  toast.error(getApiErrorMessage(error));
}

export function updateToken(token: string) {
  api.defaults.headers.common.Authorization = `Bearer ${token}`;
}

export function removeToken() {
  delete api.defaults.headers.common.Authorization;
}
