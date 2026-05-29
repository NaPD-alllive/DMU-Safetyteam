import { DEFAULT_FACILITIES } from './facilityData';
import { EMPTY_MAINTENANCE_FORM, hasMaintenanceErrors, validateMaintenanceForm } from './maintenanceValidation';

const assert = (condition: boolean, message: string) => {
  if (!condition) throw new Error(message);
};

const validForm = {
  ...EMPTY_MAINTENANCE_FORM,
  facilityId: DEFAULT_FACILITIES[0].id,
  title: '빔프로젝터 점검',
  description: '강의 중 화면 깜빡임이 반복됩니다.',
};

const invalidForm = {
  ...EMPTY_MAINTENANCE_FORM,
  facilityId: '',
  title: '',
  description: '',
};

assert(!hasMaintenanceErrors(validateMaintenanceForm(validForm, DEFAULT_FACILITIES)), 'valid maintenance form should pass');
assert(Boolean(validateMaintenanceForm(invalidForm, DEFAULT_FACILITIES).facilityId), 'missing facility should fail');
assert(Boolean(validateMaintenanceForm(invalidForm, DEFAULT_FACILITIES).title), 'missing title should fail');
assert(Boolean(validateMaintenanceForm(invalidForm, DEFAULT_FACILITIES).description), 'missing description should fail');

console.log('maintenance validation tests passed');
