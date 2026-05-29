# Supabase Backend Setup

This folder contains the first Supabase backend contract for the facility management app.

## Apply Schema

1. Create a Supabase project.
2. Open the Supabase SQL editor.
3. Run `facility-management-schema.sql`.
4. Create the first admin profile after the first login.
5. Optionally run `seed-facility-demo-data.sql` to load demo facilities, assets, and inspection schedules.

## Tables

- `profiles`: user role and active status
- `facilities`: facility CRUD
- `facility_assets`: equipment and asset management
- `facility_reservations`: reservations with overlap protection
- `facility_maintenance_requests`: maintenance request workflow
- `facility_inspection_schedules`: legal and periodic inspections
- `facility_notifications`: reservation and maintenance alerts

## Storage

The schema creates a public `facility-images` bucket for facility images and maintenance photos. Authenticated users can read files. Admin and staff users can upload files.

## Notes

The current app still uses browser storage for the local MVP. The repository files under `src/facility/*Repository.ts` already implement the data source boundary, so Supabase integration can replace those repository internals without rewriting the UI components.
