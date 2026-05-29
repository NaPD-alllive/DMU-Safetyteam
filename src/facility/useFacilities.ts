import { useEffect, useMemo, useState } from 'react';
import { FACILITY_SNAPSHOT_APPLIED_EVENT } from './facilitySnapshot';
import { facilityRepository } from './facilityRepository';
import { parseFacilityCapacity } from './facilityValidation';
import { Facility, FacilityFormValues, FacilityCategory, FacilityStatus } from './types';

const PAGE_SIZE = 6;

const createFacility = (values: FacilityFormValues): Facility => {
  const now = new Date().toISOString();
  return {
    id: `facility_${Date.now()}`,
    name: values.name.trim(),
    category: values.category,
    capacity: parseFacilityCapacity(values.capacity),
    location: values.location.trim(),
    description: values.description.trim(),
    status: values.status,
    imageUrl: values.imageUrl,
    createdAt: now,
    updatedAt: now,
  };
};

const updateFacility = (facility: Facility, values: FacilityFormValues): Facility => ({
  ...facility,
  name: values.name.trim(),
  category: values.category,
  capacity: parseFacilityCapacity(values.capacity),
  location: values.location.trim(),
  description: values.description.trim(),
  status: values.status,
  imageUrl: values.imageUrl,
  updatedAt: new Date().toISOString(),
});

export const useFacilities = () => {
  const [facilities, setFacilities] = useState<Facility[]>(() => facilityRepository.list());
  const [isLoading, setIsLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<FacilityCategory | '전체'>('전체');
  const [status, setStatus] = useState<FacilityStatus | '전체'>('전체');
  const [page, setPage] = useState(1);

  useEffect(() => facilityRepository.saveAll(facilities), [facilities]);

  useEffect(() => {
    const refreshFacilities = () => {
      setFacilities(facilityRepository.list());
      setPage(1);
    };

    window.addEventListener(FACILITY_SNAPSHOT_APPLIED_EVENT, refreshFacilities);
    return () => window.removeEventListener(FACILITY_SNAPSHOT_APPLIED_EVENT, refreshFacilities);
  }, []);

  useEffect(() => {
    const loadingTimer = window.setTimeout(() => setIsLoading(false), 120);
    return () => window.clearTimeout(loadingTimer);
  }, []);

  const filtered = useMemo(() => facilities.filter((facility) => {
    const text = `${facility.name} ${facility.location} ${facility.description}`.toLowerCase();
    const matchesQuery = text.includes(query.toLowerCase());
    const matchesCategory = category === '전체' || facility.category === category;
    const matchesStatus = status === '전체' || facility.status === status;
    return matchesQuery && matchesCategory && matchesStatus;
  }), [facilities, query, category, status]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const pageItems = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const addFacility = (values: FacilityFormValues) =>
    setFacilities((previous) => [createFacility(values), ...previous]);

  const saveFacility = (id: string, values: FacilityFormValues) =>
    setFacilities((previous) => previous.map((item) => (item.id === id ? updateFacility(item, values) : item)));

  const deleteFacility = (id: string) =>
    setFacilities((previous) => previous.filter((item) => item.id !== id));

  return {
    facilities,
    filtered,
    pageItems,
    page,
    pageCount,
    query,
    category,
    status,
    isLoading,
    setQuery,
    setCategory,
    setStatus,
    setPage,
    addFacility,
    saveFacility,
    deleteFacility,
  };
};
