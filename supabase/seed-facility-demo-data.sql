insert into public.facilities (
  id,
  name,
  category,
  capacity,
  location,
  description,
  status,
  created_at,
  updated_at
) values
  (
    '11111111-1111-4111-8111-111111111111',
    '본관 101 스마트 강의실',
    '강의실',
    80,
    '본관 1층 101호',
    '전자칠판, 빔프로젝터, 무선마이크가 설치된 대형 강의실입니다.',
    '운영중',
    '2026-05-01T09:00:00Z',
    '2026-05-01T09:00:00Z'
  ),
  (
    '22222222-2222-4222-8222-222222222222',
    '본관 3층 대회의실',
    '회의실',
    32,
    '본관 3층',
    '학과 회의와 외부 방문객 응대에 사용하는 회의실입니다.',
    '운영중',
    '2026-05-02T09:00:00Z',
    '2026-05-02T09:00:00Z'
  ),
  (
    '33333333-3333-4333-8333-333333333333',
    '공학관 공용 실습실',
    '실습실',
    24,
    '공학관 4층',
    '연구실 안전 점검 대상 시설이며 사전 승인 후 예약 가능합니다.',
    '점검중',
    '2026-05-03T09:00:00Z',
    '2026-05-03T09:00:00Z'
  ),
  (
    '44444444-4444-4444-8444-444444444444',
    '종합관 실내체육실',
    '건물명',
    120,
    '종합관 B1',
    '체육 수업, 동아리 활동, 행사 준비 공간으로 사용하는 시설입니다.',
    '운영중',
    '2026-05-04T09:00:00Z',
    '2026-05-04T09:00:00Z'
  )
on conflict (id) do update set
  name = excluded.name,
  category = excluded.category,
  capacity = excluded.capacity,
  location = excluded.location,
  description = excluded.description,
  status = excluded.status,
  updated_at = excluded.updated_at;

insert into public.facility_assets (
  id,
  facility_id,
  name,
  asset_tag,
  category,
  condition,
  status,
  manager_name,
  purchased_at,
  last_checked_at,
  value,
  notes,
  created_at,
  updated_at
) values
  (
    'aaaaaaaa-1111-4111-8111-111111111111',
    '11111111-1111-4111-8111-111111111111',
    '레이저 빔프로젝터',
    'FMS-LECTURE-PRJ-001',
    '영상장비',
    'good',
    'active',
    '박성훈',
    '2025-03-01',
    '2026-05-10',
    3200000,
    '램프 수명과 HDMI 입력 상태 정상',
    '2026-05-01T09:00:00Z',
    '2026-05-10T09:00:00Z'
  ),
  (
    'aaaaaaaa-2222-4222-8222-222222222222',
    '22222222-2222-4222-8222-222222222222',
    '무선 회의 마이크 세트',
    'FMS-MEETING-MIC-003',
    '음향장비',
    'watch',
    'active',
    '오승훈',
    '2024-08-12',
    '2026-05-18',
    1450000,
    '2번 마이크 배터리 접점 확인 필요',
    '2026-05-01T09:00:00Z',
    '2026-05-18T09:00:00Z'
  ),
  (
    'aaaaaaaa-3333-4333-8333-333333333333',
    '33333333-3333-4333-8333-333333333333',
    '비상샤워기 및 세안기',
    'FMS-LAB-SAFE-007',
    '안전설비',
    'repair',
    'maintenance',
    '김익현',
    '2023-02-15',
    '2026-05-20',
    980000,
    '수압이 낮아 밸브와 배관 연결부 점검 중',
    '2026-05-01T09:00:00Z',
    '2026-05-20T09:00:00Z'
  ),
  (
    'aaaaaaaa-4444-4444-8444-444444444444',
    '44444444-4444-4444-8444-444444444444',
    '공조 순환팬',
    'FMS-GYM-HVAC-004',
    '기계설비',
    'good',
    'active',
    '박희찬',
    '2024-05-20',
    '2026-05-22',
    2100000,
    '소음과 진동 모두 정상 범위',
    '2026-05-01T09:00:00Z',
    '2026-05-22T09:00:00Z'
  )
on conflict (id) do update set
  condition = excluded.condition,
  status = excluded.status,
  manager_name = excluded.manager_name,
  last_checked_at = excluded.last_checked_at,
  value = excluded.value,
  notes = excluded.notes,
  updated_at = excluded.updated_at;

insert into public.facility_inspection_schedules (
  id,
  facility_id,
  title,
  inspection_type,
  cycle,
  inspector_name,
  due_date,
  status,
  notes,
  created_at,
  updated_at
) values
  (
    'bbbbbbbb-1111-4111-8111-111111111111',
    '33333333-3333-4333-8333-333333333333',
    '연구실 안전 정기점검',
    '연구실 안전',
    'monthly',
    '김익현',
    '2026-05-30',
    'scheduled',
    '화학물질 보관함, MSDS, 비상샤워기 상태를 함께 확인합니다.',
    '2026-05-01T09:00:00Z',
    '2026-05-01T09:00:00Z'
  ),
  (
    'bbbbbbbb-2222-4222-8222-222222222222',
    '11111111-1111-4111-8111-111111111111',
    '전기설비 분기 점검',
    '전기',
    'quarterly',
    '이인혁',
    '2026-06-07',
    'scheduled',
    '전자칠판 전원부, 콘센트 과열 흔적, 분전반 차단기 상태를 확인합니다.',
    '2026-05-01T09:00:00Z',
    '2026-05-01T09:00:00Z'
  ),
  (
    'bbbbbbbb-3333-4333-8333-333333333333',
    '44444444-4444-4444-8444-444444444444',
    '소방 및 피난동선 점검',
    '소방',
    'monthly',
    '오승훈',
    '2026-05-24',
    'scheduled',
    '비상구 적치물, 유도등, 소화기 압력 상태를 확인합니다.',
    '2026-05-01T09:00:00Z',
    '2026-05-01T09:00:00Z'
  )
on conflict (id) do update set
  due_date = excluded.due_date,
  status = excluded.status,
  notes = excluded.notes,
  updated_at = excluded.updated_at;
