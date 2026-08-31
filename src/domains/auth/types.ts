export interface Credentials {
  email: string;
  password: string;
}

export type UserRole = "admin" | "member";

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

export interface Auth {
  token: string;
  user: User;
}
