import { useEffect, useMemo, useState } from 'react';
import { FACILITY_SNAPSHOT_APPLIED_EVENT } from './facilitySnapshot';
import { assetRepository } from './assetRepository';
import { sortFacilityAssets, updateAssetCondition, updateAssetStatus } from './assetState';
import { FacilityAssetCondition, FacilityAssetStatus } from './types';

const PAGE_SIZE = 5;

export const useFacilityAssets = () => {
  const [assets, setAssets] = useState(() => assetRepository.list());
  const [page, setPage] = useState(1);

  useEffect(() => assetRepository.saveAll(assets), [assets]);

  useEffect(() => {
    const refreshAssets = () => {
      setAssets(assetRepository.list());
      setPage(1);
    };

    window.addEventListener(FACILITY_SNAPSHOT_APPLIED_EVENT, refreshAssets);
    return () => window.removeEventListener(FACILITY_SNAPSHOT_APPLIED_EVENT, refreshAssets);
  }, []);

  const sortedAssets = useMemo(() => sortFacilityAssets(assets), [assets]);
  const pageCount = Math.max(1, Math.ceil(sortedAssets.length / PAGE_SIZE));
  const pageItems = sortedAssets.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const changeCondition = (id: string, condition: FacilityAssetCondition) =>
    setAssets((previous) => updateAssetCondition(previous, id, condition));

  const changeStatus = (id: string, status: FacilityAssetStatus) =>
    setAssets((previous) => updateAssetStatus(previous, id, status));

  return {
    assets,
    sortedAssets,
    page,
    pageCount,
    pageItems,
    setPage,
    changeCondition,
    changeStatus,
  };
};
