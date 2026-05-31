import {
  Facility,
  FacilityReservation,
  ReservationFormValues,
  ReservationValidationErrors,
} from './types';

const ACTIVE_RESERVATION_STATUSES = ['pending', 'approved'];

export const EMPTY_RESERVATION_FORM: ReservationFormValues = {
  facilityId: '',
  requesterOrganization: '',
  purpose: '',
  startAt: '',
  endAt: '',
};

const overlaps = (startAt: string, endAt: string, reservation: FacilityReservation) => {
  const start = new Date(startAt).getTime();
  const end = new Date(endAt).getTime();
  const otherStart = new Date(reservation.startAt).getTime();
  const otherEnd = new Date(reservation.endAt).getTime();
  return start < otherEnd && end > otherStart;
};

export const hasReservationConflict = (
  values: ReservationFormValues,
  reservations: FacilityReservation[],
  ignoredReservationId = '',
) => reservations.some((reservation) =>
  reservation.id !== ignoredReservationId &&
  reservation.facilityId === values.facilityId &&
  ACTIVE_RESERVATION_STATUSES.includes(reservation.status) &&
  overlaps(values.startAt, values.endAt, reservation)
);

export const validateReservationForm = (
  values: ReservationFormValues,
  facilities: Facility[],
  reservations: FacilityReservation[],
  now = new Date(),
  ignoredReservationId = '',
): ReservationValidationErrors => {
  const errors: ReservationValidationErrors = {};
  const start = new Date(values.startAt);
  const end = new Date(values.endAt);
  const facility = facilities.find((item) => item.id === values.facilityId);

  if (!values.facilityId) errors.facilityId = '시설을 선택하세요.';
  if (facility?.status !== '운영중') errors.facilityId = '대관 가능한 시설만 등록할 수 있습니다.';
  if (!values.requesterOrganization.trim()) errors.requesterOrganization = '대관요청기관을 입력하세요.';
  if (!values.purpose.trim()) errors.purpose = '대관 목적 및 기타 정보를 입력하세요.';
  if (!values.startAt || Number.isNaN(start.getTime())) errors.startAt = '시작 시간을 입력하세요.';
  if (!values.endAt || Number.isNaN(end.getTime())) errors.endAt = '종료 시간을 입력하세요.';
  if (!errors.startAt && start.getTime() < now.getTime()) errors.startAt = '과거 시간은 대관 일정으로 등록할 수 없습니다.';
  if (!errors.endAt && !errors.startAt && end.getTime() <= start.getTime()) errors.endAt = '종료 시간은 시작 시간 이후여야 합니다.';
  if (!errors.startAt && !errors.endAt && hasReservationConflict(values, reservations, ignoredReservationId)) {
    errors.overlap = '동일 시간대에 이미 등록된 대관 일정이 있습니다.';
  }

  return errors;
};

export const hasReservationErrors = (errors: ReservationValidationErrors) =>
  Object.values(errors).some(Boolean);
