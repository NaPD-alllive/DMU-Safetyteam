import { buildReservationStatusNotification } from './notificationFactory';
import {
  countUnreadNotifications,
  getVisibleNotifications,
  markNotificationAsRead,
  markVisibleNotificationsAsRead,
} from './notificationState';
import { FacilityNotification, FacilityReservation } from './types';

const assert = (condition: boolean, message: string) => {
  if (!condition) throw new Error(message);
};

const reservation: FacilityReservation = {
  id: 'reservation_1',
  facilityId: 'facility_1',
  facilityName: '중강의실 301',
  requesterId: 'staff_1',
  requesterName: '박성훈',
  requesterRole: 'staff',
  purpose: '보강 수업',
  startAt: '2026-05-28T10:00',
  endAt: '2026-05-28T11:00',
  status: 'pending',
  createdAt: '2026-05-27T09:00:00Z',
  updatedAt: '2026-05-27T09:00:00Z',
};

const approved = buildReservationStatusNotification(reservation, 'approved');
const rejected = buildReservationStatusNotification(reservation, 'rejected');

assert(approved.kind === 'reservation_approved', 'approved reservation notification kind should match');
assert(rejected.kind === 'reservation_rejected', 'rejected reservation notification kind should match');
assert(approved.recipientId === reservation.requesterId, 'reservation notification should target requester');
assert(!approved.read && !rejected.read, 'new notifications should be unread');
assert(approved.sourceId === reservation.id, 'reservation source id should match');

const notifications: FacilityNotification[] = [
  { ...approved, id: 'n_old', createdAt: '2026-05-27T09:00:00Z' },
  { ...rejected, id: 'n_new', createdAt: '2026-05-27T11:00:00Z' },
  { ...rejected, id: 'n_read', read: true, createdAt: '2026-05-27T10:00:00Z' },
];

const adminVisible = getVisibleNotifications(notifications, { id: 'admin_1', role: 'admin' });
const staffVisible = getVisibleNotifications(notifications, { id: 'staff_1', role: 'staff' });

assert(adminVisible.length === 3, 'admin should see all notifications');
assert(adminVisible[0].id === 'n_new', 'visible notifications should be newest first');
assert(staffVisible.length === 3, 'staff should see own reservation notifications');
assert(countUnreadNotifications(adminVisible) === 2, 'unread count should ignore read notifications');

const singleRead = markNotificationAsRead(notifications, 'n_old');
assert(singleRead.find((item) => item.id === 'n_old')?.read === true, 'single notification should be read');

const staffRead = markVisibleNotificationsAsRead(notifications, staffVisible);
assert(staffRead.find((item) => item.id === 'n_new')?.read === true, 'visible staff notification should be read');
assert(staffRead.find((item) => item.id === 'n_old')?.read === true, 'other staff notification should be read');

console.log('notification tests passed');
