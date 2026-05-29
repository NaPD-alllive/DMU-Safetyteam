import type { UserAccessDataSource } from './dataSourceTypes';
import { FacilityUserAccess } from './types';

const USER_ACCESS_STORAGE_KEY = 'facility_mvp_user_access';

const parseUserAccess = (raw: string | null): FacilityUserAccess[] => {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed) ? (parsed as FacilityUserAccess[]) : [];
  } catch {
    return [];
  }
};

export const userAccessRepository: UserAccessDataSource = {
  list(): FacilityUserAccess[] {
    return parseUserAccess(localStorage.getItem(USER_ACCESS_STORAGE_KEY));
  },

  saveAll(accessList: FacilityUserAccess[]) {
    localStorage.setItem(USER_ACCESS_STORAGE_KEY, JSON.stringify(accessList));
  },
};
