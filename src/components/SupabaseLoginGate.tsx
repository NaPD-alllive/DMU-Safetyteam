import React, { FormEvent, useEffect, useMemo, useState } from 'react';
import { Loader2, Lock, Mail, ShieldCheck } from 'lucide-react';
import type { UserProfile } from '../types';
import {
  clearStoredSupabaseAuthSession,
  fetchSupabaseAuthEmail,
  readStoredSupabaseAuthSession,
  signInWithSupabasePassword,
} from '../lib/supabaseAuth';
import { normalizeTeamEmail, resolveTeamUserByEmail } from '../lib/teamMembers';

interface SupabaseLoginGateProps {
  users: UserProfile[];
  onAuthenticated: (user: UserProfile, email: string) => void;
}

export default function SupabaseLoginGate({ users, onAuthenticated }: SupabaseLoginGateProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState<'checking' | 'ready' | 'signingIn'>('checking');
  const [error, setError] = useState('');

  const registeredEmails = useMemo(
    () => users.map((user) => user.email).filter(Boolean) as string[],
    [users],
  );

  useEffect(() => {
    let cancelled = false;

    const resolveSession = async () => {
      try {
        const session = readStoredSupabaseAuthSession();
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

    if (!resolveTeamUserByEmail(users, normalizedEmail)) {
      setError('등록된 시설관리팀 이메일만 로그인할 수 있습니다.');
      return;
    }

    try {
      setStatus('signingIn');
      const authEmail = normalizeTeamEmail(await signInWithSupabasePassword(normalizedEmail, password));
      const user = resolveTeamUserByEmail(users, authEmail);
      if (!user) {
        clearStoredSupabaseAuthSession();
        throw new Error('시설관리팀 등록 이메일이 아닙니다. 팀장에게 계정 등록을 요청해 주세요.');
      }

      onAuthenticated(user, authEmail);
    } catch (loginError) {
      setError(loginError instanceof Error ? loginError.message : '로그인하지 못했습니다.');
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
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight mt-1">이메일 / 비밀번호 로그인</h1>
            <p className="text-sm sm:text-base text-slate-300 mt-3 leading-relaxed">
              등록된 동양미래대학교 이메일과 비밀번호로 로그인해야 시스템을 사용할 수 있습니다.
              로그인 메일을 보내지 않기 때문에 Supabase 메일 발송 제한에 걸리지 않습니다.
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

            <label className="block">
              <span className="block text-sm font-bold text-slate-200 mb-2">비밀번호</span>
              <div className="relative">
                <Lock className="w-5 h-5 text-slate-500 absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Supabase에 등록한 비밀번호"
                  className="w-full pl-12 pr-4 py-4 rounded-2xl border border-slate-700 bg-slate-950 text-white text-base outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-400/15"
                  autoComplete="current-password"
                  required
                />
              </div>
            </label>

            {error && (
              <div className="rounded-2xl border border-rose-500/40 bg-rose-500/10 px-4 py-3 text-sm font-semibold text-rose-200">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={status === 'signingIn'}
              className="w-full rounded-2xl bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-700 disabled:text-slate-400 py-4 text-base font-bold text-white transition-colors flex items-center justify-center gap-2"
            >
              {status === 'signingIn' && <Loader2 className="w-5 h-5 animate-spin" />}
              로그인
            </button>
          </form>
        )}

        <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-950/60 p-4 text-sm text-slate-300 leading-relaxed">
          초기 계정은 Supabase Authentication &gt; Users에서 관리자가 만들어야 합니다.
          팀원 이메일을 추가하고 비밀번호를 지정한 뒤, 이메일 인증 완료 상태로 저장해 주세요.
        </div>
      </div>
    </div>
  );
}
