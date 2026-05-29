import { DEFAULT_FACILITY_ASSETS } from './facilityData';
import type { AssetDataSource } from './dataSourceTypes';
import { FacilityAsset } from './types';

const ASSETS_STORAGE_KEY = 'facility_mvp_assets';

const parseAssets = (raw: string | null): FacilityAsset[] => {
  if (!raw) return DEFAULT_FACILITY_ASSETS;
  try {
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed) ? (parsed as FacilityAsset[]) : DEFAULT_FACILITY_ASSETS;
  } catch {
    return DEFAULT_FACILITY_ASSETS;
  }
};

export const assetRepository: AssetDataSource = {
  list(): FacilityAsset[] {
    return parseAssets(localStorage.getItem(ASSETS_STORAGE_KEY));
  },

  saveAll(assets: FacilityAsset[]) {
    localStorage.setItem(ASSETS_STORAGE_KEY, JSON.stringify(assets));
  },
};
