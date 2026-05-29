import { buildWorkCategories, DEFAULT_WORK_CATEGORIES, uniqueWorkCategories } from './workCategories';
import type { Task } from '../types';

const assert = (condition: boolean, message: string) => {
  if (!condition) throw new Error(message);
};

const tasks: Task[] = [
  {
    id: 'task_custom',
    title: '조경 시설 점검',
    category: '조경',
    description: '외부 녹지 점검',
    status: '대기중',
    priority: '보통',
    location: '캠퍼스 외부',
    assignee: '박성훈',
    createdAt: '2026-05-27T09:00:00Z',
    comments: [],
    history: [],
  },
];

const defaultCategories = buildWorkCategories(tasks);
const customizedCategories = buildWorkCategories(tasks, ['건축', '소방']);

assert(defaultCategories.length === DEFAULT_WORK_CATEGORIES.length + 1, 'default seven plus task category should be visible');
assert(defaultCategories.includes('안전관리'), 'safety category should stay visible by default');
assert(defaultCategories.includes('임대시설&대관'), 'rental category should stay visible by default');
assert(customizedCategories.includes('소방'), 'stored custom category should be visible');
assert(customizedCategories.includes('조경'), 'task custom category should be visible');
assert(!customizedCategories.includes('공사'), 'renamed default categories should not be forced back into the list');
assert(uniqueWorkCategories(['공사', ' 공사 ', '']).length === 1, 'category names should be trimmed and deduplicated');

console.log('work category tests passed');
