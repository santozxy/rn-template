import { registerInterceptor } from "@/api/config";
import { removeToken, updateToken } from "@/api/handlers";
import type { Auth } from "@/domains/auth/types";
import { queryClient } from "@/lib/tanstack-query/config";
import { removePersistedQueryCache } from "@/lib/tanstack-query/persister";
import { authStorage } from "@/storage/auth/storage";
import { logger } from "logger";
import React, {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

export interface AuthContextData {
  auth: Auth | null;
  userId: string | null;
  isLoading: boolean;
  saveAuth: (auth: Auth) => Promise<void>;
  removeAuth: () => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextData | undefined>(
  undefined,
);

export function AuthProvider({ children }: React.PropsWithChildren) {
  const [auth, setAuth] = useState<Auth | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const saveAuth = useCallback(async (nextAuth: Auth) => {
    queryClient.clear();
    updateToken(nextAuth.token);
    await authStorage.set(nextAuth);
    setAuth(nextAuth);
  }, []);

  const removeAuth = useCallback(async () => {
    const scope = auth
      ? { tenantId: auth.user.tenantId, userId: auth.user.id }
      : null;

    removeToken();
    await authStorage.remove();
    queryClient.clear();
    setAuth(null);
    if (scope) await removePersistedQueryCache(scope);
  }, [auth]);

  useEffect(() => {
    authStorage
      .get()
      .then((storedAuth) => {
        if (!storedAuth) return;
        updateToken(storedAuth.token);
        setAuth(storedAuth);
      })
      .catch((error) =>
        logger.error("Não foi possível restaurar a sessão", error),
      )
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => registerInterceptor(removeAuth), [removeAuth]);

  const value = useMemo(
    () => ({
      auth,
      isLoading,
      logout: removeAuth,
      removeAuth,
      saveAuth,
      userId: auth?.user.id ?? null,
    }),
    [auth, isLoading, removeAuth, saveAuth],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
