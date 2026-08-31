import { usePermissions } from "@/hooks/use-permissions";
import type { ReactNode } from "react";

interface CanProps {
  children: ReactNode;
  fallback?: ReactNode;
  permission?: string;
  permissions?: string[];
  requireEvery?: boolean;
}

export function Can({
  children,
  fallback = null,
  permission,
  permissions = [],
  requireEvery = false,
}: CanProps) {
  const { hasAnyPermission, hasEveryPermission, hasPermission } =
    usePermissions();
  const required = permission ? [permission, ...permissions] : permissions;
  const allowed =
    required.length === 0 ||
    (requireEvery
      ? hasEveryPermission(required)
      : required.length === 1
        ? hasPermission(required[0])
        : hasAnyPermission(required));

  return allowed ? children : fallback;
}
