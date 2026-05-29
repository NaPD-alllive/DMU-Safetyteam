import { resolveSupabaseConfig } from '../facility/supabaseConfig';
import type { FacilityAppState } from '../types';

interface ImportMetaWithEnv extends ImportMeta {
  env?: Record<string, string | undefined>;
}

interface SupabaseStateRow {
  id: 'main';
  state: FacilityAppState;
  revision: number;
  updated_at: string;
  updated_by: string | null;
}

export interface SupabaseStateHealth {
  ok: boolean;
  mode: 'supabase';
  savedAt?: string;
  taskCount: number;
  facilityCount: number;
  reservationCount: number;
  storagePath: string;
}

const getEnv = () => ((import.meta as ImportMetaWithEnv).env ?? {});

export const getSupabaseStateConfig = () => resolveSupabaseConfig(getEnv());

const getFacilityCounts = (state?: FacilityAppState) => ({
  taskCount: state?.tasks?.length ?? 0,
  facilityCount: state?.facilityModule?.facilities?.length ?? 0,
  reservationCount: state?.facilityModule?.reservations?.length ?? 0,
});

const buildStoragePath = (url: string) => `${url}/rest/v1/facility_app_state`;

const getHeaders = (anonKey: string) => ({
  apikey: anonKey,
  Authorization: `Bearer ${anonKey}`,
  'Content-Type': 'application/json',
});

const readResponseError = async (response: Response) => {
  try {
    const data = await response.json();
    return data?.message || data?.error || response.statusText;
  } catch {
    return response.statusText;
  }
};

const getMainStateRow = async (): Promise<SupabaseStateRow | null> => {
  const config = getSupabaseStateConfig();
  if (!config.enabled) {
    throw new Error(config.reason || 'Supabase 연결 정보가 없습니다.');
  }

  const response = await fetch(
    `${config.url}/rest/v1/facility_app_state?id=eq.main&select=id,state,revision,updated_at,updated_by`,
    {
      cache: 'no-store',
      headers: getHeaders(config.anonKey),
    },
  );

  if (!response.ok) {
    throw new Error(await readResponseError(response));
  }

  const rows = (await response.json()) as SupabaseStateRow[];
  return rows[0] ?? null;
};

export const getSupabaseStateHealth = async (): Promise<SupabaseStateHealth> => {
  const config = getSupabaseStateConfig();
  if (!config.enabled) {
    throw new Error(config.reason || 'Supabase 연결 정보가 없습니다.');
  }

  const row = await getMainStateRow();
  return {
    ok: true,
    mode: 'supabase',
    savedAt: row?.updated_at,
    ...getFacilityCounts(row?.state),
    storagePath: buildStoragePath(config.url),
  };
};

export const loadSupabaseState = async () => {
  const row = await getMainStateRow();
  return {
    hasState: Boolean(row?.state && Object.keys(row.state).length > 0),
    savedAt: row?.updated_at,
    state: row?.state,
  };
};

export const saveSupabaseState = async (
  state: FacilityAppState,
  updatedBy?: string,
): Promise<SupabaseStateHealth> => {
  const config = getSupabaseStateConfig();
  if (!config.enabled) {
    throw new Error(config.reason || 'Supabase 연결 정보가 없습니다.');
  }

  const response = await fetch(
    `${config.url}/rest/v1/facility_app_state?id=eq.main&select=id,state,revision,updated_at,updated_by`,
    {
      method: 'PATCH',
      headers: {
        ...getHeaders(config.anonKey),
        Prefer: 'return=representation',
      },
      body: JSON.stringify({
        state,
        updated_by: updatedBy || 'DMU Facility App',
      }),
    },
  );

  if (!response.ok) {
    throw new Error(await readResponseError(response));
  }

  const rows = (await response.json()) as SupabaseStateRow[];
  const saved = rows[0];

  return {
    ok: true,
    mode: 'supabase',
    savedAt: saved?.updated_at || new Date().toISOString(),
    ...getFacilityCounts(saved?.state || state),
    storagePath: buildStoragePath(config.url),
  };
};
