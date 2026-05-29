import { useEffect, useMemo, useState } from 'react';
import { FACILITY_SNAPSHOT_APPLIED_EVENT } from './facilitySnapshot';
import { maintenanceRepository } from './maintenanceRepository';
import {
  Facility,
  FacilityMaintenanceRequest,
  FacilityRole,
  MaintenanceFormValues,
  MaintenanceStatus,
} from './types';

interface MaintenanceActor {
  id: string;
  name: string;
  role: FacilityRole;
}

const PAGE_SIZE = 5;

const createRequest = (
  values: MaintenanceFormValues,
  facility: Facility,
  actor: MaintenanceActor,
): FacilityMaintenanceRequest => {
  const now = new Date().toISOString();
  return {
    id: `maintenance_${Date.now()}`,
    facilityId: facility.id,
    facilityName: facility.name,
    requesterId: actor.id,
    requesterName: actor.name,
    requesterRole: actor.role,
    title: values.title.trim(),
    description: values.description.trim(),
    priority: values.priority,
    status: 'submitted',
    photoUrl: values.photoUrl,
    createdAt: now,
    updatedAt: now,
  };
};

export const useMaintenanceRequests = (actor: MaintenanceActor) => {
  const [requests, setRequests] = useState<FacilityMaintenanceRequest[]>(() => maintenanceRepository.list());
  const [page, setPage] = useState(1);

  useEffect(() => maintenanceRepository.saveAll(requests), [requests]);

  useEffect(() => {
    const refreshRequests = () => {
      setRequests(maintenanceRepository.list());
      setPage(1);
    };

    window.addEventListener(FACILITY_SNAPSHOT_APPLIED_EVENT, refreshRequests);
    return () => window.removeEventListener(FACILITY_SNAPSHOT_APPLIED_EVENT, refreshRequests);
  }, []);

  const visibleRequests = useMemo(() => {
    if (actor.role === 'admin') return requests;
    return requests.filter((item) => item.requesterId === actor.id);
  }, [actor.id, actor.role, requests]);

  const sortedRequests = useMemo(() => [...visibleRequests].sort((a, b) =>
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  ), [visibleRequests]);

  const pageCount = Math.max(1, Math.ceil(sortedRequests.length / PAGE_SIZE));
  const pageItems = sortedRequests.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const addRequest = (values: MaintenanceFormValues, facility: Facility) =>
    setRequests((previous) => [createRequest(values, facility, actor), ...previous]);

  const changeStatus = (id: string, status: MaintenanceStatus) =>
    setRequests((previous) => previous.map((request) => (
      request.id === id ? { ...request, status, updatedAt: new Date().toISOString() } : request
    )));

  return {
    requests,
    visibleRequests: sortedRequests,
    page,
    pageCount,
    pageItems,
    setPage,
    addRequest,
    changeStatus,
  };
};
