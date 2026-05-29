import { MAX_FACILITY_IMAGE_BYTES, validateFacilityImageFile } from './facilityImage';

const assert = (condition: boolean, message: string) => {
  if (!condition) throw new Error(message);
};

assert(
  validateFacilityImageFile({ type: 'image/png', size: MAX_FACILITY_IMAGE_BYTES }) === undefined,
  'valid image should pass'
);

assert(
  Boolean(validateFacilityImageFile({ type: 'application/pdf', size: 1000 })),
  'non-image file should fail'
);

assert(
  Boolean(validateFacilityImageFile({ type: 'image/jpeg', size: MAX_FACILITY_IMAGE_BYTES + 1 })),
  'oversized image should fail'
);

console.log('facility image tests passed');
