import { DEFAULT_FACILITIES } from './facilityData';
import { buildFacilityUsageSchedule, updateFacilityUsageSchedule } from './reservationState';
import type { ReservationFormValues } from './types';

const assert = (condition: boolean, message: string) => {
  if (!condition) throw new Error(message);
};

const values: ReservationFormValues = {
  facilityId: DEFAULT_FACILITIES[0].id,
  purpose: '학과 행사 / 교무팀 / 내선 1234',
  startAt: '2026-06-01T10:00',
  endAt: '2026-06-01T12:00',
};

const schedule = buildFacilityUsageSchedule(
  values,
  DEFAULT_FACILITIES[0],
  { id: 'admin_1', name: '시설관리팀', role: 'admin' },
  new Date('2026-05-27T09:00:00Z')
);

assert(schedule.status === 'approved', 'facility team usage schedule should be confirmed by default');
assert(schedule.requesterName === '시설관리팀', 'usage schedule should record the registering manager');
assert(schedule.purpose === values.purpose, 'usage details should be preserved');

const updated = updateFacilityUsageSchedule(
  schedule,
  { ...values, purpose: '수정된 사용 목적', endAt: '2026-06-01T13:00' },
  DEFAULT_FACILITIES[0],
  new Date('2026-05-27T10:00:00Z')
);

assert(updated.purpose === '수정된 사용 목적', 'usage schedule details should update');
assert(updated.endAt === '2026-06-01T13:00', 'usage schedule end time should update');
assert(updated.updatedAt === '2026-05-27T10:00:00.000Z', 'usage schedule updatedAt should change');

console.log('reservation state tests passed');
