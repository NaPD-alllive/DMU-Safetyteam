import {
  EMPTY_FACILITY_FORM,
  hasFacilityErrors,
  parseFacilityCapacity,
  validateFacilityForm,
} from './facilityValidation';

const assert = (condition: boolean, message: string) => {
  if (!condition) throw new Error(message);
};

const validForm = {
  ...EMPTY_FACILITY_FORM,
  name: '테스트 강의실',
  capacity: '30',
  location: '본관 2층',
  description: '예약 가능한 테스트 시설입니다.',
};

const invalidForm = {
  ...EMPTY_FACILITY_FORM,
  name: '',
  capacity: '0',
  location: '',
  description: '',
};

assert(!hasFacilityErrors(validateFacilityForm(validForm)), 'valid facility form should pass');
assert(!hasFacilityErrors(validateFacilityForm({ ...validForm, capacity: '1,200' })), 'comma capacity should pass');
assert(parseFacilityCapacity('1,200') === 1200, 'comma capacity should parse to number');
assert(Boolean(validateFacilityForm(invalidForm).name), 'missing name should fail');
assert(Boolean(validateFacilityForm(invalidForm).capacity), 'invalid capacity should fail');
assert(Boolean(validateFacilityForm(invalidForm).location), 'missing location should fail');
assert(Boolean(validateFacilityForm(invalidForm).description), 'missing description should fail');

console.log('facility validation tests passed');
