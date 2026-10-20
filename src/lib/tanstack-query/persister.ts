import { createAsyncStoragePersister } from "@tanstack/query-async-storage-persister";
import { defaultShouldDehydrateQuery, type Query } from "@tanstack/react-query";

import type { UserStorage } from "@/storage/user/storage";

export const QUERY_CACHE_MAX_AGE = 1000 * 60 * 60 * 24 * 7; // 7 days
export const QUERY_CACHE_STALE_TIME = 1000 * 60 * 5; // 5 minutes

const QUERY_CACHE_NAMESPACE = "@template:query-cache";
const QUERY_CACHE_VERSION = "v1";
const QUERY_CACHE_STORAGE_KEY = `${QUERY_CACHE_NAMESPACE}:${QUERY_CACHE_VERSION}`;

export type QueryCacheScope = {
  tenantId?: string;
  userId: string;
};

function getScopeKey({ tenantId, userId }: QueryCacheScope) {
  return `${QUERY_CACHE_VERSION}:${tenantId ?? "default"}:${userId}`;
}

export function getQueryCacheBuster(scope: QueryCacheScope) {
  return `${QUERY_CACHE_NAMESPACE}:${getScopeKey(scope)}`;
}

export function shouldPersistQuery(query: Query) {
  return (
    defaultShouldDehydrateQuery(query) &&
    query.meta?.persist !== false &&
    query.state.status === "success"
  );
}

export function createQueryPersister(userStorage: UserStorage) {
  return createAsyncStoragePersister({
    storage: userStorage.stringStorage,
    key: QUERY_CACHE_STORAGE_KEY,
    throttleTime: 2_000,
  });
}
