export const DEFAULT_OFFLINE_MESSAGE =
  "Esta operação estará disponível quando a conexão for restabelecida.";

export type NetworkStatus = "checking" | "online" | "offline" | "unavailable";

export class OfflineActionError extends Error {
  constructor(message = DEFAULT_OFFLINE_MESSAGE) {
    super(message);
    this.name = "OfflineActionError";
  }
}

export function isOfflineActionError(error: unknown) {
  return error instanceof OfflineActionError;
}
