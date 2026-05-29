import React from 'react';
import { CalendarCheck2, Check, ChevronLeft, ChevronRight, RotateCcw } from 'lucide-react';
import { getInspectionDisplayStatus } from '../../facility/inspectionState';
import type { FacilityInspectionSchedule, FacilityRole } from '../../facility/types';

interface FacilityInspectionSchedulePanelProps {
  schedules: FacilityInspectionSchedule[];
  page: number;
  pageCount: number;
  role: FacilityRole;
  onPageChange: (page: number) => void;
  onComplete: (id: string) => void;
  onReopen: (id: string) => void;
}

const statusLabel = {
  scheduled: '예정',
  dueSoon: '임박',
  overdue: '지연',
  completed: '완료',
};

const statusClass = {
  scheduled: 'bg-slate-800 text-slate-300 border-slate-700',
  dueSoon: 'bg-amber-500/10 text-amber-400 border-amber-500/25',
  overdue: 'bg-rose-500/10 text-rose-400 border-rose-500/25',
  completed: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/25',
};

const cycleLabel = {
  weekly: '주간',
  monthly: '월간',
  quarterly: '분기',
  yearly: '연간',
};

export default function FacilityInspectionSchedulePanel({
  schedules,
  page,
  pageCount,
  role,
  onPageChange,
  onComplete,
  onReopen,
}: FacilityInspectionSchedulePanelProps) {
  const isAdmin = role === 'admin';

  return (
    <section className="bg-slate-900/60 border border-slate-800 rounded-3xl p-5 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <h3 className="text-white font-black text-sm flex items-center gap-2">
          <CalendarCheck2 className="w-4 h-4 text-cyan-400" />
          점검일정
        </h3>
        <span className="text-[10px] text-slate-500 font-black">법정·정기 점검 예정표</span>
      </div>

      {schedules.length === 0 ? (
        <div className="p-8 rounded-2xl bg-slate-950 border border-slate-800 text-center text-slate-500 text-xs font-bold">
          등록된 점검일정이 없습니다.
        </div>
      ) : (
        <div className="space-y-3">
          {schedules.map((schedule) => {
            const displayStatus = getInspectionDisplayStatus(schedule);
            return (
              <article key={schedule.id} className="rounded-2xl bg-slate-950 border border-slate-800 p-4 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                  <div>
                    <h4 className="text-white text-sm font-black">{schedule.title}</h4>
                    <p className="text-[11px] text-slate-500 mt-1 font-bold">
                      {schedule.facilityName} · {schedule.inspectionType} · {cycleLabel[schedule.cycle]}
                    </p>
                  </div>
                  <span className={`px-2.5 py-1 rounded-lg border text-[10px] font-black w-max ${statusClass[displayStatus]}`}>
                    {statusLabel[displayStatus]}
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px] text-slate-400 font-bold">
                  <span>기한: {new Date(schedule.dueDate).toLocaleDateString('ko-KR')}</span>
                  <span>담당: {schedule.inspectorName}</span>
                  <span>{schedule.completedAt ? `완료: ${new Date(schedule.completedAt).toLocaleDateString('ko-KR')}` : '완료 전'}</span>
                </div>
                {schedule.notes && <p className="text-xs text-slate-300 leading-relaxed">{schedule.notes}</p>}
                {isAdmin && (
                  <div className="flex flex-wrap gap-2">
                    {schedule.status === 'completed' ? (
                      <button onClick={() => onReopen(schedule.id)} className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-300 text-[11px] font-black flex items-center gap-1.5">
                        <RotateCcw className="w-3.5 h-3.5" />
                        다시 예정
                      </button>
                    ) : (
                      <button onClick={() => onComplete(schedule.id)} className="px-3 py-2 rounded-xl bg-emerald-600/20 border border-emerald-500/30 text-emerald-300 text-[11px] font-black flex items-center gap-1.5">
                        <Check className="w-3.5 h-3.5" />
                        점검 완료
                      </button>
                    )}
                  </div>
                )}
              </article>
            );
          })}
        </div>
      )}

      <div className="flex items-center justify-between pt-2 text-xs font-black">
        <span className="text-slate-500">{page} / {pageCount} 페이지</span>
        <div className="flex gap-2">
          <button disabled={page === 1} onClick={() => onPageChange(page - 1)} className="p-2 rounded-xl bg-slate-950 border border-slate-800 disabled:text-slate-700">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button disabled={page === pageCount} onClick={() => onPageChange(page + 1)} className="p-2 rounded-xl bg-slate-950 border border-slate-800 disabled:text-slate-700">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </section>
  );
}
