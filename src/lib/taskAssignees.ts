export const splitTaskAssignees = (assignee: string) =>
  assignee
    .split(',')
    .map((name) => name.trim())
    .filter(Boolean);

export const taskIncludesAssignee = (assignee: string, userName: string) =>
  splitTaskAssignees(assignee).includes(userName);

export const formatTaskAssigneeLabel = (assignee: string) =>
  splitTaskAssignees(assignee).join(', ') || '미지정';
