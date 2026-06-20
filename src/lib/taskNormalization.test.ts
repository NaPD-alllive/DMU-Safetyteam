import { normalizeTask, normalizeTasks } from './taskNormalization';
import { isCompletionApproved } from './taskState';
import type { Task } from '../types';

const assert = (condition: boolean, message: string) => {
  if (!condition) throw new Error(message);
};

const legacyTask = {
  id: 'legacy-task',
  title: 'Legacy task',
  category: '전기',
  description: 'old data without nested arrays',
  status: '완료',
  priority: '보통',
  location: '본관',
  assignee: '김영해',
  createdAt: '2026-05-27T00:00:00.000Z',
} as unknown as Task;

const normalized = normalizeTask(legacyTask);

assert(normalized !== null, 'normalizeTask should keep object tasks');
assert(Array.isArray(normalized?.comments), 'normalizeTask should create a comments array');
assert(Array.isArray(normalized?.history), 'normalizeTask should create a history array');
assert(normalized?.comments.length === 0, 'normalizeTask should default missing comments to empty');
assert(normalized?.history.length === 0, 'normalizeTask should default missing history to empty');
assert(normalizeTasks([legacyTask]).length === 1, 'normalizeTasks should keep valid task objects');
assert(!isCompletionApproved(legacyTask), 'isCompletionApproved should not crash on missing history');

console.log('task normalization tests passed');
