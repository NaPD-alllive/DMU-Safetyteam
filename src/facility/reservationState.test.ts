import { DEFAULT_FACILITIES } from './facilityData';
import { buildFacilityUsageSchedule, updateFacilityUsageSchedule } from './reservationState';
import type { ReservationFormValues } from './types';

const assert = (condition: boolean, message: string) => {
  if (!condition) throw new Error(message);
};

const values: ReservationFormValues = {
  facilityId: DEFAULT_FACILITIES[0].id,
  requesterOrganization: '건축학과',
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

assert(schedule.status === 'approved', 'facility team rental schedule should be confirmed by default');
assert(schedule.requesterName === '시설관리팀', 'rental schedule should record the registering manager');
assert(schedule.requesterOrganization === '건축학과', 'rental schedule should record requester organization');
assert(schedule.purpose === values.purpose, 'rental details should be preserved');

const updated = updateFacilityUsageSchedule(
  schedule,
  { ...values, requesterOrganization: '총학생회', purpose: '수정된 대관 목적', endAt: '2026-06-01T13:00' },
  DEFAULT_FACILITIES[0],
  new Date('2026-05-27T10:00:00Z')
);

assert(updated.requesterOrganization === '총학생회', 'rental requester organization should update');
assert(updated.purpose === '수정된 대관 목적', 'rental schedule details should update');
assert(updated.endAt === '2026-06-01T13:00', 'rental schedule end time should update');
assert(updated.updatedAt === '2026-05-27T10:00:00.000Z', 'rental schedule updatedAt should change');

console.log('reservation state tests passed');
