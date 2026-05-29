import type { FacilityRole } from './types';

export const canManageFacilities = (role: FacilityRole) => role === 'admin';

export const canManageReservations = (role: FacilityRole) => role === 'admin';

export const canViewAllReservations = (role: FacilityRole) => role === 'admin' || role === 'staff';

export const canRequestMaintenance = (role: FacilityRole) => role === 'admin' || role === 'staff';

export const canManageMaintenance = (role: FacilityRole) => role === 'admin';

export const canManageUserAccess = (role: FacilityRole) => role === 'admin';

export const canManageInspections = (role: FacilityRole) => role === 'admin';

export const canManageAssets = (role: FacilityRole) => role === 'admin';
