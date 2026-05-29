import { resolveSupabaseConfig } from '../facility/supabaseConfig';

interface ImportMetaWithEnv extends ImportMeta {
  env?: Record<string, string | undefined>;
}

interface SupabaseUserResponse {
  email?: string;
  user_metadata?: {
    email?: string;
  };
}

interface SupabasePasswordTokenResponse {
  access_token: string;
  refresh_token?: string;
  expires_in?: number;
  expires_at?: number;
  user?: SupabaseUserResponse;
}

export interface SupabaseAuthSession {
  accessToken: string;
  refreshToken?: string;
  expiresAt?: number;
}

const SUPABASE_AUTH_SESSION_KEY = 'fms_supabase_auth_session';

const getEnv = () => ((import.meta as ImportMetaWithEnv).env ?? {});

export const getSupabaseAuthConfig = () => resolveSupabaseConfig(getEnv());

const hasBrowserStorage = () => typeof window !== 'undefined' && Boolean(window.localStorage);

const readResponseError = async (response: Response) => {
  try {
    const data = await response.json();
    const message = data?.msg || data?.message || data?.error_description || data?.error || response.statusText;
    const lowerMessage = String(message).toLowerCase();
    if (lowerMessage.includes('invalid login credentials')) {
      return '이메일 또는 비밀번호가 맞지 않습니다. Supabase Authentication > Users에 계정이 생성되어 있는지 확인해 주세요.';
    }
    if (lowerMessage.includes('email not confirmed')) {
      return '이메일 인증이 완료되지 않은 계정입니다. Supabase 사용자 화면에서 Email Confirm 처리를 해 주세요.';
    }
    return message;
  } catch {
    return response.statusText;
  }
};

export const readStoredSupabaseAuthSession = (): SupabaseAuthSession | null => {
  if (!hasBrowserStorage()) return null;

  try {
    const raw = window.localStorage.getItem(SUPABASE_AUTH_SESSION_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as SupabaseAuthSession;
    return parsed?.accessToken ? parsed : null;
  } catch {
    return null;
  }
};

export const storeSupabaseAuthSession = (session: SupabaseAuthSession) => {
  if (!hasBrowserStorage()) return;
  window.localStorage.setItem(SUPABASE_AUTH_SESSION_KEY, JSON.stringify(session));
};

export const clearStoredSupabaseAuthSession = () => {
  if (!hasBrowserStorage()) return;
  window.localStorage.removeItem(SUPABASE_AUTH_SESSION_KEY);
};

export const getStoredSupabaseAccessToken = () => {
  const session = readStoredSupabaseAuthSession();
  if (!session) return null;
  return session.accessToken;
};

export const signInWithSupabasePassword = async (email: string, password: string) => {
  const config = getSupabaseAuthConfig();
  if (!config.enabled) {
    throw new Error(config.reason || 'Supabase 연결 정보가 없습니다.');
  }

  const response = await fetch(`${config.url}/auth/v1/token?grant_type=password`, {
    method: 'POST',
    headers: {
      apikey: config.anonKey,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email,
      password,
    }),
  });

  if (!response.ok) {
    throw new Error(await readResponseError(response));
  }

  const data = (await response.json()) as SupabasePasswordTokenResponse;
  if (!data.access_token) {
    throw new Error('로그인 토큰을 받지 못했습니다. Supabase 설정을 확인해 주세요.');
  }

  storeSupabaseAuthSession({
    accessToken: data.access_token,
    refreshToken: data.refresh_token,
    expiresAt: data.expires_at || (data.expires_in ? Math.floor(Date.now() / 1000) + data.expires_in : undefined),
  });

  return data.user?.email || email;
};

export const fetchSupabaseAuthEmail = async (session: SupabaseAuthSession) => {
  const config = getSupabaseAuthConfig();
  if (!config.enabled) {
    throw new Error(config.reason || 'Supabase 연결 정보가 없습니다.');
  }

  const response = await fetch(`${config.url}/auth/v1/user`, {
    cache: 'no-store',
    headers: {
      apikey: config.anonKey,
      Authorization: `Bearer ${session.accessToken}`,
    },
  });

  if (!response.ok) {
    throw new Error(await readResponseError(response));
  }

  const user = (await response.json()) as SupabaseUserResponse;
  return user.email || user.user_metadata?.email || '';
};
