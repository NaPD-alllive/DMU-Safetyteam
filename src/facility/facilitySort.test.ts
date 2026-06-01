import { sortFacilities } from './facilitySort';
import type { Facility } from './types';

const assert = (condition: boolean, message: string) => {
  if (!condition) throw new Error(message);
};

const facilities: Facility[] = [
  {
    id: 'b',
    name: '본관 202 회의실',
    category: '회의실',
    capacity: 20,
    location: '본관 2층',
    description: '회의실',
    status: '운영중',
    createdAt: '2026-05-01T00:00:00Z',
    updatedAt: '2026-05-01T00:00:00Z',
  },
  {
    id: 'a',
    name: '공학관 실습실',
    category: '실습실',
    capacity: 12,
    location: '공학관 4층',
    description: '실습실',
    status: '점검중',
    createdAt: '2026-05-01T00:00:00Z',
    updatedAt: '2026-05-01T00:00:00Z',
  },
];

assert(sortFacilities(facilities, 'name', 'asc')[0].id === 'a', 'name asc should sort');
assert(sortFacilities(facilities, 'capacity', 'desc')[0].id === 'b', 'capacity desc should sort');
assert(facilities[0].id === 'b', 'sort should not mutate source list');

console.log('facility sort tests passed');
