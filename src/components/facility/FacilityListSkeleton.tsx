import React from 'react';

export default function FacilityListSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4" aria-label="대관 시설 목록을 불러오는 중">
      {Array.from({ length: 4 }).map((_, index) => (
        <div key={index} className="rounded-3xl border border-slate-800 bg-slate-900/40 p-5 animate-pulse">
          <div className="h-36 rounded-2xl bg-slate-800/70 mb-4" />
          <div className="h-4 w-2/3 rounded bg-slate-800 mb-3" />
          <div className="h-3 w-full rounded bg-slate-800/80 mb-2" />
          <div className="h-3 w-4/5 rounded bg-slate-800/60 mb-5" />
          <div className="flex gap-2">
            <div className="h-8 flex-1 rounded-xl bg-slate-800/70" />
            <div className="h-8 flex-1 rounded-xl bg-slate-800/70" />
          </div>
        </div>
      ))}
    </div>
  );
}
