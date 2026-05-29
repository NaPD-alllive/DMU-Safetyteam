import { isFacilityModuleSnapshot } from './facilitySnapshot';

const assert = (condition: boolean, message: string) => {
  if (!condition) throw new Error(message);
};

const validSnapshot = {
  facilities: [],
  reservations: [],
  maintenanceRequests: [],
  inspectionSchedules: [],
  assets: [],
  notifications: [],
  userAccess: [],
};

assert(isFacilityModuleSnapshot(validSnapshot), 'complete facility module snapshot should pass');
assert(!isFacilityModuleSnapshot({ ...validSnapshot, reservations: undefined }), 'missing reservations should fail');
assert(!isFacilityModuleSnapshot({ ...validSnapshot, assets: {} }), 'non-array assets should fail');

console.log('facility snapshot tests passed');
