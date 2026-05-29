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
    return data?.msg || data?.message || data?.error_description || data?.error || response.statusText;
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
  if (session.expiresAt && session.expiresAt * 1000 <= Date.now() + 60_000) return null;
  return session.accessToken;
};

export const consumeSupabaseAuthRedirect = () => {
  if (typeof window === 'undefined' || !window.location.hash) return null;

  const params = new URLSearchParams(window.location.hash.replace(/^#/, ''));
  const error = params.get('error_description') || params.get('error');
  if (error) {
    window.history.replaceState(null, document.title, `${window.location.pathname}${window.location.search}`);
    throw new Error(error);
  }

  const accessToken = params.get('access_token');
  if (!accessToken) return null;

  const expiresAt = Number(params.get('expires_at') || 0);
  const expiresIn = Number(params.get('expires_in') || 0);
  const session: SupabaseAuthSession = {
    accessToken,
    refreshToken: params.get('refresh_token') || undefined,
    expiresAt: expiresAt || (expiresIn ? Math.floor(Date.now() / 1000) + expiresIn : undefined),
  };

  storeSupabaseAuthSession(session);
  window.history.replaceState(null, document.title, `${window.location.pathname}${window.location.search}`);
  return session;
};

export const requestSupabaseMagicLink = async (email: string) => {
  const config = getSupabaseAuthConfig();
  if (!config.enabled) {
    throw new Error(config.reason || 'Supabase 연결 정보가 없습니다.');
  }

  const redirectTo = `${window.location.origin}${window.location.pathname}`;
  const response = await fetch(`${config.url}/auth/v1/otp?redirect_to=${encodeURIComponent(redirectTo)}`, {
    method: 'POST',
    headers: {
      apikey: config.anonKey,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email,
      create_user: true,
    }),
  });

  if (!response.ok) {
    throw new Error(await readResponseError(response));
  }
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
