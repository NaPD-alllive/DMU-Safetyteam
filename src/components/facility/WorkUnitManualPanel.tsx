import React, { useMemo, useState } from 'react';
import { BookOpen, Search } from 'lucide-react';
import type { WorkUnitDefinition } from '../../facility/types';
import { WORK_UNIT_CATEGORIES } from '../../facility/workUnitData';

interface WorkUnitManualPanelProps {
  definitions: WorkUnitDefinition[];
}

const formatHours = (hours?: number) =>
  hours ? `${hours.toLocaleString('ko-KR')}시간` : '업무 발생 기준';

export default function WorkUnitManualPanel({ definitions }: WorkUnitManualPanelProps) {
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('전체');

  const filteredDefinitions = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return definitions.filter((definition) => {
      const matchesCategory = category === '전체' || definition.category === category;
      const searchableText = [
        definition.category,
        definition.name,
        definition.period,
        definition.approver,
        definition.regulation,
        definition.keyProcedures.join(' '),
        definition.cautions.join(' '),
      ].join(' ').toLowerCase();
      return matchesCategory && (!normalizedQuery || searchableText.includes(normalizedQuery));
    });
  }, [category, definitions, query]);

  return (
    <section className="bg-slate-900/60 border border-slate-800 rounded-3xl p-5 space-y-4">
      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
        <div>
          <h3 className="text-white font-black text-sm flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-sky-400" />
            단위업무 매뉴얼 기준
          </h3>
          <p className="text-[11px] text-slate-500 font-bold mt-1">
            단위업무 정의표와 매뉴얼을 기준으로 업무분류, 난이도, 증빙 기준을 정리합니다.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 w-full xl:w-auto">
          <div className="relative sm:w-72">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5 pointer-events-none" />
            <input
              type="text"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="단위업무, 절차, 규정 검색"
              className="w-full pl-8 pr-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-[11px] font-bold outline-none focus:border-sky-400"
            />
          </div>
          <select
            value={category}
            onChange={(event) => setCategory(event.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-800 text-slate-200 text-[11px] font-black outline-none focus:border-sky-400"
          >
            <option value="전체">전체 분류</option>
            {WORK_UNIT_CATEGORIES.map((item) => (
              <option key={item} value={item}>{item}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
        {filteredDefinitions.map((definition) => (
          <article key={definition.id} className="rounded-2xl bg-slate-950 border border-slate-800 p-4 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
              <div>
                <p className="text-[10px] text-sky-300 font-black">{definition.category}</p>
                <h4 className="text-white text-sm font-black mt-1">{definition.name}</h4>
              </div>
              <div className="flex flex-wrap gap-1.5">
                <span className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 text-[10px] font-black">
                  난이도 {definition.difficulty}
                </span>
                <span className="px-2.5 py-1 rounded-lg bg-indigo-500/10 border border-indigo-500/25 text-indigo-300 text-[10px] font-black">
                  {formatHours(definition.annualHours)}
                </span>
              </div>
            </div>

            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] font-bold">
              <div>
                <dt className="text-slate-500">업무시기</dt>
                <dd className="text-slate-300 mt-0.5">{definition.period}</dd>
              </div>
              <div>
                <dt className="text-slate-500">최종결재</dt>
                <dd className="text-slate-300 mt-0.5">{definition.approver}</dd>
              </div>
            </dl>

            <div className="space-y-2">
              <p className="text-[10px] text-slate-500 font-black">주요 절차</p>
              <div className="flex flex-wrap gap-1.5">
                {definition.keyProcedures.slice(0, 4).map((procedure) => (
                  <span key={procedure} className="px-2 py-1 rounded-lg bg-slate-900 text-slate-300 text-[10px] font-bold">
                    {procedure}
                  </span>
                ))}
              </div>
            </div>

            <p className="text-[11px] text-slate-400 font-bold leading-relaxed">
              증빙: {definition.evidenceHint}
            </p>
          </article>
        ))}
      </div>

      {filteredDefinitions.length > 0 && (
        <p className="text-[11px] text-slate-500 font-bold">
          현재 조건에서 {filteredDefinitions.length.toLocaleString('ko-KR')}개 단위업무 기준을 모두 표시합니다.
        </p>
      )}

      {filteredDefinitions.length === 0 && (
        <div className="p-8 rounded-2xl bg-slate-950 border border-slate-800 text-center text-slate-500 text-xs font-bold">
          조건에 맞는 단위업무가 없습니다.
        </div>
      )}
    </section>
  );
}
