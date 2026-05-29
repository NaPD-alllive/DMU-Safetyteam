import React, { FormEvent, useEffect, useMemo, useState } from 'react';
import { Loader2, Mail, ShieldCheck } from 'lucide-react';
import type { UserProfile } from '../types';
import {
  clearStoredSupabaseAuthSession,
  consumeSupabaseAuthRedirect,
  fetchSupabaseAuthEmail,
  readStoredSupabaseAuthSession,
  requestSupabaseMagicLink,
} from '../lib/supabaseAuth';
import { normalizeTeamEmail, resolveTeamUserByEmail } from '../lib/teamMembers';

interface SupabaseLoginGateProps {
  users: UserProfile[];
  onAuthenticated: (user: UserProfile, email: string) => void;
}

export default function SupabaseLoginGate({ users, onAuthenticated }: SupabaseLoginGateProps) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'checking' | 'ready' | 'sending'>('checking');
  const [notice, setNotice] = useState('');
  const [error, setError] = useState('');

  const registeredEmails = useMemo(
    () => users.map((user) => user.email).filter(Boolean) as string[],
    [users],
  );

  useEffect(() => {
    let cancelled = false;

    const resolveSession = async () => {
      try {
        const session = consumeSupabaseAuthRedirect() || readStoredSupabaseAuthSession();
        if (!session) {
          if (!cancelled) setStatus('ready');
          return;
        }

        const authEmail = normalizeTeamEmail(await fetchSupabaseAuthEmail(session));
        const user = resolveTeamUserByEmail(users, authEmail);
        if (!user) {
          clearStoredSupabaseAuthSession();
          throw new Error('시설관리팀 등록 이메일이 아닙니다. 팀장에게 계정 등록을 요청해 주세요.');
        }

        if (!cancelled) {
          onAuthenticated(user, authEmail);
        }
      } catch (sessionError) {
        clearStoredSupabaseAuthSession();
        if (!cancelled) {
          setError(sessionError instanceof Error ? sessionError.message : '로그인 정보를 확인하지 못했습니다.');
          setStatus('ready');
        }
      }
    };

    void resolveSession();

    return () => {
      cancelled = true;
    };
  }, [onAuthenticated, users]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const normalizedEmail = normalizeTeamEmail(email);
    setError('');
    setNotice('');

    if (!resolveTeamUserByEmail(users, normalizedEmail)) {
      setError('등록된 시설관리팀 이메일만 로그인할 수 있습니다.');
      return;
    }

    try {
      setStatus('sending');
      await requestSupabaseMagicLink(normalizedEmail);
      setNotice('로그인 링크를 보냈습니다. 메일함에서 Supabase 로그인 메일을 열고 링크를 눌러 주세요.');
      setStatus('ready');
    } catch (sendError) {
      setError(sendError instanceof Error ? sendError.message : '로그인 메일을 보내지 못했습니다.');
      setStatus('ready');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-xl rounded-3xl border border-slate-700 bg-slate-900/90 p-6 sm:p-8 shadow-2xl">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 rounded-2xl border border-emerald-500/25 bg-emerald-500/10 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-7 h-7 text-emerald-300" />
          </div>
          <div>
            <p className="text-sm text-emerald-300 font-semibold">DMU 시설관리팀 인증</p>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mt-1">이메일로 본인 확인</h1>
            <p className="text-sm sm:text-base text-slate-300 mt-3 leading-relaxed">
              등록된 동양미래대학교 이메일로 로그인해야 시스템을 사용할 수 있습니다.
              로그인 후에는 본인 계정으로 고정되어 다른 직원 계정으로 바꿀 수 없습니다.
            </p>
          </div>
        </div>

        {status === 'checking' ? (
          <div className="mt-8 rounded-2xl border border-slate-800 bg-slate-950/80 p-5 flex items-center gap-3 text-slate-300">
            <Loader2 className="w-5 h-5 animate-spin text-indigo-300" />
            기존 로그인 상태를 확인하고 있습니다.
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            <label className="block">
              <span className="block text-sm font-bold text-slate-200 mb-2">직원 이메일</span>
              <div className="relative">
                <Mail className="w-5 h-5 text-slate-500 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="예: rhs@dongyang.ac.kr"
                  className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-700 bg-slate-950 text-white text-base outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/15"
                  list="facility-team-emails"
                  autoComplete="email"
                  required
                />
                <datalist id="facility-team-emails">
                  {registeredEmails.map((registeredEmail) => (
                    <option key={registeredEmail} value={registeredEmail} />
                  ))}
                </datalist>
              </div>
            </label>

            {error && (
              <div className="rounded-2xl border border-rose-500/40 bg-rose-500/10 px-4 py-3 text-sm font-semibold text-rose-200">
                {error}
              </div>
            )}

            {notice && (
              <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-3 text-sm font-semibold text-emerald-200">
                {notice}
              </div>
            )}

            <button
              type="submit"
              disabled={status === 'sending'}
              className="w-full rounded-2xl bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-700 disabled:text-slate-400 py-4 text-base font-bold text-white transition-colors flex items-center justify-center gap-2"
            >
              {status === 'sending' && <Loader2 className="w-5 h-5 animate-spin" />}
              로그인 링크 받기
            </button>
          </form>
        )}

        <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-950/60 p-4 text-sm text-slate-300 leading-relaxed">
          메일이 오지 않으면 스팸함을 확인하고, Supabase 인증 설정의 Site URL과 Redirect URL이
          현재 Vercel 주소로 되어 있는지 확인해 주세요.
        </div>
      </div>
    </div>
  );
}
