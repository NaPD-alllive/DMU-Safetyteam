import React, { useState } from 'react';
import { Boxes, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import type {
  FacilityAsset,
  FacilityAssetCondition,
  FacilityAssetStatus,
  FacilityRole,
} from '../../facility/types';

interface FacilityAssetPanelProps {
  assets: FacilityAsset[];
  page: number;
  pageCount: number;
  role: FacilityRole;
  onPageChange: (page: number) => void;
  onConditionChange: (id: string, condition: FacilityAssetCondition) => void;
  onStatusChange: (id: string, status: FacilityAssetStatus) => void;
}

const conditionLabel = {
  good: '양호',
  watch: '관찰',
  repair: '수리필요',
};

const statusLabel = {
  active: '사용중',
  maintenance: '정비중',
  retired: '폐기',
};

const conditionClass = {
  good: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/25',
  watch: 'bg-amber-500/10 text-amber-400 border-amber-500/25',
  repair: 'bg-rose-500/10 text-rose-400 border-rose-500/25',
};

const statusClass = {
  active: 'bg-indigo-500/10 text-indigo-300 border-indigo-500/25',
  maintenance: 'bg-amber-500/10 text-amber-400 border-amber-500/25',
  retired: 'bg-slate-800 text-slate-400 border-slate-700',
};

const conditionOptions: FacilityAssetCondition[] = ['good', 'watch', 'repair'];
const statusOptions: FacilityAssetStatus[] = ['active', 'maintenance', 'retired'];

export default function FacilityAssetPanel({
  assets,
  page,
  pageCount,
  role,
  onPageChange,
  onConditionChange,
  onStatusChange,
}: FacilityAssetPanelProps) {
  const isAdmin = role === 'admin';
  const [isOpen, setOpen] = useState(true);

  return (
    <section className="bg-slate-900/60 border border-slate-800 rounded-3xl p-5 space-y-4">
      <button
        type="button"
        onClick={() => setOpen((open) => !open)}
        aria-expanded={isOpen}
        className="w-full flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-left"
      >
        <div>
          <h3 className="text-white font-black text-sm flex items-center gap-2">
            <Boxes className="w-4 h-4 text-amber-400" />
            시설 자산관리
          </h3>
          <span className="block text-[10px] text-slate-500 font-black mt-1">
            장비·비품 상태 관리 · {assets.length}건
          </span>
        </div>
        <ChevronDown className={`w-4 h-4 text-amber-300 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <>
          {assets.length === 0 ? (
            <div className="p-8 rounded-2xl bg-slate-950 border border-slate-800 text-center text-slate-500 text-xs font-bold">
              등록된 시설 자산이 없습니다.
            </div>
          ) : (
            <div className="space-y-3">
              {assets.map((asset) => (
                <article key={asset.id} className="rounded-2xl bg-slate-950 border border-slate-800 p-4 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                    <div>
                      <h4 className="text-white text-sm font-black">{asset.name}</h4>
                      <p className="text-[11px] text-slate-500 mt-1 font-bold">
                        {asset.facilityName} · {asset.assetTag} · {asset.category}
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <span className={`px-2.5 py-1 rounded-lg border text-[10px] font-black ${conditionClass[asset.condition]}`}>
                        {conditionLabel[asset.condition]}
                      </span>
                      <span className={`px-2.5 py-1 rounded-lg border text-[10px] font-black ${statusClass[asset.status]}`}>
                        {statusLabel[asset.status]}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px] text-slate-400 font-bold">
                    <span>관리: {asset.managerName}</span>
                    <span>점검: {asset.lastCheckedAt ? new Date(asset.lastCheckedAt).toLocaleDateString('ko-KR') : '미점검'}</span>
                    <span>{asset.value ? `취득가 ${asset.value.toLocaleString('ko-KR')}원` : '취득가 미기록'}</span>
                  </div>
                  {asset.notes && <p className="text-xs text-slate-300 leading-relaxed">{asset.notes}</p>}

                  {isAdmin && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <select
                        value={asset.condition}
                        onChange={(event) => onConditionChange(asset.id, event.target.value as FacilityAssetCondition)}
                        className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 text-[11px] font-black outline-none"
                      >
                        {conditionOptions.map((condition) => (
                          <option key={condition} value={condition}>{conditionLabel[condition]}</option>
                        ))}
                      </select>
                      <select
                        value={asset.status}
                        onChange={(event) => onStatusChange(asset.id, event.target.value as FacilityAssetStatus)}
                        className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 text-[11px] font-black outline-none"
                      >
                        {statusOptions.map((status) => (
                          <option key={status} value={status}>{statusLabel[status]}</option>
                        ))}
                      </select>
                    </div>
                  )}
                </article>
              ))}
            </div>
          )}

          <div className="flex items-center justify-between pt-2 text-xs font-black">
            <span className="text-slate-500">{page} / {pageCount} 페이지</span>
            <div className="flex gap-2">
              <button
                type="button"
                disabled={page === 1}
                onClick={() => onPageChange(page - 1)}
                className="p-2 rounded-xl bg-slate-950 border border-slate-800 disabled:text-slate-700"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                disabled={page === pageCount}
                onClick={() => onPageChange(page + 1)}
                className="p-2 rounded-xl bg-slate-950 border border-slate-800 disabled:text-slate-700"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </>
      )}
    </section>
  );
}
