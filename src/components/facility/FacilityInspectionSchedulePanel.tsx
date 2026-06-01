import React, { useEffect, useState } from 'react';
import { CalendarCheck2, Check, ChevronLeft, ChevronRight, RotateCcw } from 'lucide-react';
import { getInspectionDisplayStatus } from '../../facility/inspectionState';
import type {
  Facility,
  FacilityInspectionSchedule,
  FacilityRole,
  InspectionCycle,
  InspectionFormValues,
} from '../../facility/types';

interface FacilityInspectionSchedulePanelProps {
  facilities: Facility[];
  schedules: FacilityInspectionSchedule[];
  page: number;
  pageCount: number;
  role: FacilityRole;
  onAdd: (values: InspectionFormValues) => void;
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

const inspectionTypeOptions = ['전기', '소방', '연구실 안전', '승강기', '기계설비', '건축/영선', '위생', '기타'];

const nextWeekDate = () => {
  const value = new Date();
  value.setDate(value.getDate() + 7);
  const month = String(value.getMonth() + 1).padStart(2, '0');
  const date = String(value.getDate()).padStart(2, '0');
  return `${value.getFullYear()}-${month}-${date}`;
};

const buildInitialFormValues = (facilities: Facility[]): InspectionFormValues => ({
  facilityId: facilities[0]?.id || '',
  title: '',
  inspectionType: inspectionTypeOptions[0],
  cycle: 'monthly',
  inspectorName: '',
  dueDate: nextWeekDate(),
  notes: '',
});

export default function FacilityInspectionSchedulePanel({
  facilities,
  schedules,
  page,
  pageCount,
  role,
  onAdd,
  onPageChange,
  onComplete,
  onReopen,
}: FacilityInspectionSchedulePanelProps) {
  const isAdmin = role === 'admin';
  const [values, setValues] = useState(() => buildInitialFormValues(facilities));
  const [submitted, setSubmitted] = useState(false);
  const hasFacility = facilities.length > 0;

  useEffect(() => {
    if (values.facilityId || facilities.length === 0) return;
    setValues((previous) => ({ ...previous, facilityId: facilities[0].id }));
  }, [facilities, values.facilityId]);

  const errors = {
    facilityId: !values.facilityId,
    title: values.title.trim().length === 0,
    inspectionType: values.inspectionType.trim().length === 0,
    inspectorName: values.inspectorName.trim().length === 0,
    dueDate: values.dueDate.trim().length === 0,
  };

  const hasErrors = Object.values(errors).some(Boolean);

  const updateValue = (key: keyof InspectionFormValues, value: string) => {
    setValues((previous) => ({
      ...previous,
      [key]: key === 'cycle' ? (value as InspectionCycle) : value,
    }));
  };

  const submitForm = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);
    if (hasErrors) return;
    onAdd(values);
    setValues(buildInitialFormValues(facilities));
    setSubmitted(false);
  };

  return (
    <section className="bg-slate-900/60 border border-slate-800 rounded-3xl p-5 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <h3 className="text-white font-black text-sm flex items-center gap-2">
          <CalendarCheck2 className="w-4 h-4 text-cyan-400" />
          점검일정
        </h3>
        <span className="text-[10px] text-slate-500 font-black">법정·정기 점검 예정표</span>
      </div>

      {isAdmin && (
        <form onSubmit={submitForm} className="rounded-2xl bg-slate-950 border border-slate-800 p-4 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h4 className="text-white text-sm font-black">점검일정 등록</h4>
              <p className="text-[11px] text-slate-500 font-bold mt-1">대상 시설과 예정일을 입력하면 아래 목록에 바로 추가됩니다.</p>
            </div>
            <button
              type="submit"
              disabled={!hasFacility}
              className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-500 text-white text-xs font-black"
            >
              점검일정 등록
            </button>
          </div>

          {!hasFacility && (
            <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 px-3 py-2 text-amber-200 text-xs font-bold">
              먼저 대관 시설 목록/등록에서 대상 시설을 등록해야 점검일정을 만들 수 있습니다.
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
            <label className="space-y-1.5">
              <span className="text-[11px] text-slate-400 font-black">대상 시설 *</span>
              <select
                value={values.facilityId}
                onChange={(event) => updateValue('facilityId', event.target.value)}
                className="w-full rounded-xl bg-slate-900 border border-slate-700 px-3 py-3 text-sm text-white font-bold outline-none focus:border-indigo-400"
              >
                {facilities.map((facility) => (
                  <option key={facility.id} value={facility.id}>{facility.name}</option>
                ))}
              </select>
              {submitted && errors.facilityId && <span className="text-[10px] text-rose-300 font-bold">대상 시설을 선택해 주세요.</span>}
            </label>

            <label className="space-y-1.5">
              <span className="text-[11px] text-slate-400 font-black">점검 제목 *</span>
              <input
                value={values.title}
                onChange={(event) => updateValue('title', event.target.value)}
                placeholder="예: 본관 소방설비 월간 점검"
                className="w-full rounded-xl bg-slate-900 border border-slate-700 px-3 py-3 text-sm text-white font-bold outline-none focus:border-indigo-400"
              />
              {submitted && errors.title && <span className="text-[10px] text-rose-300 font-bold">점검 제목을 입력해 주세요.</span>}
            </label>

            <label className="space-y-1.5">
              <span className="text-[11px] text-slate-400 font-black">점검 유형 *</span>
              <select
                value={values.inspectionType}
                onChange={(event) => updateValue('inspectionType', event.target.value)}
                className="w-full rounded-xl bg-slate-900 border border-slate-700 px-3 py-3 text-sm text-white font-bold outline-none focus:border-indigo-400"
              >
                {inspectionTypeOptions.map((type) => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
              {submitted && errors.inspectionType && <span className="text-[10px] text-rose-300 font-bold">점검 유형을 선택해 주세요.</span>}
            </label>

            <label className="space-y-1.5">
              <span className="text-[11px] text-slate-400 font-black">점검 주기 *</span>
              <select
                value={values.cycle}
                onChange={(event) => updateValue('cycle', event.target.value)}
                className="w-full rounded-xl bg-slate-900 border border-slate-700 px-3 py-3 text-sm text-white font-bold outline-none focus:border-indigo-400"
              >
                {Object.entries(cycleLabel).map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
            </label>

            <label className="space-y-1.5">
              <span className="text-[11px] text-slate-400 font-black">담당자 *</span>
              <input
                value={values.inspectorName}
                onChange={(event) => updateValue('inspectorName', event.target.value)}
                placeholder="예: 오승훈"
                className="w-full rounded-xl bg-slate-900 border border-slate-700 px-3 py-3 text-sm text-white font-bold outline-none focus:border-indigo-400"
              />
              {submitted && errors.inspectorName && <span className="text-[10px] text-rose-300 font-bold">담당자를 입력해 주세요.</span>}
            </label>

            <label className="space-y-1.5">
              <span className="text-[11px] text-slate-400 font-black">점검 예정일 *</span>
              <input
                type="date"
                value={values.dueDate}
                onChange={(event) => updateValue('dueDate', event.target.value)}
                className="w-full rounded-xl bg-slate-900 border border-slate-700 px-3 py-3 text-sm text-white font-bold outline-none focus:border-indigo-400"
              />
              {submitted && errors.dueDate && <span className="text-[10px] text-rose-300 font-bold">점검 예정일을 입력해 주세요.</span>}
            </label>
          </div>

          <label className="space-y-1.5 block">
            <span className="text-[11px] text-slate-400 font-black">메모</span>
            <textarea
              value={values.notes}
              onChange={(event) => updateValue('notes', event.target.value)}
              placeholder="점검 범위, 준비물, 확인할 사항 등을 입력해 주세요."
              rows={3}
              className="w-full rounded-xl bg-slate-900 border border-slate-700 px-3 py-3 text-sm text-white font-bold outline-none focus:border-indigo-400 resize-none"
            />
          </label>
        </form>
      )}

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
