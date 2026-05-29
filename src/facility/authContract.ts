import type { FacilityRole } from './types';

export interface FacilityAuthProfile {
  id: string;
  email: string;
  displayName: string;
  role: FacilityRole;
  active: boolean;
}

export interface FacilityAuthSession {
  profile: FacilityAuthProfile | null;
  authenticated: boolean;
}

export const createFacilityAuthSession = (profile: FacilityAuthProfile | null): FacilityAuthSession => ({
  profile: profile?.active ? profile : null,
  authenticated: Boolean(profile?.active),
});

export const getSessionRole = (session: FacilityAuthSession): FacilityRole =>
  session.profile?.role || 'user';
