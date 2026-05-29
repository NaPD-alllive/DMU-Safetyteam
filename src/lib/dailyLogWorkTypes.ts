export const DAILY_LOG_WORK_TYPES = [
  '공사관리',
  '교지 교사관리',
  '시설관리',
  '안전관리',
  '자산관리',
  '임대시설&대관',
  '기술지원',
] as const;

export type DailyLogWorkType = (typeof DAILY_LOG_WORK_TYPES)[number];

export const DEFAULT_DAILY_LOG_WORK_TYPE: DailyLogWorkType = '시설관리';
