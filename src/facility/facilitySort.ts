import type { Facility } from './types';

export type FacilitySortField = 'name' | 'category' | 'status' | 'capacity' | 'location';
export type SortDirection = 'asc' | 'desc';

const compareText = (first: string, second: string) =>
  first.localeCompare(second, 'ko-KR', { numeric: true, sensitivity: 'base' });

const compareByField = (first: Facility, second: Facility, field: FacilitySortField) => {
  if (field === 'capacity') return first.capacity - second.capacity;
  return compareText(String(first[field]), String(second[field]));
};

export const sortFacilities = (
  facilities: Facility[],
  field: FacilitySortField,
  direction: SortDirection
) => {
  const multiplier = direction === 'asc' ? 1 : -1;

  return [...facilities].sort((first, second) => {
    const result = compareByField(first, second, field);
    if (result !== 0) return result * multiplier;
    return compareText(first.name, second.name) || compareText(first.id, second.id);
  });
};
