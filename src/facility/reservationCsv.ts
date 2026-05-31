import { RESERVATION_STATUS_LABEL } from './reservationDisplay';
import type { FacilityReservation } from './types';

const CSV_HEADERS = ['상태', '시설명', '대관 시작', '대관 종료', '대관요청기관', '등록자', '기타 정보', '등록일', '수정일'];

const escapeCsvCell = (value: string | number) =>
  `"${String(value).replace(/"/g, '""')}"`;

const sortByStartAt = (reservations: FacilityReservation[]) =>
  [...reservations].sort((first, second) =>
    new Date(first.startAt).getTime() - new Date(second.startAt).getTime()
  );

export const buildUsageScheduleCsv = (reservations: FacilityReservation[]) => {
  const rows = sortByStartAt(reservations).map((reservation) => [
    RESERVATION_STATUS_LABEL[reservation.status],
    reservation.facilityName,
    new Date(reservation.startAt).toLocaleString('ko-KR'),
    new Date(reservation.endAt).toLocaleString('ko-KR'),
    reservation.requesterOrganization || '',
    reservation.requesterName,
    reservation.purpose,
    new Date(reservation.createdAt).toLocaleString('ko-KR'),
    new Date(reservation.updatedAt).toLocaleString('ko-KR'),
  ]);

  return [CSV_HEADERS, ...rows].map((row) => row.map(escapeCsvCell).join(',')).join('\n');
};
