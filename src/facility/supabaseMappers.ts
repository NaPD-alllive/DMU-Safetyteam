import type {
  Facility,
  FacilityAsset,
  FacilityAssetCondition,
  FacilityAssetStatus,
  FacilityInspectionSchedule,
  FacilityNotification,
  FacilityNotificationKind,
  FacilityRole,
  FacilityStatus,
  FacilityUserAccess,
  InspectionCycle,
  InspectionStatus,
  MaintenancePriority,
  MaintenanceStatus,
  ReservationStatus,
  FacilityMaintenanceRequest,
  FacilityReservation,
} from './types';

export interface SupabaseProfileRow {
  id: string;
  display_name: string;
  app_role: FacilityRole;
  active: boolean;
  specialty: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface SupabaseFacilityRow {
  id: string;
  name: string;
  category: string;
  capacity: number;
  location: string;
  description: string;
  status: FacilityStatus;
  image_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface SupabaseAssetRow {
  id: string;
  facility_id: string;
  name: string;
  asset_tag: string;
  category: string;
  condition: FacilityAssetCondition;
  status: FacilityAssetStatus;
  manager_name: string;
  purchased_at: string | null;
  last_checked_at: string | null;
  value: number | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface SupabaseReservationRow {
  id: string;
  facility_id: string;
  requester_id: string;
  purpose: string;
  start_at: string;
  end_at: string;
  status: ReservationStatus;
  reject_reason: string | null;
  created_at: string;
  updated_at: string;
}

export interface SupabaseMaintenanceRow {
  id: string;
  facility_id: string;
  requester_id: string;
  title: string;
  description: string;
  priority: MaintenancePriority;
  status: MaintenanceStatus;
  photo_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface SupabaseInspectionRow {
  id: string;
  facility_id: string;
  title: string;
  inspection_type: string;
  cycle: InspectionCycle;
  inspector_name: string;
  due_date: string;
  status: InspectionStatus;
  notes: string | null;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface SupabaseNotificationRow {
  id: string;
  recipient_id: string;
  kind: FacilityNotificationKind;
  title: string;
  message: string;
  source_id: string;
  read: boolean;
  created_at: string;
}

export const mapProfileRowToAccess = (row: SupabaseProfileRow): FacilityUserAccess => ({
  userId: row.id,
  role: row.app_role,
  active: row.active,
  updatedAt: row.updated_at,
});

export const mapFacilityRow = (row: SupabaseFacilityRow): Facility => ({
  id: row.id,
  name: row.name,
  category: row.category as Facility['category'],
  capacity: row.capacity,
  location: row.location,
  description: row.description,
  status: row.status,
  imageUrl: row.image_url || undefined,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

export const mapAssetRow = (row: SupabaseAssetRow, facilityName: string): FacilityAsset => ({
  id: row.id,
  facilityId: row.facility_id,
  facilityName,
  name: row.name,
  assetTag: row.asset_tag,
  category: row.category,
  condition: row.condition,
  status: row.status,
  managerName: row.manager_name,
  purchasedAt: row.purchased_at || undefined,
  lastCheckedAt: row.last_checked_at || undefined,
  value: row.value || undefined,
  notes: row.notes || undefined,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

export const mapReservationRow = (
  row: SupabaseReservationRow,
  facilityName: string,
  requesterName: string,
  requesterRole: FacilityRole,
): FacilityReservation => ({
  id: row.id,
  facilityId: row.facility_id,
  facilityName,
  requesterId: row.requester_id,
  requesterName,
  requesterRole,
  purpose: row.purpose,
  startAt: row.start_at,
  endAt: row.end_at,
  status: row.status,
  rejectReason: row.reject_reason || undefined,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

export const mapMaintenanceRow = (
  row: SupabaseMaintenanceRow,
  facilityName: string,
  requesterName: string,
  requesterRole: FacilityRole,
): FacilityMaintenanceRequest => ({
  id: row.id,
  facilityId: row.facility_id,
  facilityName,
  requesterId: row.requester_id,
  requesterName,
  requesterRole,
  title: row.title,
  description: row.description,
  priority: row.priority,
  status: row.status,
  photoUrl: row.photo_url || undefined,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

export const mapInspectionRow = (
  row: SupabaseInspectionRow,
  facilityName: string,
): FacilityInspectionSchedule => ({
  id: row.id,
  facilityId: row.facility_id,
  facilityName,
  title: row.title,
  inspectionType: row.inspection_type,
  cycle: row.cycle,
  inspectorName: row.inspector_name,
  dueDate: row.due_date,
  status: row.status,
  notes: row.notes || undefined,
  completedAt: row.completed_at || undefined,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

export const mapNotificationRow = (
  row: SupabaseNotificationRow,
  recipientName: string,
): FacilityNotification => ({
  id: row.id,
  recipientId: row.recipient_id,
  recipientName,
  kind: row.kind,
  title: row.title,
  message: row.message,
  sourceId: row.source_id,
  read: row.read,
  createdAt: row.created_at,
});
