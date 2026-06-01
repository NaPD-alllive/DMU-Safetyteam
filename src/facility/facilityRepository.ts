import { DEFAULT_FACILITIES, normalizeFacilityCategory } from './facilityData';
import type { FacilityDataSource } from './dataSourceTypes';
import { Facility } from './types';

const FACILITIES_STORAGE_KEY = 'facility_mvp_facilities';

const parseFacilities = (raw: string | null): Facility[] => {
  if (!raw) return DEFAULT_FACILITIES;
  try {
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed)
      ? (parsed as Facility[]).map((facility) => ({
          ...facility,
          category: normalizeFacilityCategory(facility.category),
        }))
      : DEFAULT_FACILITIES;
  } catch {
    return DEFAULT_FACILITIES;
  }
};

export const facilityRepository: FacilityDataSource = {
  list(): Facility[] {
    return parseFacilities(localStorage.getItem(FACILITIES_STORAGE_KEY));
  },

  saveAll(facilities: Facility[]) {
    localStorage.setItem(FACILITIES_STORAGE_KEY, JSON.stringify(facilities));
  },
};
