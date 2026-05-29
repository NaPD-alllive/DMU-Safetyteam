import { Facility, MaintenanceFormValues, MaintenanceValidationErrors } from './types';

export const EMPTY_MAINTENANCE_FORM: MaintenanceFormValues = {
  facilityId: '',
  title: '',
  description: '',
  priority: 'normal',
};

export const validateMaintenanceForm = (
  values: MaintenanceFormValues,
  facilities: Facility[],
): MaintenanceValidationErrors => {
  const errors: MaintenanceValidationErrors = {};
  const facilityExists = facilities.some((facility) => facility.id === values.facilityId);

  if (!values.facilityId || !facilityExists) errors.facilityId = '시설을 선택하세요.';
  if (!values.title.trim()) errors.title = '요청 제목을 입력하세요.';
  if (!values.description.trim()) errors.description = '고장 또는 요청 내용을 입력하세요.';

  return errors;
};

export const hasMaintenanceErrors = (errors: MaintenanceValidationErrors) =>
  Object.values(errors).some(Boolean);
