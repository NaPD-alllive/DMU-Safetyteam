import { createFacilityAuthSession, getSessionRole } from './authContract';
import {
  canManageAssets,
  canManageFacilities,
  canManageInspections,
  canManageMaintenance,
  canManageReservations,
  canManageUserAccess,
  canRequestMaintenance,
  canViewAllReservations,
} from './permissionPolicy';
import { resolveSupabaseConfig } from './supabaseConfig';

const assert = (condition: boolean, message: string) => {
  if (!condition) throw new Error(message);
};

const adminSession = createFacilityAuthSession({
  id: 'admin_1',
  email: 'admin@example.ac.kr',
  displayName: '관리자',
  role: 'admin',
  active: true,
});

const inactiveSession = createFacilityAuthSession({
  id: 'staff_1',
  email: 'staff@example.ac.kr',
  displayName: '교직원',
  role: 'staff',
  active: false,
});

assert(adminSession.authenticated, 'active profile should create authenticated session');
assert(getSessionRole(adminSession) === 'admin', 'session role should match active profile');
assert(!inactiveSession.authenticated, 'inactive profile should not create authenticated session');
assert(getSessionRole(inactiveSession) === 'user', 'inactive session should fall back to user role');

assert(canManageFacilities('admin'), 'admin should manage facilities');
assert(canManageReservations('admin'), 'admin should manage reservations');
assert(!canManageReservations('staff'), 'staff should not register facility usage schedules');
assert(!canManageReservations('user'), 'student users should not register facility usage schedules');
assert(canManageMaintenance('admin'), 'admin should manage maintenance');
assert(canManageUserAccess('admin'), 'admin should manage users');
assert(canManageInspections('admin'), 'admin should manage inspections');
assert(canManageAssets('admin'), 'admin should manage assets');
assert(canRequestMaintenance('staff'), 'staff should request maintenance');
assert(canViewAllReservations('staff'), 'staff should view all reservations');
assert(!canManageFacilities('staff'), 'staff should not manage facilities');
assert(!canRequestMaintenance('user'), 'student users should not request maintenance');

assert(!resolveSupabaseConfig({}).enabled, 'empty Supabase config should be disabled');
assert(!resolveSupabaseConfig({
  VITE_SUPABASE_URL: 'https://YOUR_PROJECT.supabase.co',
  VITE_SUPABASE_ANON_KEY: 'YOUR_SUPABASE_ANON_KEY',
}).enabled, 'placeholder Supabase config should be disabled');
assert(resolveSupabaseConfig({
  VITE_SUPABASE_URL: 'https://example.supabase.co',
  VITE_SUPABASE_ANON_KEY: 'valid-anon-key',
}).enabled, 'valid Supabase config should be enabled');

console.log('auth contract tests passed');
