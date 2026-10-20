import { registerInterceptor } from "@/api/config";
import { removeToken, updateToken } from "@/api/handlers";
import type { Auth } from "@/domains/auth/types";
import { queryClient } from "@/lib/tanstack-query/config";
import { authStorage } from "@/storage/auth/storage";
import { getUserStorage, type UserStorage } from "@/storage/user/storage";
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
  userStorage: UserStorage | null;
  userId: string | null;
  isLoading: boolean;
  saveAuth: (auth: Auth) => Promise<void>;
  removeAuth: () => Promise<void>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextData | undefined>(
  undefined,
);

interface AuthenticatedSession {
  auth: Auth;
  userStorage: UserStorage;
}

export function AuthProvider({ children }: React.PropsWithChildren) {
  const [session, setSession] = useState<AuthenticatedSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const auth = session?.auth ?? null;
  const userStorage = session?.userStorage ?? null;

  const createAuthenticatedSession = useCallback(async (nextAuth: Auth) => {
    const nextUserStorage = await getUserStorage({
      tenantId: nextAuth.user.tenantId,
      userId: nextAuth.user.id,
    });

    return { auth: nextAuth, userStorage: nextUserStorage };
  }, []);

  const saveAuth = useCallback(
    async (nextAuth: Auth) => {
      queryClient.clear();
      const nextSession = await createAuthenticatedSession(nextAuth);
      updateToken(nextAuth.token);
      await authStorage.set(nextAuth);
      setSession(nextSession);
    },
    [createAuthenticatedSession],
  );

  const removeAuth = useCallback(async () => {
    removeToken();
    await authStorage.remove();
    queryClient.clear();
    setSession(null);
  }, []);

  const loadStoredSession = useCallback(async () => {
    const storedAuth = await authStorage.get();

    if (!storedAuth) return null;

    return createAuthenticatedSession(storedAuth);
  }, [createAuthenticatedSession]);

  useEffect(() => {
    let cancelled = false;

    const restoreAuth = async () => {
      try {
        const storedSession = await loadStoredSession();

        if (cancelled || !storedSession) return;

        updateToken(storedSession.auth.token);
        setSession(storedSession);
      } catch (error) {
        logger.error("Não foi possível restaurar a sessão", error);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    void restoreAuth();

    return () => {
      cancelled = true;
    };
  }, [loadStoredSession]);

  useEffect(() => registerInterceptor(removeAuth), [removeAuth]);

  const value = useMemo(
    () => ({
      auth,
      isLoading,
      logout: removeAuth,
      removeAuth,
      saveAuth,
      userStorage,
      userId: auth?.user.id ?? null,
    }),
    [auth, isLoading, removeAuth, saveAuth, userStorage],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
