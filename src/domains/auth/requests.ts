import { api } from "@/api/config";
import type { ApiResponse } from "@/api/types";
import type { Auth, Credentials } from "./types";

export const developmentCredentials: Credentials = {
  email: "admin@syslae.com",
  password: "password",
};

export async function login(credentials: Credentials) {
  const { data } = await api.post<ApiResponse<Auth>>(
    "/auth/login",
    credentials,
  );
  return data;
}
