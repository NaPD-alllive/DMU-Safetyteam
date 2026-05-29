import type {
  Facility,
  FacilityAsset,
  FacilityInspectionSchedule,
  FacilityMaintenanceRequest,
  FacilityNotification,
  FacilityReservation,
  FacilityUserAccess,
} from './types';

export interface FacilityDataSource {
  list(): Facility[];
  saveAll(facilities: Facility[]): void;
}

export interface ReservationDataSource {
  list(): FacilityReservation[];
  saveAll(reservations: FacilityReservation[]): void;
}

export interface MaintenanceDataSource {
  list(): FacilityMaintenanceRequest[];
  saveAll(requests: FacilityMaintenanceRequest[]): void;
}

export interface InspectionDataSource {
  list(): FacilityInspectionSchedule[];
  saveAll(schedules: FacilityInspectionSchedule[]): void;
}

export interface AssetDataSource {
  list(): FacilityAsset[];
  saveAll(assets: FacilityAsset[]): void;
}

export interface NotificationDataSource {
  list(): FacilityNotification[];
  saveAll(notifications: FacilityNotification[]): void;
}

export interface UserAccessDataSource {
  list(): FacilityUserAccess[];
  saveAll(accessList: FacilityUserAccess[]): void;
}
