import React from 'react';
import { CalendarClock, ChevronLeft, ChevronRight, Download, Pencil } from 'lucide-react';
import { buildUsageScheduleCsv } from '../../facility/reservationCsv';
import { formatReservationDateTime, RESERVATION_STATUS_LABEL } from '../../facility/reservationDisplay';
import { FacilityReservation, FacilityRole, ReservationStatus } from '../../facility/types';

interface ReservationListPanelProps {
  reservations: FacilityReservation[];
  exportReservations: FacilityReservation[];
  page: number;
  pageCount: number;
  role: FacilityRole;
  onPageChange: (page: number) => void;
  onEdit: (reservation: FacilityReservation) => void;
  onStatusChange: (id: string, status: ReservationStatus, reason?: string) => void;
}

const statusClass = {
  pending: 'bg-amber-500/10 text-amber-400 border-amber-500/25',
  approved: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/25',
  rejected: 'bg-rose-500/10 text-rose-400 border-rose-500/25',
  cancelled: 'bg-slate-800 text-slate-400 border-slate-700',
};

export default function ReservationListPanel({
  reservations,
  exportReservations,
  page,
  pageCount,
  role,
  onPageChange,
  onEdit,
  onStatusChange,
}: ReservationListPanelProps) {
  const isAdmin = role === 'admin';
  const downloadCsv = () => {
    const csv = buildUsageScheduleCsv(exportReservations);
    const blob = new Blob([`\uFEFF${csv}`], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `대관일정_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-slate-900/60 border border-slate-800 rounded-3xl p-5 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <h3 className="text-white font-black text-sm flex items-center gap-2">
          <CalendarClock className="w-4 h-4 text-indigo-400" />
          대관 일정 현황
        </h3>
        {isAdmin && (
          <button
            type="button"
            onClick={downloadCsv}
            disabled={exportReservations.length === 0}
            className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 text-[11px] font-black flex items-center gap-1.5 disabled:text-slate-600 disabled:cursor-not-allowed w-max"
          >
            <Download className="w-3.5 h-3.5 text-emerald-400" />
            CSV 내보내기
          </button>
        )}
      </div>
      {reservations.length === 0 ? (
        <div className="p-8 rounded-2xl bg-slate-950 border border-slate-800 text-center text-slate-500 text-xs font-bold">
          등록된 대관 일정이 없습니다.
        </div>
      ) : (
        <div className="space-y-3">
          {reservations.map((reservation) => (
            <article key={reservation.id} className="rounded-2xl bg-slate-950 border border-slate-800 p-4 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                <div>
                  <h4 className="text-white font-black text-sm">{reservation.facilityName}</h4>
                  <p className="text-[11px] text-slate-400 mt-1">{reservation.purpose}</p>
                </div>
                <span className={`px-2.5 py-1 rounded-lg border text-[10px] font-black w-max ${statusClass[reservation.status]}`}>
                  {RESERVATION_STATUS_LABEL[reservation.status]}
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] text-slate-400 font-bold">
                <span>{formatReservationDateTime(reservation.startAt)}</span>
                <span>{formatReservationDateTime(reservation.endAt)}</span>
                <span>대관요청기관: {reservation.requesterOrganization || '-'}</span>
                <span>등록자: {reservation.requesterName}</span>
              </div>
              <ReservationActions
                reservation={reservation}
                isAdmin={isAdmin}
                onEdit={onEdit}
                onStatusChange={onStatusChange}
              />
            </article>
          ))}
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
    </div>
  );
}

interface ReservationActionsProps {
  reservation: FacilityReservation;
  isAdmin: boolean;
  onEdit: (reservation: FacilityReservation) => void;
  onStatusChange: (id: string, status: ReservationStatus, reason?: string) => void;
}

function ReservationActions({
  reservation,
  isAdmin,
  onEdit,
  onStatusChange,
}: ReservationActionsProps) {
  if (isAdmin) {
    return (
      <div className="flex flex-wrap gap-2 items-center">
        <button
          type="button"
          onClick={() => onEdit(reservation)}
          className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-300 text-[11px] font-black flex items-center gap-1.5"
        >
          <Pencil className="w-3.5 h-3.5 text-amber-300" />
          수정
        </button>
        <ReservationStatusSelect reservation={reservation} onStatusChange={onStatusChange} />
      </div>
    );
  }

  return null;
}

interface ReservationStatusSelectProps {
  reservation: FacilityReservation;
  onStatusChange: (id: string, status: ReservationStatus, reason?: string) => void;
}

function ReservationStatusSelect({ reservation, onStatusChange }: ReservationStatusSelectProps) {
  return (
    <select
      value={reservation.status}
      onChange={(event) => onStatusChange(reservation.id, event.target.value as ReservationStatus)}
      className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-slate-200 text-[11px] font-black outline-none"
    >
      <option value="pending">확인필요</option>
      <option value="approved">대관확정</option>
      <option value="rejected">보류</option>
      <option value="cancelled">취소</option>
    </select>
  );
}
