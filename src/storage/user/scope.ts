export interface UserStorageScope {
  tenantId?: string | null;
  userId: string;
}

export interface NormalizedUserStorageScope {
  tenantId: string;
  userId: string;
}

export function normalizeUserStorageScope(
  scope: UserStorageScope,
): NormalizedUserStorageScope {
  const tenantId = scope.tenantId?.trim() || "default";
  const userId = scope.userId.trim();

  if (!userId) {
    throw new Error(
      "Não é possível criar um storage sem identificar o usuário.",
    );
  }

  return { tenantId, userId };
}

export function getUserStorageScopeKey(scope: UserStorageScope) {
  const normalizedScope = normalizeUserStorageScope(scope);

  return `${encodeURIComponent(normalizedScope.tenantId)}:${encodeURIComponent(normalizedScope.userId)}`;
}
