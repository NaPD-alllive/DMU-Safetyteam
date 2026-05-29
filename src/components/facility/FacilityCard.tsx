import React from 'react';
import { Building2, Eye, MapPin, Pencil, Trash2, Users } from 'lucide-react';
import { Facility } from '../../facility/types';

interface FacilityCardProps {
  key?: React.Key;
  facility: Facility;
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

export default function FacilityCard({
  facility,
  canManage,
  onEdit,
  onDelete,
  onSelect,
}: FacilityCardProps) {
  return (
    <article className="bg-slate-900/50 border border-slate-800 rounded-3xl overflow-hidden shadow-xl flex flex-col">
      <div className="h-36 bg-slate-950 border-b border-slate-800 flex items-center justify-center">
        {facility.imageUrl ? (
          <img src={facility.imageUrl} alt={facility.name} className="w-full h-full object-cover" />
        ) : (
          <Building2 className="w-10 h-10 text-slate-700" />
        )}
      </div>
      <div className="p-5 flex flex-col gap-4 flex-1">
        <div>
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className="px-2.5 py-1 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 text-[10px] font-black">
              {facility.category}
            </span>
            <span className={`px-2.5 py-1 rounded-lg border text-[10px] font-black ${statusClass[facility.status]}`}>
              {facility.status}
            </span>
          </div>
          <h3 className="text-white font-black text-base leading-tight">{facility.name}</h3>
        </div>
        <p className="text-xs text-slate-400 leading-relaxed line-clamp-2">{facility.description}</p>
        <div className="space-y-2 text-xs text-slate-400 font-semibold mt-auto">
          <div className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-slate-500" />
            <span>{facility.location}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-slate-500" />
            <span>수용 {facility.capacity}명</span>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 pt-3 border-t border-slate-800">
          <button onClick={() => onSelect(facility)} className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 text-[11px] font-black flex items-center gap-1.5">
            <Eye className="w-3.5 h-3.5 text-indigo-400" />
            상세
          </button>
          {canManage && (
            <>
              <button onClick={() => onEdit(facility)} className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 text-[11px] font-black flex items-center gap-1.5">
                <Pencil className="w-3.5 h-3.5 text-amber-400" />
                수정
              </button>
              <button onClick={() => onDelete(facility.id)} className="px-3 py-2 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-[11px] font-black flex items-center gap-1.5">
                <Trash2 className="w-3.5 h-3.5" />
                삭제
              </button>
            </>
          )}
        </div>
      </div>
    </article>
  );
}
