import { DEFAULT_INSPECTION_SCHEDULES } from './facilityData';
import type { InspectionDataSource } from './dataSourceTypes';
import { FacilityInspectionSchedule } from './types';

const INSPECTIONS_STORAGE_KEY = 'facility_mvp_inspection_schedules';

const parseSchedules = (raw: string | null): FacilityInspectionSchedule[] => {
  if (!raw) return DEFAULT_INSPECTION_SCHEDULES;
  try {
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed) ? (parsed as FacilityInspectionSchedule[]) : DEFAULT_INSPECTION_SCHEDULES;
  } catch {
    return DEFAULT_INSPECTION_SCHEDULES;
  }
};

export const inspectionRepository: InspectionDataSource = {
  list(): FacilityInspectionSchedule[] {
    return parseSchedules(localStorage.getItem(INSPECTIONS_STORAGE_KEY));
  },

  saveAll(schedules: FacilityInspectionSchedule[]) {
    localStorage.setItem(INSPECTIONS_STORAGE_KEY, JSON.stringify(schedules));
  },
};
