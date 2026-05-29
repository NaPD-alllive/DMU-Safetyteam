import type { UserProfile } from '../types';

export const PRIMARY_ADMIN_EMAIL = 'rhs@dongyang.ac.kr';
export const PRIMARY_ADMIN_USER_ID = 'user_manager';

export const normalizeTeamEmail = (email: string) => email.trim().toLowerCase();

export const resolveTeamUserByEmail = (
  users: UserProfile[],
  email: string,
): UserProfile | undefined => {
  const targetEmail = normalizeTeamEmail(email);
  return users.find((user) => user.email && normalizeTeamEmail(user.email) === targetEmail);
};

export const isPrimaryAdminUser = (user: UserProfile, email?: string | null) => {
  if (user.id !== PRIMARY_ADMIN_USER_ID) return false;
  if (!email) return true;
  return normalizeTeamEmail(email) === PRIMARY_ADMIN_EMAIL;
};
