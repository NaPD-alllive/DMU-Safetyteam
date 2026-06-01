import { useEffect, useMemo, useState } from 'react';
import { FACILITY_SNAPSHOT_APPLIED_EVENT } from './facilitySnapshot';
import { inspectionRepository } from './inspectionRepository';
import {
  addInspectionSchedule,
  completeInspectionSchedule,
  reopenInspectionSchedule,
  sortInspectionSchedules,
} from './inspectionState';
import type { Facility, InspectionFormValues } from './types';

const PAGE_SIZE = 5;

export const useInspectionSchedules = () => {
  const [schedules, setSchedules] = useState(() => inspectionRepository.list());
  const [page, setPage] = useState(1);

  useEffect(() => inspectionRepository.saveAll(schedules), [schedules]);

  useEffect(() => {
    const refreshSchedules = () => {
      setSchedules(inspectionRepository.list());
      setPage(1);
    };

    window.addEventListener(FACILITY_SNAPSHOT_APPLIED_EVENT, refreshSchedules);
    return () => window.removeEventListener(FACILITY_SNAPSHOT_APPLIED_EVENT, refreshSchedules);
  }, []);

  const sortedSchedules = useMemo(() => sortInspectionSchedules(schedules), [schedules]);
  const pageCount = Math.max(1, Math.ceil(sortedSchedules.length / PAGE_SIZE));
  const pageItems = sortedSchedules.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const addSchedule = (values: InspectionFormValues, facility: Facility) => {
    setSchedules((previous) => addInspectionSchedule(previous, values, facility));
    setPage(1);
  };

  const completeSchedule = (id: string) =>
    setSchedules((previous) => completeInspectionSchedule(previous, id));

  const reopenSchedule = (id: string) =>
    setSchedules((previous) => reopenInspectionSchedule(previous, id));

  return {
    schedules,
    sortedSchedules,
    page,
    pageCount,
    pageItems,
    setPage,
    addSchedule,
    completeSchedule,
    reopenSchedule,
  };
};
