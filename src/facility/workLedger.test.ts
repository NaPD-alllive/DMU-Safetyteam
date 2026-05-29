import { buildWorkLedgerEntries } from './workLedger';
import { buildWorkLedgerCsv } from './workLedgerCsv';
import type { DailyLog, Task } from '../types';

const assert = (condition: boolean, message: string) => {
  if (!condition) throw new Error(message);
};

const tasks: Task[] = [
  {
    id: 'task_1',
    title: '연구실 안전관리 점검',
    category: '안전관리(연구실 안전포함)',
    description: '화학물질 보관함 점검',
    status: '완료',
    priority: '긴급',
    location: '8호관 연구실',
    assignee: '박성훈',
    createdAt: '2026-05-20T09:00:00Z',
    completedAt: '2026-05-21T09:00:00Z',
    comments: [],
    history: [],
  },
];

const dailyLogs: DailyLog[] = [
  {
    id: 'log_1',
    date: '2026-05-23',
    employeeId: 'user_lee',
    employeeName: '이인혁',
    employeeRole: '과장',
    morningPlan: '전기 기계동 전력 제어반 3호 릴레이 점검',
    morningSubmittedAt: '2026-05-23T08:10:00Z',
    eveningResult: '릴레이 2개 교체 완료 및 전압 확인',
    eveningStatus: '완료',
    eveningSubmittedAt: '2026-05-23T17:40:00Z',
    managerFeedbackList: [
      {
        id: 'feedback_1',
        senderName: '나형석',
        senderRole: '팀장',
        content: '점검 이력 전산 대장 확인',
        timestamp: '2026-05-23T18:00:00Z',
      },
    ],
  },
];

const entries = buildWorkLedgerEntries({
  tasks,
  dailyLogs,
});

assert(entries.length === 2, 'ledger should include task and self-managed work log records');
assert(entries.some((entry) => entry.source === '업무지정'), 'task should create assignment entry');
assert(entries.some((entry) => entry.source === 'Self-Managed Work Logs'), 'daily log should create self-managed entry');
assert(entries.some((entry) => entry.description.includes('오늘 할 일')), 'daily log entry should summarize to-do text');
assert(entries.some((entry) => entry.description.includes('팀장 피드백')), 'daily log entry should include manager feedback');

const csv = buildWorkLedgerCsv(entries);

assert(csv.startsWith('"발생일","출처","업무분류"'), 'csv should include Korean headers');
const removedWorkflowColumn = ['P', 'D', 'C', 'A'].join('');
assert(!csv.includes(removedWorkflowColumn), 'csv should not include removed workflow column');
assert(csv.includes('"Self-Managed Work Logs"'), 'csv should include self-managed source label');
assert(csv.includes('"연구실안전관리"'), 'csv should include unit name');

console.log('work ledger tests passed');
