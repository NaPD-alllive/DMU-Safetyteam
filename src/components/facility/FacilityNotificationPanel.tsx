import React from 'react';
import { Bell, CheckCheck } from 'lucide-react';
import { FacilityNotification } from '../../facility/types';

interface FacilityNotificationPanelProps {
  notifications: FacilityNotification[];
  unreadCount: number;
  onRead: (id: string) => void;
  onReadAll: () => void;
}

const kindTone = {
  reservation_approved: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/25',
  reservation_rejected: 'text-rose-400 bg-rose-500/10 border-rose-500/25',
  maintenance_completed: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/25',
};

export default function FacilityNotificationPanel({
  notifications,
  unreadCount,
  onRead,
  onReadAll,
}: FacilityNotificationPanelProps) {
  return (
    <section className="bg-slate-900/60 border border-slate-800 rounded-3xl p-5 space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <h3 className="text-white font-black text-sm flex items-center gap-2">
          <Bell className="w-4 h-4 text-indigo-400" />
          시설 알림
          {unreadCount > 0 && <span className="px-2 py-0.5 rounded-lg bg-rose-500 text-white text-[10px]">{unreadCount}</span>}
        </h3>
        <button
          type="button"
          onClick={onReadAll}
          disabled={unreadCount === 0}
          className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-300 text-[11px] font-black flex items-center gap-1.5 disabled:text-slate-600 disabled:cursor-not-allowed w-max"
        >
          <CheckCheck className="w-3.5 h-3.5" />
          모두 읽음
        </button>
      </div>
      {notifications.length === 0 ? (
        <div className="p-8 rounded-2xl bg-slate-950 border border-slate-800 text-center text-slate-500 text-xs font-bold">
          표시할 시설 알림이 없습니다.
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
          {notifications.slice(0, 6).map((notification) => (
            <button
              key={notification.id}
              type="button"
              onClick={() => onRead(notification.id)}
              className={`text-left rounded-2xl border p-4 transition-colors ${notification.read ? 'bg-slate-950 border-slate-800 text-slate-500' : `${kindTone[notification.kind]} text-slate-100`}`}
            >
              <div className="flex items-start justify-between gap-2">
                <h4 className="text-xs font-black">{notification.title}</h4>
                {!notification.read && <span className="w-2 h-2 rounded-full bg-rose-400 shrink-0 mt-1"></span>}
              </div>
              <p className="text-[11px] leading-relaxed mt-2">{notification.message}</p>
              <p className="text-[10px] mt-3 opacity-70">{new Date(notification.createdAt).toLocaleString('ko-KR')}</p>
            </button>
          ))}
        </div>
      )}
    </section>
  );
}
