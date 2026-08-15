import type { UserRole } from './userRole';

export interface User {
  userId: number;
  email: string;
  role: UserRole;
}
