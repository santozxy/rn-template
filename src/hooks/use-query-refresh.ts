import { useNetwork } from "@/hooks/use-network";
import { DEFAULT_OFFLINE_MESSAGE } from "@/lib/network/offline";
import { refetchQuery } from "@/lib/tanstack-query/methods";
import { toast } from "@/lib/toast";
import type { QueryKey } from "@tanstack/react-query";
import { logger } from "logger";
import { useCallback, useEffect, useRef } from "react";

export function useQueryRefresh(queryKeys: readonly QueryKey[]) {
  const { status } = useNetwork();
  const queryKeysRef = useRef(queryKeys);

  useEffect(() => {
    queryKeysRef.current = queryKeys;
  }, [queryKeys]);

  const onRefresh = useCallback(async () => {
    await Promise.all(
      queryKeysRef.current.map((queryKey) => refetchQuery(queryKey, "all")),
    );
  }, []);

  const onRefreshUnavailable = useCallback(() => {
    toast.warning(DEFAULT_OFFLINE_MESSAGE);
  }, []);

  const onRefreshError = useCallback((error: unknown) => {
    logger.error("Error refreshing screen queries", error);
  }, []);

  return {
    onRefresh,
    refreshEnabled: status === "online",
    onRefreshUnavailable,
    onRefreshError,
  };
}
