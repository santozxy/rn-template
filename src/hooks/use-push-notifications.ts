import {
  registerForPushNotifications,
  type PushRegistrationResult,
} from "@/lib/notifications/register";
import { useCallback, useEffect, useState } from "react";

interface UsePushNotificationsOptions {
  enabled?: boolean;
  onToken?: (token: string) => void | Promise<void>;
}

export function usePushNotifications({
  enabled = true,
  onToken,
}: UsePushNotificationsOptions = {}) {
  const [result, setResult] = useState<PushRegistrationResult>({
    granted: false,
    token: null,
  });
  const [isLoading, setIsLoading] = useState(enabled);
  const [error, setError] = useState<Error | null>(null);

  const register = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const nextResult = await registerForPushNotifications();
      setResult(nextResult);
      if (nextResult.token) await onToken?.(nextResult.token);
      return nextResult;
    } catch (caught) {
      const nextError =
        caught instanceof Error
          ? caught
          : new Error("Não foi possível registrar as notificações.");
      setError(nextError);
      throw nextError;
    } finally {
      setIsLoading(false);
    }
  }, [onToken]);

  useEffect(() => {
    if (!enabled) return;
    void register().catch(() => undefined);
  }, [enabled, register]);

  return { ...result, error, isLoading, register };
}
