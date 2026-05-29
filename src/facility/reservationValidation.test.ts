import { DEFAULT_FACILITIES } from './facilityData';
import { FacilityReservation, ReservationFormValues } from './types';
import { hasReservationErrors, validateReservationForm } from './reservationValidation';

const assert = (condition: boolean, message: string) => {
  if (!condition) throw new Error(message);
};

const now = new Date('2026-05-27T00:00:00');
const facility = DEFAULT_FACILITIES[0];
const baseForm: ReservationFormValues = {
  facilityId: facility.id,
  purpose: '수업 운영',
  startAt: '2026-05-28T09:00',
  endAt: '2026-05-28T10:00',
};

const activeReservation: FacilityReservation = {
  id: 'reservation_test',
  facilityId: facility.id,
  facilityName: facility.name,
  requesterId: 'user_1',
  requesterName: '신청자',
  requesterRole: 'staff',
  purpose: '기존 예약',
  startAt: '2026-05-28T09:30',
  endAt: '2026-05-28T10:30',
  status: 'approved',
  createdAt: '2026-05-27T01:00:00Z',
  updatedAt: '2026-05-27T01:00:00Z',
};

assert(!hasReservationErrors(validateReservationForm(baseForm, DEFAULT_FACILITIES, [], now)), 'valid reservation should pass');
assert(Boolean(validateReservationForm({ ...baseForm, startAt: '2026-05-26T09:00' }, DEFAULT_FACILITIES, [], now).startAt), 'past reservation should fail');
assert(Boolean(validateReservationForm(baseForm, DEFAULT_FACILITIES, [activeReservation], now).overlap), 'overlap should fail');
assert(!validateReservationForm(baseForm, DEFAULT_FACILITIES, [activeReservation], now, activeReservation.id).overlap, 'editing the same schedule should not conflict with itself');
assert(Boolean(validateReservationForm({ ...baseForm, endAt: '2026-05-28T08:00' }, DEFAULT_FACILITIES, [], now).endAt), 'end before start should fail');

console.log('reservation validation tests passed');
