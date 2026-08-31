import { AuthContext } from "@/providers/auth-provider";
import { use } from "react";

export function useAuth() {
  const context = use(AuthContext);

  if (!context) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider");
  }

  return context;
}
