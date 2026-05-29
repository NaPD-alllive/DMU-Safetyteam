import { FacilityAsset, FacilityAssetCondition, FacilityAssetStatus } from './types';

const conditionRank: Record<FacilityAssetCondition, number> = {
  repair: 0,
  watch: 1,
  good: 2,
};

const statusRank: Record<FacilityAssetStatus, number> = {
  maintenance: 0,
  active: 1,
  retired: 2,
};

export const sortFacilityAssets = (assets: FacilityAsset[]) =>
  [...assets].sort((a, b) => {
    const conditionOrder = conditionRank[a.condition] - conditionRank[b.condition];
    if (conditionOrder !== 0) return conditionOrder;
    const statusOrder = statusRank[a.status] - statusRank[b.status];
    if (statusOrder !== 0) return statusOrder;
    return a.name.localeCompare(b.name, 'ko-KR');
  });

export const countAssetRisks = (assets: FacilityAsset[]) =>
  assets.filter((asset) => asset.condition !== 'good' || asset.status === 'maintenance').length;

export const updateAssetCondition = (
  assets: FacilityAsset[],
  id: string,
  condition: FacilityAssetCondition,
  now = new Date().toISOString(),
) => assets.map((asset) => asset.id === id ? { ...asset, condition, lastCheckedAt: now.slice(0, 10), updatedAt: now } : asset);

export const updateAssetStatus = (
  assets: FacilityAsset[],
  id: string,
  status: FacilityAssetStatus,
  now = new Date().toISOString(),
) => assets.map((asset) => asset.id === id ? { ...asset, status, updatedAt: now } : asset);
