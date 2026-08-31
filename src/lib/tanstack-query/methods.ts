import type { QueryKey } from "@tanstack/react-query";
import { queryClient } from "./config";

export async function refetchQuery(
  queryKey: QueryKey,
  type: "active" | "inactive" | "all" = "active",
) {
  await queryClient.refetchQueries({ queryKey, type });
}

export async function invalidateQuery(
  queryKey: QueryKey[] | QueryKey,
  refetchType: "active" | "inactive" | "all" = "active",
) {
  await queryClient.invalidateQueries({ queryKey, refetchType });
}
