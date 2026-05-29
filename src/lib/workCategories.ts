import type { Task } from '../types';
import { DAILY_LOG_WORK_TYPES, DEFAULT_DAILY_LOG_WORK_TYPE } from './dailyLogWorkTypes';

export const WORK_CATEGORY_STORAGE_KEY = 'fms_work_categories';

export const DEFAULT_WORK_CATEGORIES = [...DAILY_LOG_WORK_TYPES];

const LEGACY_TASK_CATEGORY_MAP: Record<string, string> = {
  공사: '공사관리',
  전기: '안전관리',
  냉난방기: '시설관리',
  '자산 관리': '자산관리',
  기자재: '기술지원',
  '기자재 유지보수': '기술지원',
  '안전관리(연구실 안전포함)': '안전관리',
  '임대시설 관리 및 대관': '임대시설&대관',
};

export const normalizeWorkCategory = (category: string) => {
  const trimmed = category.trim();
  if (!trimmed) return DEFAULT_DAILY_LOG_WORK_TYPE;
  return LEGACY_TASK_CATEGORY_MAP[trimmed] || trimmed;
};

export const uniqueWorkCategories = (categories: string[]) => {
  const seen = new Set<string>();
  return categories
    .map((category) => category.trim())
    .filter(Boolean)
    .map(normalizeWorkCategory)
    .filter((category) => {
      if (!category || seen.has(category)) return false;
      seen.add(category);
      return true;
    });
};

export const parseStoredWorkCategories = (raw: string | null) => {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed) ? parsed.filter((item): item is string => typeof item === 'string') : [];
  } catch {
    return [];
  }
};

export const buildWorkCategories = (tasks: Task[], storedCategories: string[] = []) =>
  uniqueWorkCategories([
    ...(storedCategories.length > 0 ? storedCategories : DEFAULT_WORK_CATEGORIES),
    ...tasks.map((task) => task.category),
  ]);

export const mergeMissingDefaultTasks = (savedTasks: Task[] | null, defaultTasks: Task[]) => {
  if (!savedTasks) return null;

  const savedIds = new Set(savedTasks.map((task) => task.id));
  const missingDefaultTasks = defaultTasks.filter((task) => !savedIds.has(task.id));
  return [...savedTasks, ...missingDefaultTasks];
};
