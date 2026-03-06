export type UserRole = 'local' | 'repartidor';

export interface UserProfile {
  uid: string;
  email: string;
  role: UserRole;
}

export const USER_ROLE_LABELS: Record<UserRole, string> = {
  local: 'Local',
  repartidor: 'Repartidor'
};
