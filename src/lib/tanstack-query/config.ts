import { onlineManager, QueryClient } from "@tanstack/react-query";
import { QUERY_CACHE_MAX_AGE, QUERY_CACHE_STALE_TIME } from "./persister";

interface QueryPersistenceConfig {
  enabled: boolean;
}

onlineManager.setOnline(false);

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: QUERY_CACHE_STALE_TIME,
      gcTime: QUERY_CACHE_MAX_AGE,
      retry: false,
      refetchOnWindowFocus: true,
      refetchInterval: false,
      refetchOnMount: true,
      refetchOnReconnect: true,
      refetchIntervalInBackground: false,
      retryOnMount: true,
      networkMode: "online",
    },
  },
});

export const queryPersistenceConfig: QueryPersistenceConfig = {
  enabled: true,
};
