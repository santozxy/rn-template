import { queryClient } from "@/lib/tanstack-query/config";
import { useSyncExternalStore } from "react";

function subscribe(onStoreChange: () => void) {
  return queryClient.getQueryCache().subscribe(onStoreChange);
}

function hasUnavailableQueries() {
  return queryClient
    .getQueryCache()
    .getAll()
    .some(
      (query) =>
        query.getObserversCount() > 0 &&
        query.state.fetchStatus === "paused" &&
        query.state.data === undefined,
    );
}

export function useHasUnavailableOfflineQueries() {
  return useSyncExternalStore(subscribe, hasUnavailableQueries, () => false);
}
