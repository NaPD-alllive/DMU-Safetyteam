import { useEffect, useMemo, useState } from 'react';
import type { UserProfile } from '../types';
import { FACILITY_SNAPSHOT_APPLIED_EVENT } from './facilitySnapshot';
import { userAccessRepository } from './userAccessRepository';
import {
  getEffectiveFacilityRole,
  reconcileUserAccess,
  updateUserAccessActive,
  updateUserAccessRole,
} from './userAccessState';
import type { FacilityRole, FacilityUserAccess } from './types';

export const useFacilityUserAccess = (users: UserProfile[]) => {
  const [accessList, setAccessList] = useState<FacilityUserAccess[]>(() => (
    reconcileUserAccess(users, userAccessRepository.list())
  ));

  useEffect(() => {
    setAccessList((previous) => reconcileUserAccess(users, previous));
  }, [users]);

  useEffect(() => userAccessRepository.saveAll(accessList), [accessList]);

  useEffect(() => {
    const refreshAccessList = () => {
      setAccessList(reconcileUserAccess(users, userAccessRepository.list()));
    };

    window.addEventListener(FACILITY_SNAPSHOT_APPLIED_EVENT, refreshAccessList);
    return () => window.removeEventListener(FACILITY_SNAPSHOT_APPLIED_EVENT, refreshAccessList);
  }, [users]);

  const accessByUserId = useMemo(() => new Map(accessList.map((item) => [item.userId, item])), [accessList]);

  const changeRole = (userId: string, role: FacilityRole) =>
    setAccessList((previous) => updateUserAccessRole(previous, userId, role));

  const changeActive = (userId: string, active: boolean) =>
    setAccessList((previous) => updateUserAccessActive(previous, userId, active));

  const replaceAccessList = (nextAccessList: FacilityUserAccess[]) =>
    setAccessList(reconcileUserAccess(users, nextAccessList));

  const getRoleForUser = (user: UserProfile) => getEffectiveFacilityRole(accessList, user);

  return {
    accessList,
    accessByUserId,
    changeRole,
    changeActive,
    replaceAccessList,
    getRoleForUser,
  };
};
