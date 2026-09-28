import { handleApiError } from "@/api/handlers";
import {
  useQuery as useTanstackQuery,
  type QueryKey,
  type UseQueryOptions,
} from "@tanstack/react-query";
import { useEffect } from "react";

export function useQuery<
  TQueryFnData = unknown,
  TError = Error,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey,
>(options: UseQueryOptions<TQueryFnData, TError, TData, TQueryKey>) {
  const query = useTanstackQuery(options);

  useEffect(() => {
    if (query.error) handleApiError(query.error);
  }, [query.error]);

  const isOfflineUnavailable =
    query.fetchStatus === "paused" && query.data === undefined;

  return {
    ...query,
    isOfflineUnavailable,
  };
}
