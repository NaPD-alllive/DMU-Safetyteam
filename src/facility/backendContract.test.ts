import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const assert = (condition: boolean, message: string) => {
  if (!condition) throw new Error(message);
};

const schema = readFileSync(resolve('supabase/facility-management-schema.sql'), 'utf-8');
const seed = readFileSync(resolve('supabase/seed-facility-demo-data.sql'), 'utf-8');
const vercelConfig = JSON.parse(readFileSync(resolve('vercel.json'), 'utf-8')) as {
  framework?: string;
  buildCommand?: string;
  outputDirectory?: string;
  rewrites?: { source: string; destination: string }[];
};

const requiredTables = [
  'public.profiles',
  'public.facilities',
  'public.facility_assets',
  'public.facility_reservations',
  'public.facility_maintenance_requests',
  'public.facility_inspection_schedules',
  'public.facility_notifications',
];

requiredTables.forEach((table) => {
  assert(schema.includes(`create table ${table}`), `${table} table should exist`);
  assert(schema.includes(`alter table ${table} enable row level security`), `${table} should enable RLS`);
});

[
  'facility_reservations_no_overlap',
  'current_facility_role',
  'is_facility_admin',
  'facility-images',
  'reservations_insert_self',
  'reservations_update_admin',
  'maintenance_update_admin',
  'notifications_select_recipient',
].forEach((keyword) => {
  assert(schema.includes(keyword), `${keyword} should be present in Supabase schema`);
});

[
  'insert into public.facilities',
  'insert into public.facility_assets',
  'insert into public.facility_inspection_schedules',
  'FMS-LECTURE-PRJ-001',
  '연구실 안전 정기점검',
].forEach((keyword) => {
  assert(seed.includes(keyword), `${keyword} should be present in Supabase seed`);
});

assert(vercelConfig.framework === 'vite', 'Vercel framework should be vite');
assert(vercelConfig.buildCommand === 'npm run build', 'Vercel should use npm run build');
assert(vercelConfig.outputDirectory === 'dist', 'Vercel output should be dist');
assert(Boolean(vercelConfig.rewrites?.some((rewrite) => rewrite.destination === '/index.html')), 'Vercel should rewrite SPA routes');

console.log('backend contract tests passed');
