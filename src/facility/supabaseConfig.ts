export interface SupabaseRuntimeEnv {
  VITE_SUPABASE_URL?: string;
  VITE_SUPABASE_ANON_KEY?: string;
}

export interface SupabaseConnectionConfig {
  enabled: boolean;
  url: string;
  anonKey: string;
  reason?: string;
}

const isPlaceholder = (value: string) =>
  value.includes('YOUR_') || value.includes('...');

export const resolveSupabaseConfig = (env: SupabaseRuntimeEnv): SupabaseConnectionConfig => {
  const url = (env.VITE_SUPABASE_URL || '').trim();
  const anonKey = (env.VITE_SUPABASE_ANON_KEY || '').trim();

  if (!url || !anonKey) {
    return { enabled: false, url, anonKey, reason: 'Supabase 환경변수가 비어 있습니다.' };
  }

  if (isPlaceholder(url) || isPlaceholder(anonKey)) {
    return { enabled: false, url, anonKey, reason: 'Supabase 환경변수가 예시값입니다.' };
  }

  if (!url.startsWith('https://') || !url.includes('.supabase.co')) {
    return { enabled: false, url, anonKey, reason: 'Supabase URL 형식이 올바르지 않습니다.' };
  }

  return { enabled: true, url, anonKey };
};
