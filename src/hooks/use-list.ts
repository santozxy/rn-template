import { useQuery } from "@/hooks/use-query";
import { type QueryKey, type UseQueryOptions } from "@tanstack/react-query";

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

  const items = query.data ?? [];

  return {
    items,
    ...query,
  };
}
