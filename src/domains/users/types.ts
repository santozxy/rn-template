import type { UserRole } from "@/domains/auth/types";

export interface User {
  id: string;
  tenantId: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
}

export interface CreateUser {
  name: string;
  email: string;
  phone: string;
  password: string;
  role?: UserRole;
}

export interface UpdateUser {
  name?: string;
  email?: string;
  phone?: string;
  password?: string;
  role?: UserRole;
}
