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

function createAuthenticatedSession(auth: Auth): AuthenticatedSession {
  const userStorage = getUserStorage({
    tenantId: auth.user.tenantId,
    userId: auth.user.id,
  });

  return { auth, userStorage };
}

export function AuthProvider({ children }: React.PropsWithChildren) {
  const [session, setSession] = useState<AuthenticatedSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const auth = session?.auth ?? null;
  const userStorage = session?.userStorage ?? null;

  const saveAuth = useCallback(async (nextAuth: Auth) => {
    queryClient.clear();
    const nextSession = createAuthenticatedSession(nextAuth);
    updateToken(nextAuth.token);
    await authStorage.set(nextAuth);
    setSession(nextSession);
  }, []);

  const removeAuth = useCallback(async () => {
    removeToken();
    await authStorage.remove();
    queryClient.clear();
    setSession(null);
  }, []);

  useEffect(() => {
    let cancelled = false;

    const restoreAuth = async () => {
      try {
        const storedAuth = await authStorage.get();

        if (cancelled || !storedAuth) return;

        updateToken(storedAuth.token);
        setSession(createAuthenticatedSession(storedAuth));
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
  }, []);

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
