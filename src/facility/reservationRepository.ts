import type { ReservationDataSource } from './dataSourceTypes';
import { FacilityReservation } from './types';

const RESERVATIONS_STORAGE_KEY = 'facility_mvp_reservations';

const parseReservations = (raw: string | null): FacilityReservation[] => {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed) ? (parsed as FacilityReservation[]) : [];
  } catch {
    return [];
  }
};

export const reservationRepository: ReservationDataSource = {
  list(): FacilityReservation[] {
    return parseReservations(localStorage.getItem(RESERVATIONS_STORAGE_KEY));
  },

  saveAll(reservations: FacilityReservation[]) {
    localStorage.setItem(RESERVATIONS_STORAGE_KEY, JSON.stringify(reservations));
  },
};
