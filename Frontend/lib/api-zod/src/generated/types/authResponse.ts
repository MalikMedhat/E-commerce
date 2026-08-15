import type { AuthResponseRole } from './authResponseRole';

export interface AuthResponse {
  userId: number;
  email: string;
  token: string;
  refreshToken: string;
  role: AuthResponseRole;
}
