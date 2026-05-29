import React, { useMemo, useState } from 'react';
import { BookOpen, CheckCircle2, Search, X } from 'lucide-react';
import { SYSTEM_MANUAL_SECTIONS } from '../lib/systemManual';

interface SystemManualModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SystemManualModal({ isOpen, onClose }: SystemManualModalProps) {
  const [query, setQuery] = useState('');
  const [selectedId, setSelectedId] = useState(SYSTEM_MANUAL_SECTIONS[0].id);

  const filteredSections = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) return SYSTEM_MANUAL_SECTIONS;
    return SYSTEM_MANUAL_SECTIONS.filter((section) => (
      [
        section.title,
        section.audience,
        section.summary,
        section.steps.join(' '),
        section.notes.join(' '),
      ].join(' ').toLowerCase().includes(normalizedQuery)
    ));
  }, [query]);

  const selectedSection = filteredSections.find((section) => section.id === selectedId)
    || filteredSections[0]
    || SYSTEM_MANUAL_SECTIONS[0];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[80] bg-slate-950/80 backdrop-blur-sm p-3 sm:p-5 flex items-center justify-center">
      <section className="w-full max-w-6xl max-h-[92vh] bg-slate-900 border border-slate-700 rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        <div className="px-5 py-4 border-b border-slate-800 flex items-center justify-between gap-3">
          <div>
            <h2 className="text-white font-black text-base flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-indigo-300" />
              시설관리 시스템 사용 매뉴얼
            </h2>
            <p className="text-[11px] text-slate-400 font-bold mt-1">
              기능별 사용 순서, 권한, 문제 해결 방법을 확인합니다.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-400 hover:text-white"
            aria-label="매뉴얼 닫기"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 min-h-0 flex-1">
          <aside className="lg:col-span-4 xl:col-span-3 border-b lg:border-b-0 lg:border-r border-slate-800 p-4 space-y-3">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-3 pointer-events-none" />
              <input
                type="text"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="매뉴얼 검색"
                className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-xs font-bold outline-none focus:border-indigo-400"
              />
            </div>

            <div className="max-h-64 lg:max-h-[68vh] overflow-y-auto space-y-2 pr-1">
              {filteredSections.map((section) => (
                <button
                  key={section.id}
                  type="button"
                  onClick={() => setSelectedId(section.id)}
                  className={`w-full text-left p-3 rounded-2xl border transition-colors ${
                    selectedSection.id === section.id
                      ? 'bg-indigo-600/20 border-indigo-500/40 text-white'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  <span className="block text-xs font-black">{section.title}</span>
                  <span className="block text-[10px] font-bold mt-1 text-slate-500">{section.audience}</span>
                </button>
              ))}
            </div>
          </aside>

          <div className="lg:col-span-8 xl:col-span-9 p-5 overflow-y-auto">
            <div className="space-y-5">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2.5 py-1 rounded-lg bg-indigo-500/10 border border-indigo-500/25 text-indigo-300 text-[10px] font-black">
                    {selectedSection.audience}
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-slate-400 text-[10px] font-black">
                    가이드
                  </span>
                </div>
                <h3 className="text-white text-xl font-black mt-3">{selectedSection.title}</h3>
                <p className="text-sm text-slate-300 font-semibold leading-relaxed mt-2">
                  {selectedSection.summary}
                </p>
              </div>

              <div>
                <h4 className="text-slate-200 text-sm font-black mb-3">사용 순서</h4>
                <ol className="space-y-2">
                  {selectedSection.steps.map((step, index) => (
                    <li key={step} className="flex gap-3 rounded-2xl bg-slate-950 border border-slate-800 p-3">
                      <span className="w-6 h-6 rounded-lg bg-indigo-600 text-white text-[11px] font-black flex items-center justify-center shrink-0">
                        {index + 1}
                      </span>
                      <span className="text-xs text-slate-300 font-bold leading-relaxed">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>

              <div>
                <h4 className="text-slate-200 text-sm font-black mb-3">확인 사항</h4>
                <div className="space-y-2">
                  {selectedSection.notes.map((note) => (
                    <div key={note} className="flex gap-2 rounded-2xl bg-emerald-500/5 border border-emerald-500/15 p-3">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span className="text-xs text-slate-300 font-bold leading-relaxed">{note}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
