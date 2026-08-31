import {
  type QueryKey,
  useQuery,
  type UseQueryOptions,
} from "@tanstack/react-query";
import { useEffect } from "react";
import { handleApiError } from "@/api/handlers";

interface UseListParams<T> extends UseQueryOptions<T[]> {
  queryKey: QueryKey;
  queryFn: () => Promise<T[]>;
}

export function useList<T>({ queryKey, queryFn, ...rest }: UseListParams<T>) {
  const query = useQuery<T[], Error>({
    queryKey: [...queryKey],
    queryFn: queryFn,
    ...rest,
  });

  useEffect(() => {
    if (query.error) {
      handleApiError(query.error);
    }
  }, [query.error]);

  const items = query.data ?? [];
  const isOfflineUnavailable =
    query.fetchStatus === "paused" && query.data === undefined;

  return {
    items,
    isOfflineUnavailable,
    ...query,
  };
}
