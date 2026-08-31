import { OfflineTransition } from "@/components/ui/offline-mode";
import type { NetworkStatus } from "@/lib/network/offline";
import { toast } from "@/lib/toast";
import { onlineManager } from "@tanstack/react-query";
import * as Network from "expo-network";
import React, {
  createContext,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

export type NetworkProps = {
  status: NetworkStatus;
  isConnected: boolean | null;
  type: Network.NetworkStateType | null;
  isInternetReachable: boolean | null;
  error: string | null;
  retryCheck: () => Promise<void>;
};

export const NetworkContext = createContext<NetworkProps | undefined>(
  undefined,
);

function getNetworkStatus(state: Network.NetworkState): NetworkStatus {
  if (state.isConnected === false || state.isInternetReachable === false) {
    return "offline";
  }

  if (state.isConnected === true) {
    return "online";
  }

  return "unavailable";
}

export function NetworkProvider({ children }: { children: React.ReactNode }) {
  const [status, setStatus] = useState<NetworkStatus>("checking");
  const [type, setType] = useState<Network.NetworkStateType | null>(null);
  const [isInternetReachable, setIsInternetReachable] = useState<
    boolean | null
  >(null);
  const [error, setError] = useState<string | null>(null);
  const previousStatus = useRef<NetworkStatus>("checking");

  const updateNetworkState = useCallback((state: Network.NetworkState) => {
    const nextStatus = getNetworkStatus(state);
    const previous = previousStatus.current;
    const online = nextStatus === "online";

    previousStatus.current = nextStatus;
    onlineManager.setOnline(online);
    setStatus(nextStatus);
    setType(state.type ?? null);
    setIsInternetReachable(state.isInternetReachable ?? null);
    setError(null);

    if (online && (previous === "offline" || previous === "unavailable")) {
      toast.success("Conexão restabelecida. Atualizando dados...");
    }
  }, []);

  const checkNetwork = useCallback(async () => {
    try {
      setStatus("checking");
      setError(null);
      updateNetworkState(await Network.getNetworkStateAsync());
    } catch (error) {
      const message =
        error instanceof Error
          ? `Erro ao verificar rede: ${error.message}`
          : "Erro ao verificar rede";

      onlineManager.setOnline(false);
      previousStatus.current = "unavailable";
      setStatus("unavailable");
      setError(message);
    }
  }, [updateNetworkState]);

  useEffect(() => {
    let initialized = false;
    const subscription = Network.addNetworkStateListener((state) => {
      initialized = true;
      updateNetworkState(state);
    });

    Network.getNetworkStateAsync()
      .then((state) => {
        if (!initialized) {
          updateNetworkState(state);
        }
      })
      .catch((error) => {
        onlineManager.setOnline(false);
        previousStatus.current = "unavailable";
        setStatus("unavailable");
        setError(
          error instanceof Error
            ? `Erro ao verificar rede: ${error.message}`
            : "Erro ao verificar rede",
        );
      });

    return () => subscription.remove();
  }, [updateNetworkState]);

  return (
    <NetworkContext.Provider
      value={{
        status,
        isConnected:
          status === "online" ? true : status === "offline" ? false : null,
        type,
        isInternetReachable,
        error,
        retryCheck: checkNetwork,
      }}
    >
      {children}
      <>{status === "offline" && <OfflineTransition visible />}</>
    </NetworkContext.Provider>
  );
}
