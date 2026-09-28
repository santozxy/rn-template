type Params = object;

const authKeys = {
  all: ["auth"] as const,
  user: () => [...authKeys.all, "user"] as const,
};

const usersKeys = {
  all: ["users"] as const,
  lists: () => [...usersKeys.all, "list"] as const,
  list: (params?: Params) => [...usersKeys.lists(), params ?? {}] as const,
  details: () => [...usersKeys.all, "detail"] as const,
  detail: (id: string | number) => [...usersKeys.details(), id] as const,
  summary: (id: string, period: string) =>
    [...usersKeys.detail(id), "summary", period] as const,
};

const trackingKeys = {
  all: ["tracking"] as const,
  positions: () => [...trackingKeys.all, "positions"] as const,
  availableCommands: (vehicleId: string) =>
    [...trackingKeys.all, "available-commands", vehicleId] as const,
};

export const queryKeys = {
  auth: authKeys,
  users: usersKeys,
  tracking: trackingKeys,
};
