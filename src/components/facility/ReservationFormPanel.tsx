import React, { useEffect, useState } from 'react';
import { CalendarPlus, X } from 'lucide-react';
import { EMPTY_RESERVATION_FORM, hasReservationErrors, validateReservationForm } from '../../facility/reservationValidation';
import { Facility, FacilityReservation, ReservationFormValues } from '../../facility/types';

interface ReservationFormPanelProps {
  facilities: Facility[];
  reservations: FacilityReservation[];
  editingReservation: FacilityReservation | null;
  onSubmit: (values: ReservationFormValues) => void;
  onCancelEdit: () => void;
}

const getDefaultStart = () => {
  const start = new Date(Date.now() + 60 * 60 * 1000);
  start.setMinutes(0, 0, 0);
  return start.toISOString().slice(0, 16);
};

const getDefaultEnd = () => {
  const end = new Date(Date.now() + 2 * 60 * 60 * 1000);
  end.setMinutes(0, 0, 0);
  return end.toISOString().slice(0, 16);
};

const buildInitialValues = (
  facilities: Facility[],
  editingReservation: FacilityReservation | null,
): ReservationFormValues => {
  if (editingReservation) {
    return {
      facilityId: editingReservation.facilityId,
      requesterOrganization: editingReservation.requesterOrganization || '',
      purpose: editingReservation.purpose,
      startAt: editingReservation.startAt,
      endAt: editingReservation.endAt,
    };
  }

  return {
    ...EMPTY_RESERVATION_FORM,
    facilityId: facilities.find((facility) => facility.status === '운영중')?.id || '',
    startAt: getDefaultStart(),
    endAt: getDefaultEnd(),
  };
};

export default function ReservationFormPanel({
  facilities,
  reservations,
  editingReservation,
  onSubmit,
  onCancelEdit,
}: ReservationFormPanelProps) {
  const [values, setValues] = useState<ReservationFormValues>(() => buildInitialValues(facilities, editingReservation));
  const [submitted, setSubmitted] = useState(false);
  const errors = validateReservationForm(
    values,
    facilities,
    reservations,
    new Date(),
    editingReservation?.id,
  );

  useEffect(() => {
    setValues(buildInitialValues(facilities, editingReservation));
    setSubmitted(false);
  }, [editingReservation, facilities]);

  useEffect(() => {
    if (!values.facilityId) {
      setValues((previous) => ({ ...previous, facilityId: facilities[0]?.id || '' }));
    }
  }, [facilities, values.facilityId]);

  const updateField = (name: keyof ReservationFormValues, value: string) =>
    setValues((previous) => ({ ...previous, [name]: value }));

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    setSubmitted(true);
    if (hasReservationErrors(errors)) return;
    onSubmit(values);
    setValues(buildInitialValues(facilities, null));
    setSubmitted(false);
  };

  return (
    <form onSubmit={submit} className="bg-slate-900/60 border border-slate-800 rounded-3xl p-5 space-y-4">
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-white font-black text-sm flex items-center gap-2">
          <CalendarPlus className="w-4 h-4 text-indigo-400" />
          {editingReservation ? '대관일정 수정' : '대관일정 등록'}
        </h3>
        {editingReservation && (
          <button type="button" onClick={onCancelEdit} className="p-1.5 rounded-lg text-slate-500 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
      <p className="text-[11px] text-slate-500 font-bold leading-relaxed">
        별도 신청 프로그램에서 확정된 대관 내용을 시설관리팀이 직접 입력합니다.
      </p>
      <select value={values.facilityId} onChange={(event) => updateField('facilityId', event.target.value)} className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white font-black outline-none">
        <option value="">대관 시설 선택</option>
        {facilities.map((facility) => <option key={facility.id} value={facility.id}>{facility.name} ({facility.status})</option>)}
      </select>
      {submitted && errors.facilityId && <p className="text-[10px] text-rose-400 font-bold">{errors.facilityId}</p>}
      <label className="space-y-1.5 block">
        <span className="text-[10px] text-slate-500 font-black">대관요청기관</span>
        <input
          type="text"
          value={values.requesterOrganization}
          onChange={(event) => updateField('requesterOrganization', event.target.value)}
          placeholder="예: 건축학과, 총학생회, 외부기관명"
          className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white outline-none"
        />
      </label>
      {submitted && errors.requesterOrganization && <p className="text-[10px] text-rose-400 font-bold">{errors.requesterOrganization}</p>}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <label className="space-y-1.5">
          <span className="text-[10px] text-slate-500 font-black">대관 시작</span>
          <input type="datetime-local" value={values.startAt} onChange={(event) => updateField('startAt', event.target.value)} className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white outline-none" />
        </label>
        <label className="space-y-1.5">
          <span className="text-[10px] text-slate-500 font-black">대관 종료</span>
          <input type="datetime-local" value={values.endAt} onChange={(event) => updateField('endAt', event.target.value)} className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white outline-none" />
        </label>
      </div>
      {submitted && (errors.startAt || errors.endAt || errors.overlap) && (
        <p className="text-[10px] text-rose-400 font-bold">{errors.startAt || errors.endAt || errors.overlap}</p>
      )}
      <textarea
        value={values.purpose}
        onChange={(event) => updateField('purpose', event.target.value)}
        rows={4}
        placeholder="대관 목적, 연락처, 준비 요청, 특이사항을 입력하세요."
        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white outline-none"
      />
      {submitted && errors.purpose && <p className="text-[10px] text-rose-400 font-bold">{errors.purpose}</p>}
      <button type="submit" className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-black">
        {editingReservation ? '대관일정 수정 저장' : '대관일정 등록'}
      </button>
    </form>
  );
}
