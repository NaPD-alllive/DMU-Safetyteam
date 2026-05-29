import { assetRepository } from './assetRepository';
import { facilityRepository } from './facilityRepository';
import { inspectionRepository } from './inspectionRepository';
import { maintenanceRepository } from './maintenanceRepository';
import { notificationRepository } from './notificationRepository';
import { reservationRepository } from './reservationRepository';
import { userAccessRepository } from './userAccessRepository';
import type { FacilityModuleSnapshot } from './types';

export const FACILITY_SNAPSHOT_APPLIED_EVENT = 'facility-module-snapshot-applied';

export const isFacilityModuleSnapshot = (value: unknown): value is FacilityModuleSnapshot => {
  const candidate = value as FacilityModuleSnapshot;

  return Boolean(
    candidate &&
      Array.isArray(candidate.facilities) &&
      Array.isArray(candidate.reservations) &&
      Array.isArray(candidate.maintenanceRequests) &&
      Array.isArray(candidate.inspectionSchedules) &&
      Array.isArray(candidate.assets) &&
      Array.isArray(candidate.notifications) &&
      Array.isArray(candidate.userAccess)
  );
};

export const readFacilityModuleSnapshot = (): FacilityModuleSnapshot => ({
  facilities: facilityRepository.list(),
  reservations: reservationRepository.list(),
  maintenanceRequests: maintenanceRepository.list(),
  inspectionSchedules: inspectionRepository.list(),
  assets: assetRepository.list(),
  notifications: notificationRepository.list(),
  userAccess: userAccessRepository.list(),
});

export const writeFacilityModuleSnapshot = (snapshot: FacilityModuleSnapshot) => {
  facilityRepository.saveAll(snapshot.facilities);
  reservationRepository.saveAll(snapshot.reservations);
  maintenanceRepository.saveAll(snapshot.maintenanceRequests);
  inspectionRepository.saveAll(snapshot.inspectionSchedules);
  assetRepository.saveAll(snapshot.assets);
  notificationRepository.saveAll(snapshot.notifications);
  userAccessRepository.saveAll(snapshot.userAccess);
  window.dispatchEvent(new Event(FACILITY_SNAPSHOT_APPLIED_EVENT));
};
