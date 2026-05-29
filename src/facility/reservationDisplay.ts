import type { ReservationStatus } from './types';

export const RESERVATION_STATUS_LABEL: Record<ReservationStatus, string> = {
  pending: '확인필요',
  approved: '사용확정',
  rejected: '보류',
  cancelled: '취소',
};

export const formatReservationDateTime = (value: string) =>
  new Date(value).toLocaleString('ko-KR');
