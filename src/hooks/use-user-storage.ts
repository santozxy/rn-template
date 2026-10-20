import { useAuth } from "@/hooks/use-auth";

export function useUserStorage() {
  const { userStorage } = useAuth();

  if (!userStorage) {
    throw new Error("O storage do usuário exige uma sessão autenticada.");
  }

  return userStorage;
}
