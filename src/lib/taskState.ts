import { Task } from '../types';

export const isCompletionApproved = (task: Task) =>
  task.history.some((log) => log.action.includes('최종 통과'));

export const isApprovalPending = (task: Task) =>
  task.status === '완료' && Boolean(task.completionReport) && !isCompletionApproved(task);

export const getTaskStatusLabel = (task: Task) => {
  if (isApprovalPending(task)) return '승인대기';
  if (task.status === '완료' && isCompletionApproved(task)) return '승인완료';
  return task.status;
};
