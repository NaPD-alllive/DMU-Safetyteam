import type { Facility, FacilityReservation, FacilityRole, ReservationFormValues, ReservationStatus } from './types';

export interface ReservationActor {
  id: string;
  name: string;
  role: FacilityRole;
}

export const buildFacilityUsageSchedule = (
  values: ReservationFormValues,
  facility: Facility,
  actor: ReservationActor,
  now = new Date(),
): FacilityReservation => {
  const timestamp = now.toISOString();

  return {
    id: `reservation_${now.getTime()}`,
    facilityId: facility.id,
    facilityName: facility.name,
    requesterId: actor.id,
    requesterName: actor.name,
    requesterRole: actor.role,
    purpose: values.purpose.trim(),
    startAt: values.startAt,
    endAt: values.endAt,
    status: 'approved',
    createdAt: timestamp,
    updatedAt: timestamp,
  };
};

export const updateFacilityUsageSchedule = (
  reservation: FacilityReservation,
  values: ReservationFormValues,
  facility: Facility,
  now = new Date(),
): FacilityReservation => ({
  ...reservation,
  facilityId: facility.id,
  facilityName: facility.name,
  purpose: values.purpose.trim(),
  startAt: values.startAt,
  endAt: values.endAt,
  status: reservation.status === 'cancelled' ? 'approved' : reservation.status,
  updatedAt: now.toISOString(),
});

export const updateReservationStatus = (
  reservations: FacilityReservation[],
  id: string,
  status: ReservationStatus,
  rejectReason?: string,
  now = new Date(),
) => reservations.map((reservation) => (
  reservation.id === id
    ? { ...reservation, status, rejectReason, updatedAt: now.toISOString() }
    : reservation
));
