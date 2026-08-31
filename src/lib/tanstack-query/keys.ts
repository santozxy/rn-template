type Params = Record<string, unknown>;

export function createQueryKeys(root: string) {
  const all = [root] as const;

  return {
    all,
    lists: () => [...all, "list"] as const,
    list: (params: Params = {}) => [...all, "list", params] as const,
    details: () => [...all, "detail"] as const,
    detail: (id: string | number) => [...all, "detail", id] as const,
  };
}

export const queryKeys = {
  auth: {
    all: ["auth"] as const,
    user: () => ["auth", "user"] as const,
  },
  users: createQueryKeys("users"),
};
