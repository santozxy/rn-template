import { handleApiError } from "@/api/handlers";
import { ApiResponsePaginated } from "@/api/types";
import {
  type InfiniteData,
  type QueryKey,
  useInfiniteQuery,
} from "@tanstack/react-query";
import { useEffect } from "react";

type UsePaginatedListParams<T> = {
  queryKey: QueryKey;
  queryFn: (params: {
    page: number;
    pageParam: number;
  }) => Promise<ApiResponsePaginated<T[]>>;
  enabled?: boolean;
};

export function usePaginatedList<T>({
  queryKey,
  queryFn,
  enabled = true,
}: UsePaginatedListParams<T>) {
  const queryPaginated = useInfiniteQuery<
    ApiResponsePaginated<T[]>,
    Error,
    InfiniteData<ApiResponsePaginated<T[]>, number>,
    QueryKey,
    number
  >({
    queryKey: [...queryKey],
    queryFn: ({ pageParam }) => queryFn({ page: pageParam, pageParam }),
    getNextPageParam: (lastPage) => {
      if (lastPage.pagination) {
        if (lastPage.pagination.page < lastPage.pagination.lastPage) {
          return lastPage.pagination.page + 1;
        }
      }
      return undefined;
    },
    initialPageParam: 1,
    enabled,
  });

  useEffect(() => {
    if (queryPaginated.error) {
      handleApiError(queryPaginated.error);
    }
  }, [queryPaginated.error]);

  const items = queryPaginated.data?.pages.flatMap((page) => page.data) ?? [];
  const total =
    queryPaginated.data?.pages.map((page) => page?.pagination?.total)[0] ?? 0;
  const currentTotal = items.length ?? 0;
  const isOfflineUnavailable =
    queryPaginated.fetchStatus === "paused" &&
    queryPaginated.data === undefined;

  return {
    items,
    total,
    currentTotal,
    isOfflineUnavailable,
    ...queryPaginated,
  };
}
