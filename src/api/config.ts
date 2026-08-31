import { toast } from "@/lib/toast";
import {
  AxiosError,
  create,
  isAxiosError,
  type AxiosInstance,
  type InternalAxiosRequestConfig,
} from "axios";

interface Config {
  baseURL: string;
}

interface InstanceMetadata {
  isDemo?: boolean;
  isLocal?: boolean;
}

type ApiInstance = AxiosInstance & InstanceMetadata;
type RetryableRequest = InternalAxiosRequestConfig & { sent?: boolean };

// function isAdaptableData(data: unknown) {
//   if (Array.isArray(data)) return true;
//   if (!data || typeof data !== "object") return false;
//   return Object.getPrototypeOf(data) === Object.prototype;
// }

const headers = {
  Accept: "application/json",
  "Content-Type": "application/json",
  "x-requested": "Syslae",
};

export function getUrlConfig() {
  switch (process.env.EXPO_PUBLIC_MODE) {
    case "prod":
      return process.env.EXPO_PUBLIC_API_PROD_BASE_URL;
    case "dev":
      return process.env.EXPO_PUBLIC_API_DEV_BASE_URL;
    case "demo":
    default:
      return process.env.EXPO_PUBLIC_API_DEMO_BASE_URL;
  }
}

const configuredBaseUrl = getUrlConfig()?.replace(/\/+$/, "") ?? "";

export const activeConfig: Config = {
  baseURL: configuredBaseUrl,
};

export const currentBaseUrl = activeConfig.baseURL;

function createApiInstance(config: Config): ApiInstance {
  const instance = create({
    baseURL: config.baseURL,
    headers,
    timeout: 15_000,
  }) as ApiInstance;

  instance.isDemo = config.baseURL.includes("demo");
  instance.isLocal =
    config.baseURL.includes("localhost") ||
    config.baseURL.includes("127.0.0.1") ||
    /^http:\/\/(?:10\.|192\.168\.|172\.)/.test(config.baseURL);

  instance.interceptors.request.use((request) => {
    if (!request.baseURL) {
      throw new AxiosError(
        "Configure a URL da API para realizar chamadas.",
        "ERR_INVALID_URL",
        request,
      );
    }
    // Para projetos que usam snake_case no backend, descomente o trecho abaixo para converter a requisição para snake_case
    // if (isAdaptableData(request.data)) {
    //   request.data = adapter("toSnake", request.data);
    // }
    return request;
  });
  // Para projetos que usam snake_case no backend, descomente o trecho abaixo para converter a resposta para camelCase
  // instance.interceptors.response.use((response) => {
  //   response.data = adapter("toCamel", response.data);
  //   return response;
  // });
  return instance;
}

export const api = createApiInstance(activeConfig);
export const isDemo = Boolean(api.isDemo);
export const isLocal = Boolean(api.isLocal);

export function registerInterceptor(removeCredentials: () => Promise<void>) {
  const interceptor = api.interceptors.response.use(
    (response) => response,
    async (error: unknown) => {
      if (!isAxiosError(error)) {
        return Promise.reject(error);
      }
      const failedRequest = error.config as RetryableRequest | undefined;
      if (error.response?.status === 401 && failedRequest) {
        if (failedRequest.sent) {
          toast.error("Sua sessão expirou, faça login novamente");
          await removeCredentials();
          return Promise.reject(error);
        }
        failedRequest.sent = true;
        return api(failedRequest);
      }
      return Promise.reject(error);
    },
  );

  return () => api.interceptors.response.eject(interceptor);
}
