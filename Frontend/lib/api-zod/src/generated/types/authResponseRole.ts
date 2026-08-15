export type AuthResponseRole = typeof AuthResponseRole[keyof typeof AuthResponseRole];

export const AuthResponseRole = {
  CUSTOMER: 'CUSTOMER',
  ADMIN: 'ADMIN',
} as const;
