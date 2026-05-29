import type { MaintenanceDataSource } from './dataSourceTypes';
import { FacilityMaintenanceRequest } from './types';

const MAINTENANCE_STORAGE_KEY = 'facility_mvp_maintenance_requests';

const parseRequests = (raw: string | null): FacilityMaintenanceRequest[] => {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed) ? (parsed as FacilityMaintenanceRequest[]) : [];
  } catch {
    return [];
  }
};

export const maintenanceRepository: MaintenanceDataSource = {
  list(): FacilityMaintenanceRequest[] {
    return parseRequests(localStorage.getItem(MAINTENANCE_STORAGE_KEY));
  },

  saveAll(requests: FacilityMaintenanceRequest[]) {
    localStorage.setItem(MAINTENANCE_STORAGE_KEY, JSON.stringify(requests));
  },
};
