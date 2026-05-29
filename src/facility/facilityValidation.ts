import { FacilityFormValues, FacilityValidationErrors } from './types';

export const EMPTY_FACILITY_FORM: FacilityFormValues = {
  name: '',
  category: '강의실',
  capacity: '',
  location: '',
  description: '',
  status: '운영중',
};

export const parseFacilityCapacity = (value: string) => {
  const normalized = value.trim().replace(/,/g, '');
  if (!/^\d+$/.test(normalized)) return NaN;
  return Number(normalized);
};

export const validateFacilityForm = (values: FacilityFormValues): FacilityValidationErrors => {
  const errors: FacilityValidationErrors = {};
  const capacity = parseFacilityCapacity(values.capacity);

  if (!values.name.trim()) errors.name = '시설명을 입력하세요.';
  if (!Number.isFinite(capacity) || capacity < 1) errors.capacity = '수용인원은 1명 이상이어야 합니다.';
  if (!values.location.trim()) errors.location = '위치를 입력하세요.';
  if (!values.description.trim()) errors.description = '시설 설명을 입력하세요.';

  return errors;
};

export const hasFacilityErrors = (errors: FacilityValidationErrors) =>
  Object.values(errors).some(Boolean);
