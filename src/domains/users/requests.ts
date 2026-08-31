import { api } from "@/api/config";
import type {
  ApiResponse,
  ApiResponsePaginated,
  PaginationParams,
} from "@/api/types";
import type { CreateUser, UpdateUser, User } from "./types";

export async function getUsers({ page, perPage = 20 }: PaginationParams) {
  const { data } = await api.get<ApiResponsePaginated<User[]>>("/users", {
    params: { page, perPage },
  });
  return data;
}

export async function getUserById(id: string) {
  const { data } = await api.get<ApiResponse<User>>(`/users/${id}`);
  return data.data;
}

export async function createUser(user: CreateUser) {
  const { data } = await api.post<ApiResponse<User>>("/users", user);
  return data;
}

export async function updateUser(id: string, user: UpdateUser) {
  const { data } = await api.put<ApiResponse<User>>(`/users/${id}`, user);
  return data;
}

export async function deleteUser(id: string) {
  const { data } = await api.delete<ApiResponse<void>>(`/users/${id}`);
  return data;
}
