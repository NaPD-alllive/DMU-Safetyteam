import {
  addInspectionSchedule,
  completeInspectionSchedule,
  countOpenInspectionRisks,
  getInspectionDisplayStatus,
  reopenInspectionSchedule,
  sortInspectionSchedules,
} from './inspectionState';
import type { Facility, FacilityInspectionSchedule } from './types';

const assert = (condition: boolean, message: string) => {
  if (!condition) throw new Error(message);
};

const now = new Date('2026-05-27T10:00:00');
const schedules: FacilityInspectionSchedule[] = [
  {
    id: 'late',
    facilityId: 'facility_1',
    facilityName: '실습실',
    title: '지연 점검',
    inspectionType: '안전',
    cycle: 'monthly',
    inspectorName: '김익현',
    dueDate: '2026-05-20',
    status: 'scheduled',
    createdAt: '2026-05-01T00:00:00Z',
    updatedAt: '2026-05-01T00:00:00Z',
  },
  {
    id: 'soon',
    facilityId: 'facility_2',
    facilityName: '강의실',
    title: '임박 점검',
    inspectionType: '전기',
    cycle: 'quarterly',
    inspectorName: '이인혁',
    dueDate: '2026-05-30',
    status: 'scheduled',
    createdAt: '2026-05-01T00:00:00Z',
    updatedAt: '2026-05-01T00:00:00Z',
  },
  {
    id: 'done',
    facilityId: 'facility_3',
    facilityName: '체육실',
    title: '완료 점검',
    inspectionType: '소방',
    cycle: 'monthly',
    inspectorName: '오승훈',
    dueDate: '2026-05-20',
    status: 'completed',
    completedAt: '2026-05-21T00:00:00Z',
    createdAt: '2026-05-01T00:00:00Z',
    updatedAt: '2026-05-21T00:00:00Z',
  },
];

assert(getInspectionDisplayStatus(schedules[0], now) === 'overdue', 'past scheduled inspection should be overdue');
assert(getInspectionDisplayStatus(schedules[1], now) === 'dueSoon', 'inspection within seven days should be due soon');
assert(getInspectionDisplayStatus(schedules[2], now) === 'completed', 'completed inspection should remain completed');
assert(countOpenInspectionRisks(schedules, now) === 2, 'overdue and due soon inspections should count as risks');
assert(sortInspectionSchedules(schedules)[0].id === 'late', 'inspection schedules should sort by due date');

const completed = completeInspectionSchedule(schedules, 'soon', '2026-05-27T11:00:00Z');
assert(completed.find((item) => item.id === 'soon')?.status === 'completed', 'complete action should update status');

const reopened = reopenInspectionSchedule(completed, 'soon', '2026-05-27T12:00:00Z');
assert(reopened.find((item) => item.id === 'soon')?.status === 'scheduled', 'reopen action should restore scheduled status');
assert(reopened.find((item) => item.id === 'soon')?.completedAt === undefined, 'reopen action should clear completedAt');

const facility: Facility = {
  id: 'facility_new',
  name: '8호관 대강당',
  category: '건물명',
  capacity: 120,
  location: '8호관',
  description: '행사 및 체육 수업 활용',
  status: '운영중',
  createdAt: '2026-05-01T00:00:00Z',
  updatedAt: '2026-05-01T00:00:00Z',
};

const added = addInspectionSchedule(
  schedules,
  {
    facilityId: facility.id,
    title: '승강기 정기점검',
    inspectionType: '승강기',
    cycle: 'monthly',
    inspectorName: '오승훈',
    dueDate: '2026-06-10',
    notes: '정기 안전 확인',
  },
  facility,
  new Date('2026-05-27T13:00:00Z'),
);

assert(added[0].id === 'inspection_1779886800000', 'add action should create predictable schedule id');
assert(added[0].facilityName === '8호관 대강당', 'add action should copy selected facility name');
assert(added[0].status === 'scheduled', 'new inspection should start as scheduled');

console.log('inspection state tests passed');
