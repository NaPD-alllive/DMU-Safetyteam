import {
  countAssetRisks,
  sortFacilityAssets,
  updateAssetCondition,
  updateAssetStatus,
} from './assetState';
import { FacilityAsset } from './types';

const assert = (condition: boolean, message: string) => {
  if (!condition) throw new Error(message);
};

const assets: FacilityAsset[] = [
  {
    id: 'good',
    facilityId: 'facility_1',
    facilityName: '강의실',
    name: '정상 프로젝터',
    assetTag: 'A-001',
    category: '영상',
    condition: 'good',
    status: 'active',
    managerName: '박성훈',
    createdAt: '2026-05-01T00:00:00Z',
    updatedAt: '2026-05-01T00:00:00Z',
  },
  {
    id: 'repair',
    facilityId: 'facility_2',
    facilityName: '실험실',
    name: '비상샤워기',
    assetTag: 'A-002',
    category: '안전',
    condition: 'repair',
    status: 'maintenance',
    managerName: '김익현',
    createdAt: '2026-05-01T00:00:00Z',
    updatedAt: '2026-05-01T00:00:00Z',
  },
  {
    id: 'watch',
    facilityId: 'facility_3',
    facilityName: '회의실',
    name: '무선마이크',
    assetTag: 'A-003',
    category: '음향',
    condition: 'watch',
    status: 'active',
    managerName: '오승훈',
    createdAt: '2026-05-01T00:00:00Z',
    updatedAt: '2026-05-01T00:00:00Z',
  },
];

assert(sortFacilityAssets(assets)[0].id === 'repair', 'repair assets should be listed first');
assert(countAssetRisks(assets) === 2, 'watch and repair assets should count as risks');

const conditionUpdated = updateAssetCondition(assets, 'good', 'watch', '2026-05-27T10:00:00Z');
const changedCondition = conditionUpdated.find((asset) => asset.id === 'good');
assert(changedCondition?.condition === 'watch', 'condition update should change asset condition');
assert(changedCondition?.lastCheckedAt === '2026-05-27', 'condition update should refresh last check date');

const statusUpdated = updateAssetStatus(assets, 'good', 'retired', '2026-05-27T11:00:00Z');
assert(statusUpdated.find((asset) => asset.id === 'good')?.status === 'retired', 'status update should change asset status');

console.log('asset state tests passed');
