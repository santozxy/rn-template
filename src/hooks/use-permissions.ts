import { useAuth } from "@/hooks/use-auth";
import { useCallback, useMemo } from "react";

export function usePermissions() {
  const { auth } = useAuth();
  const permissions = useMemo(
    () => (auth?.user.role === "admin" ? ["*"] : []),
    [auth?.user.role],
  );

  const hasPermission = useCallback(
    (permission: string) =>
      permissions.includes("*") || permissions.includes(permission),
    [permissions],
  );

  const hasAnyPermission = useCallback(
    (required: string[]) => required.some(hasPermission),
    [hasPermission],
  );

  const hasEveryPermission = useCallback(
    (required: string[]) => required.every(hasPermission),
    [hasPermission],
  );

  return {
    hasAnyPermission,
    hasEveryPermission,
    hasPermission,
    permissions,
  };
}
