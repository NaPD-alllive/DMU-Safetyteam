import type { Task } from '../types';
import { normalizeWorkCategory } from './workCategories';

const isRecord = (value: unknown): value is Record<string, unknown> =>
  Boolean(value && typeof value === 'object');

const normalizeRecordArray = <T>(value: unknown): T[] =>
  Array.isArray(value) ? (value.filter(isRecord) as T[]) : [];

export const normalizeTask = (task: unknown): Task | null => {
  if (!isRecord(task)) return null;

  const candidate = task as Partial<Task> & Record<string, unknown>;

  return {
    ...candidate,
    category: normalizeWorkCategory(typeof candidate.category === 'string' ? candidate.category : ''),
    comments: normalizeRecordArray<Task['comments'][number]>(candidate.comments),
    history: normalizeRecordArray<Task['history'][number]>(candidate.history),
  } as Task;
};

export const normalizeTasks = (tasks: unknown): Task[] =>
  Array.isArray(tasks)
    ? tasks.map((task) => normalizeTask(task)).filter((task): task is Task => Boolean(task))
    : [];
