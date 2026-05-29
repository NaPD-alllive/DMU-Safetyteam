import React from 'react';
import { Search } from 'lucide-react';
import { FACILITY_CATEGORIES, FACILITY_STATUSES } from '../../facility/facilityData';
import { FacilityCategory, FacilityStatus } from '../../facility/types';

interface FacilityFiltersProps {
  query: string;
  category: FacilityCategory | '전체';
  status: FacilityStatus | '전체';
  onQueryChange: (value: string) => void;
  onCategoryChange: (value: FacilityCategory | '전체') => void;
  onStatusChange: (value: FacilityStatus | '전체') => void;
}

export default function FacilityFilters({
  query,
  category,
  status,
  onQueryChange,
  onCategoryChange,
  onStatusChange,
}: FacilityFiltersProps) {
  return (
    <div className="bg-slate-900/50 border border-slate-800 rounded-3xl p-4 flex flex-col lg:flex-row gap-3">
      <div className="relative flex-1 min-w-[220px]">
        <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-3 pointer-events-none" />
        <input
          value={query}
          onChange={(event) => onQueryChange(event.target.value)}
          placeholder="시설명, 위치, 설명 검색"
          className="w-full pl-10 pr-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white outline-none focus:border-indigo-400"
        />
      </div>
      <select
        value={category}
        onChange={(event) => onCategoryChange(event.target.value as FacilityCategory | '전체')}
        className="px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 font-black outline-none"
      >
        <option value="전체">전체 유형</option>
        {FACILITY_CATEGORIES.map((item) => <option key={item} value={item}>{item}</option>)}
      </select>
      <select
        value={status}
        onChange={(event) => onStatusChange(event.target.value as FacilityStatus | '전체')}
        className="px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200 font-black outline-none"
      >
        <option value="전체">전체 상태</option>
        {FACILITY_STATUSES.map((item) => <option key={item} value={item}>{item}</option>)}
      </select>
    </div>
  );
}
