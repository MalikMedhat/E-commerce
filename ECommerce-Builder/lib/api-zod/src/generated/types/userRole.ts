export type UserRole = typeof UserRole[keyof typeof UserRole];

export const UserRole = {
  CUSTOMER: 'CUSTOMER',
  ADMIN: 'ADMIN',
} as const;
