import type { Facility, FacilityInspectionSchedule, InspectionFormValues } from './types';

export type InspectionDisplayStatus = 'scheduled' | 'dueSoon' | 'overdue' | 'completed';

const startOfDay = (value: Date) => new Date(value.getFullYear(), value.getMonth(), value.getDate()).getTime();

export const getInspectionDisplayStatus = (
  schedule: FacilityInspectionSchedule,
  now = new Date(),
): InspectionDisplayStatus => {
  if (schedule.status === 'completed') return 'completed';
  const remainingDays = Math.ceil((startOfDay(new Date(schedule.dueDate)) - startOfDay(now)) / 86400000);
  if (remainingDays < 0) return 'overdue';
  if (remainingDays <= 7) return 'dueSoon';
  return 'scheduled';
};

export const sortInspectionSchedules = (schedules: FacilityInspectionSchedule[]) =>
  [...schedules].sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());

export const countOpenInspectionRisks = (
  schedules: FacilityInspectionSchedule[],
  now = new Date(),
) => schedules.filter((schedule) => {
  const status = getInspectionDisplayStatus(schedule, now);
  return status === 'overdue' || status === 'dueSoon';
}).length;

export const buildInspectionSchedule = (
  values: InspectionFormValues,
  facility: Facility,
  now = new Date(),
): FacilityInspectionSchedule => {
  const timestamp = now.toISOString();

  return {
    id: `inspection_${now.getTime()}`,
    facilityId: facility.id,
    facilityName: facility.name,
    title: values.title.trim(),
    inspectionType: values.inspectionType.trim(),
    cycle: values.cycle,
    inspectorName: values.inspectorName.trim(),
    dueDate: values.dueDate,
    status: 'scheduled',
    notes: values.notes?.trim() || undefined,
    createdAt: timestamp,
    updatedAt: timestamp,
  };
};

export const addInspectionSchedule = (
  schedules: FacilityInspectionSchedule[],
  values: InspectionFormValues,
  facility: Facility,
  now = new Date(),
) => [
  buildInspectionSchedule(values, facility, now),
  ...schedules,
];

export const completeInspectionSchedule = (
  schedules: FacilityInspectionSchedule[],
  id: string,
  now = new Date().toISOString(),
) => schedules.map((schedule) => schedule.id === id
  ? { ...schedule, status: 'completed' as const, completedAt: now, updatedAt: now }
  : schedule);

export const reopenInspectionSchedule = (
  schedules: FacilityInspectionSchedule[],
  id: string,
  now = new Date().toISOString(),
) => schedules.map((schedule) => schedule.id === id
  ? { ...schedule, status: 'scheduled' as const, completedAt: undefined, updatedAt: now }
  : schedule);
