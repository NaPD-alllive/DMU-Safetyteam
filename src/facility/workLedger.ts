import type { DailyLog, Task } from '../types';
import { getTaskStatusLabel } from '../lib/taskState';
import { DEFAULT_DAILY_LOG_WORK_TYPE } from '../lib/dailyLogWorkTypes';
import { WORK_UNIT_DEFINITIONS, getWorkUnitById } from './workUnitData';
import type {
  WorkLedgerEntry,
  WorkUnitDefinition,
} from './types';

interface WorkLedgerSources {
  tasks: Task[];
  dailyLogs: DailyLog[];
}

const fallbackUnit = WORK_UNIT_DEFINITIONS[0];

const pickWorkUnitId = (text: string) => {
  if (text.includes('교지') || text.includes('교사관리')) return 'education-facility-status';
  if (text.includes('임대시설') || text.includes('대관')) return 'rental-fee-billing';
  if (text.includes('기술지원')) return 'lab-equipment-maintenance';
  if (text.includes('연구실') || text.includes('안전관리')) return 'laboratory-safety';
  if (text.includes('소방')) return 'fire-safety';
  if (text.includes('전기') || text.includes('배전') || text.includes('차단기')) return 'electric-safety';
  if (text.includes('기자재') || text.includes('멀티미디어') || text.includes('케이블')) return 'lab-equipment-maintenance';
  if (text.includes('자산') || text.includes('비품') || text.includes('물품')) return 'campus-asset-work';
  if (text.includes('공사') || text.includes('환경개선') || text.includes('방수')) return 'environment-improvement';
  if (text.includes('조경') || text.includes('배수')) return 'landscape-management';
  return 'facility-maintenance';
};

const resolveUnit = (unitId: string): WorkUnitDefinition =>
  getWorkUnitById(unitId) ?? fallbackUnit;

const buildEntry = (
  base: Omit<WorkLedgerEntry, 'category' | 'unitName' | 'annualHours'>,
): WorkLedgerEntry => {
  const unit = resolveUnit(base.unitId);
  return {
    ...base,
    category: unit.category,
    unitName: unit.name,
    annualHours: unit.annualHours,
  };
};

const taskToEntry = (task: Task): WorkLedgerEntry =>
  buildEntry({
    id: `task-${task.id}`,
    source: '업무지정',
    sourceId: task.id,
    date: task.completedAt || task.createdAt,
    title: task.title,
    unitId: pickWorkUnitId(`${task.title} ${task.category} ${task.description} ${task.location}`),
    status: getTaskStatusLabel(task),
    description: task.completionReport || task.description,
    evidence: task.completionPhotoUrl || task.photoUrl || '업무지정 이력',
    facilityName: task.location,
    location: task.location,
    assignee: task.assignee,
    createdAt: task.createdAt,
  });

const formatLogFeedback = (log: DailyLog) => {
  if (log.managerFeedbackList.length === 0) return '팀장 피드백 없음';
  return `팀장 피드백: ${log.managerFeedbackList
    .map((feedback) => `${feedback.senderName} - ${feedback.content}`)
    .join(' / ')}`;
};

const dailyLogToEntry = (log: DailyLog): WorkLedgerEntry => {
  const workType = log.workType || DEFAULT_DAILY_LOG_WORK_TYPE;

  return buildEntry({
    id: `daily-log-${log.id}`,
    source: 'Self-Managed Work Logs',
    sourceId: log.id,
    date: log.eveningSubmittedAt || log.morningSubmittedAt || `${log.date}T00:00:00`,
    title: `${log.employeeName} ${workType} 근무일지`,
    unitId: pickWorkUnitId(`${workType} ${log.morningPlan} ${log.eveningResult} ${log.remarks || ''}`),
    status: log.eveningResult ? log.eveningStatus : '오늘 할 일 작성',
    description: [
      `업무구분: ${workType}`,
      `오늘 할 일: ${log.morningPlan || '미작성'}`,
      `결과: ${log.eveningResult || '미작성'}`,
      log.remarks ? `비고: ${log.remarks}` : '',
      formatLogFeedback(log),
    ].filter(Boolean).join('\n'),
    evidence: 'Self-Managed Work Logs',
    assignee: log.employeeName,
    createdAt: log.morningSubmittedAt || log.eveningSubmittedAt || `${log.date}T00:00:00`,
  });
};

export const buildWorkLedgerEntries = (sources: WorkLedgerSources): WorkLedgerEntry[] =>
  [
    ...sources.tasks.map(taskToEntry),
    ...sources.dailyLogs.map(dailyLogToEntry),
  ].sort((first, second) => new Date(second.date).getTime() - new Date(first.date).getTime());
