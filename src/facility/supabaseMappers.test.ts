import {
  mapAssetRow,
  mapFacilityRow,
  mapInspectionRow,
  mapMaintenanceRow,
  mapNotificationRow,
  mapProfileRowToAccess,
  mapReservationRow,
  SupabaseAssetRow,
  SupabaseFacilityRow,
  SupabaseInspectionRow,
  SupabaseMaintenanceRow,
  SupabaseNotificationRow,
  SupabaseProfileRow,
  SupabaseReservationRow,
} from './supabaseMappers';

const assert = (condition: boolean, message: string) => {
  if (!condition) throw new Error(message);
};

const profileRow: SupabaseProfileRow = {
  id: 'profile_1',
  display_name: '나형석',
  app_role: 'admin',
  active: true,
  specialty: '시설관리 총괄',
  avatar_url: null,
  created_at: '2026-05-01T00:00:00Z',
  updated_at: '2026-05-02T00:00:00Z',
};

const facilityRow: SupabaseFacilityRow = {
  id: 'facility_1',
  name: '본관 101 스마트 강의실',
  category: '강의실',
  capacity: 80,
  location: '본관 1층',
  description: '스마트 강의실',
  status: '운영중',
  image_url: null,
  created_at: '2026-05-01T00:00:00Z',
  updated_at: '2026-05-02T00:00:00Z',
};

const assetRow: SupabaseAssetRow = {
  id: 'asset_1',
  facility_id: 'facility_1',
  name: '프로젝터',
  asset_tag: 'A-001',
  category: '영상',
  condition: 'good',
  status: 'active',
  manager_name: '박성훈',
  purchased_at: null,
  last_checked_at: '2026-05-20',
  value: 1000,
  notes: null,
  created_at: '2026-05-01T00:00:00Z',
  updated_at: '2026-05-02T00:00:00Z',
};

const reservationRow: SupabaseReservationRow = {
  id: 'reservation_1',
  facility_id: 'facility_1',
  requester_id: 'profile_2',
  purpose: '수업',
  start_at: '2026-05-28T09:00:00Z',
  end_at: '2026-05-28T10:00:00Z',
  status: 'pending',
  reject_reason: null,
  created_at: '2026-05-01T00:00:00Z',
  updated_at: '2026-05-02T00:00:00Z',
};

const maintenanceRow: SupabaseMaintenanceRow = {
  id: 'maintenance_1',
  facility_id: 'facility_1',
  requester_id: 'profile_2',
  title: '마이크 점검',
  description: '잡음 발생',
  priority: 'normal',
  status: 'submitted',
  photo_url: null,
  created_at: '2026-05-01T00:00:00Z',
  updated_at: '2026-05-02T00:00:00Z',
};

const inspectionRow: SupabaseInspectionRow = {
  id: 'inspection_1',
  facility_id: 'facility_1',
  title: '전기 점검',
  inspection_type: '전기',
  cycle: 'quarterly',
  inspector_name: '이인혁',
  due_date: '2026-06-07',
  status: 'scheduled',
  notes: null,
  completed_at: null,
  created_at: '2026-05-01T00:00:00Z',
  updated_at: '2026-05-02T00:00:00Z',
};

const notificationRow: SupabaseNotificationRow = {
  id: 'notification_1',
  recipient_id: 'profile_2',
  kind: 'reservation_approved',
  title: '예약 승인',
  message: '승인되었습니다.',
  source_id: 'reservation_1',
  read: false,
  created_at: '2026-05-01T00:00:00Z',
};

assert(mapProfileRowToAccess(profileRow).role === 'admin', 'profile role should map');
assert(mapFacilityRow(facilityRow).imageUrl === undefined, 'null image should become undefined');
assert(mapAssetRow(assetRow, facilityRow.name).facilityName === facilityRow.name, 'asset facility name should map');
assert(mapAssetRow(assetRow, facilityRow.name).assetTag === assetRow.asset_tag, 'asset tag should map');
assert(mapReservationRow(reservationRow, facilityRow.name, '박성훈', 'staff').requesterRole === 'staff', 'reservation requester role should map');
assert(mapMaintenanceRow(maintenanceRow, facilityRow.name, '박성훈', 'staff').photoUrl === undefined, 'null maintenance photo should become undefined');
assert(mapInspectionRow(inspectionRow, facilityRow.name).inspectionType === '전기', 'inspection type should map');
assert(mapNotificationRow(notificationRow, '박성훈').recipientName === '박성훈', 'notification recipient name should map');

console.log('supabase mapper tests passed');
