import {
  FacilityNotification,
  FacilityReservation,
  ReservationStatus,
} from './types';

const createNotificationId = () =>
  `facility_notification_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;

export const buildReservationStatusNotification = (
  reservation: FacilityReservation,
  status: Extract<ReservationStatus, 'approved' | 'rejected'>,
): FacilityNotification => {
  const approved = status === 'approved';
  return {
    id: createNotificationId(),
    recipientId: reservation.requesterId,
    recipientName: reservation.requesterName,
    kind: approved ? 'reservation_approved' : 'reservation_rejected',
    title: approved ? '예약 승인 알림' : '예약 반려 알림',
    message: `${reservation.facilityName} 예약이 ${approved ? '승인' : '반려'}되었습니다.`,
    sourceId: reservation.id,
    read: false,
    createdAt: new Date().toISOString(),
  };
};
