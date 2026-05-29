import { DEFAULT_FACILITIES } from './facilityData';
import { buildFacilityDashboardStats } from './dashboardStats';
import { FacilityReservation } from './types';

const assert = (condition: boolean, message: string) => {
  if (!condition) throw new Error(message);
};

const now = new Date('2026-05-27T10:00:00');
const reservations: FacilityReservation[] = [
  {
    id: 'reservation_today',
    facilityId: DEFAULT_FACILITIES[0].id,
    facilityName: DEFAULT_FACILITIES[0].name,
    requesterId: 'user_1',
    requesterName: '신청자',
    requesterRole: 'staff',
    purpose: '수업',
    startAt: '2026-05-27T13:00',
    endAt: '2026-05-27T14:00',
    status: 'approved',
    createdAt: '2026-05-26T09:00:00Z',
    updatedAt: '2026-05-26T09:00:00Z',
  },
  {
    id: 'reservation_cancelled',
    facilityId: DEFAULT_FACILITIES[1].id,
    facilityName: DEFAULT_FACILITIES[1].name,
    requesterId: 'user_2',
    requesterName: '신청자2',
    requesterRole: 'user',
    purpose: '동아리',
    startAt: '2026-05-27T15:00',
    endAt: '2026-05-27T16:00',
    status: 'cancelled',
    createdAt: '2026-05-26T09:00:00Z',
    updatedAt: '2026-05-26T09:00:00Z',
  },
];

const stats = buildFacilityDashboardStats(DEFAULT_FACILITIES, reservations, now);

assert(stats.todayReservationCount === 1, 'today reservations should count active reservations only');
assert(stats.facilityUtilizationRate === 25, 'one of four facilities should be used this month');
assert(stats.monthlyReservationStats.length === 6, 'monthly stats should include six months');

console.log('dashboard stats tests passed');
