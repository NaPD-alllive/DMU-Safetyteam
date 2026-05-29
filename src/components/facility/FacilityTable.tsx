import React, { useMemo, useState } from 'react';
import { ArrowDown, ArrowUp, ArrowUpDown, Building2, Eye, Pencil, Trash2 } from 'lucide-react';
import { FacilitySortField, SortDirection, sortFacilities } from '../../facility/facilitySort';
import type { Facility } from '../../facility/types';

interface FacilityTableProps {
  facilities: Facility[];
  canManage: boolean;
  onEdit: (facility: Facility) => void;
  onDelete: (id: string) => void;
  onSelect: (facility: Facility) => void;
}

const statusClass = {
  운영중: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/25',
  점검중: 'bg-amber-500/10 text-amber-400 border-amber-500/25',
  예약중지: 'bg-rose-500/10 text-rose-400 border-rose-500/25',
};

interface SortHeaderProps {
  label: string;
  field: FacilitySortField;
  activeField: FacilitySortField;
  direction: SortDirection;
  onSort: (field: FacilitySortField) => void;
}

function SortHeader({ label, field, activeField, direction, onSort }: SortHeaderProps) {
  const active = field === activeField;
  const Icon = active ? (direction === 'asc' ? ArrowUp : ArrowDown) : ArrowUpDown;

  return (
    <button type="button" onClick={() => onSort(field)} className="flex items-center gap-1.5 hover:text-white">
      <span>{label}</span>
      <Icon className={`w-3.5 h-3.5 ${active ? 'text-indigo-300' : 'text-slate-600'}`} />
    </button>
  );
}

export default function FacilityTable({
  facilities,
  canManage,
  onEdit,
  onDelete,
  onSelect,
}: FacilityTableProps) {
  const [sortField, setSortField] = useState<FacilitySortField>('name');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const sortedFacilities = useMemo(
    () => sortFacilities(facilities, sortField, sortDirection),
    [facilities, sortField, sortDirection]
  );

  const toggleSort = (field: FacilitySortField) => {
    if (field === sortField) {
      setSortDirection((current) => (current === 'asc' ? 'desc' : 'asc'));
      return;
    }
    setSortField(field);
    setSortDirection('asc');
  };

  return (
    <div className="rounded-3xl border border-slate-800 bg-slate-900/40 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] text-left text-xs">
          <thead className="bg-slate-950/80 text-[10px] uppercase tracking-widest text-slate-500 font-black">
            <tr>
              <th className="px-4 py-3 w-20">이미지</th>
              <th className="px-4 py-3">
                <SortHeader label="시설명" field="name" activeField={sortField} direction={sortDirection} onSort={toggleSort} />
              </th>
              <th className="px-4 py-3 w-28">
                <SortHeader label="유형" field="category" activeField={sortField} direction={sortDirection} onSort={toggleSort} />
              </th>
              <th className="px-4 py-3 w-28">
                <SortHeader label="상태" field="status" activeField={sortField} direction={sortDirection} onSort={toggleSort} />
              </th>
              <th className="px-4 py-3 w-24">
                <SortHeader label="수용" field="capacity" activeField={sortField} direction={sortDirection} onSort={toggleSort} />
              </th>
              <th className="px-4 py-3">
                <SortHeader label="위치" field="location" activeField={sortField} direction={sortDirection} onSort={toggleSort} />
              </th>
              <th className="px-4 py-3 w-36 text-right">작업</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/70">
            {sortedFacilities.map((facility) => (
              <tr key={facility.id} className="hover:bg-slate-900/70 transition-colors">
                <td className="px-4 py-3">
                  <button
                    type="button"
                    onClick={() => onSelect(facility)}
                    className="w-12 h-12 rounded-2xl border border-slate-800 bg-slate-950 overflow-hidden flex items-center justify-center"
                    title={`${facility.name} 상세 보기`}
                  >
                    {facility.imageUrl ? (
                      <img src={facility.imageUrl} alt={facility.name} className="w-full h-full object-cover" />
                    ) : (
                      <Building2 className="w-5 h-5 text-slate-600" />
                    )}
                  </button>
                </td>
                <td className="px-4 py-3">
                  <button type="button" onClick={() => onSelect(facility)} className="text-left">
                    <span className="block text-white font-black">{facility.name}</span>
                    <span className="block text-[10px] text-slate-500 font-bold line-clamp-1">{facility.description}</span>
                  </button>
                </td>
                <td className="px-4 py-3 text-indigo-300 font-black">{facility.category}</td>
                <td className="px-4 py-3">
                  <span className={`px-2.5 py-1 rounded-lg border text-[10px] font-black ${statusClass[facility.status]}`}>
                    {facility.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-slate-300 font-black">{facility.capacity}명</td>
                <td className="px-4 py-3 text-slate-400 font-bold">{facility.location}</td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-2">
                    <button onClick={() => onSelect(facility)} className="p-2 rounded-xl bg-slate-950 border border-slate-800 text-indigo-300" title="상세">
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                    {canManage && (
                      <>
                        <button onClick={() => onEdit(facility)} className="p-2 rounded-xl bg-slate-950 border border-slate-800 text-amber-300" title="수정">
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => onDelete(facility.id)} className="p-2 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400" title="삭제">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
