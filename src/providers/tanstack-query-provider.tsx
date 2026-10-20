import { useAuth } from "@/hooks/use-auth";
import {
  queryClient,
  queryPersistenceConfig,
} from "@/lib/tanstack-query/config";
import {
  createQueryPersister,
  getQueryCacheBuster,
  QUERY_CACHE_MAX_AGE,
  shouldPersistQuery,
} from "@/lib/tanstack-query/persister";
import { focusManager, QueryClientProvider } from "@tanstack/react-query";
import { PersistQueryClientProvider } from "@tanstack/react-query-persist-client";
import React, { useEffect, useMemo } from "react";
import { AppState, type AppStateStatus } from "react-native";

export function TanstackQueryProvider({ children }: React.PropsWithChildren) {
  const { isLoading, userStorage } = useAuth();
  const scope = userStorage?.scope ?? null;
  const persister = useMemo(
    () =>
      queryPersistenceConfig.enabled && userStorage
        ? createQueryPersister(userStorage)
        : null,
    [userStorage],
  );

  useEffect(() => {
    const subscription = AppState.addEventListener(
      "change",
      (status: AppStateStatus) => focusManager.setFocused(status === "active"),
    );
    return () => subscription.remove();
  }, []);

  if (!persister || !scope || !userStorage || isLoading) {
    return (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
  }

  return (
    <PersistQueryClientProvider
      key={userStorage.scopeKey}
      client={queryClient}
      persistOptions={{
        buster: getQueryCacheBuster(scope),
        maxAge: QUERY_CACHE_MAX_AGE,
        persister,
        dehydrateOptions: {
          shouldDehydrateMutation: () => false,
          shouldDehydrateQuery: shouldPersistQuery,
        },
      }}
    >
      {children}
    </PersistQueryClientProvider>
  );
}
