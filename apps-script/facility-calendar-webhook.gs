const FACILITY_SHARED_CALENDAR_ID = 'c_04b42241eb38f7f266a3bb553557a109b5ec69bdf42888d195c106f7de81f36c@group.calendar.google.com';
const TIME_ZONE = 'Asia/Seoul';

function doGet() {
  try {
    const calendar = CalendarApp.getCalendarById(FACILITY_SHARED_CALENDAR_ID);
    const hasSecret = Boolean(PropertiesService.getScriptProperties().getProperty('WEBHOOK_SECRET'));

    return jsonResponse({
      ok: Boolean(calendar),
      service: 'DMU facility calendar webhook',
      calendarId: FACILITY_SHARED_CALENDAR_ID,
      calendarAccess: Boolean(calendar),
      webhookSecretRequired: hasSecret,
      message: calendar
        ? '시설관리팀 공유캘린더 접근이 확인되었습니다.'
        : '시설관리팀 공유캘린더를 찾을 수 없습니다. 실행 계정 권한을 확인해 주세요.',
    });
  } catch (error) {
    return jsonResponse({
      ok: false,
      service: 'DMU facility calendar webhook',
      calendarId: FACILITY_SHARED_CALENDAR_ID,
      calendarAccess: false,
      error: String(error && error.message ? error.message : error),
    });
  }
}

function doPost(e) {
  try {
    const payload = JSON.parse((e.postData && e.postData.contents) || '{}');
    validateSecret_(payload.secret || '');

    const task = payload.task;
    if (!task || !task.id || !task.title) {
      throw new Error('작업지시 데이터가 없습니다.');
    }

    const calendar = CalendarApp.getCalendarById(FACILITY_SHARED_CALENDAR_ID);
    if (!calendar) {
      throw new Error('시설관리팀 공유캘린더를 찾을 수 없습니다. 이 스크립트 실행 계정의 캘린더 권한을 확인해 주세요.');
    }

    const startTime = new Date(task.createdAt || new Date());
    const endTime = new Date(startTime.getTime() + 60 * 60 * 1000);
    const existingEvent = findExistingEvent_(calendar, task.id, startTime, endTime);

    if (existingEvent) {
      return jsonResponse({
        ok: true,
        duplicate: true,
        eventId: existingEvent.getId(),
      });
    }

    const event = calendar.createEvent(
      `[시설관리] ${task.title} (${task.category || '업무'})`,
      startTime,
      endTime,
      {
        location: task.location || '',
        description: buildDescription_(task),
      }
    );

    setEventColor_(event, task.priority);

    return jsonResponse({
      ok: true,
      eventId: event.getId(),
    });
  } catch (error) {
    return jsonResponse({
      ok: false,
      error: String(error && error.message ? error.message : error),
    });
  }
}

function validateSecret_(incomingSecret) {
  const savedSecret = PropertiesService.getScriptProperties().getProperty('WEBHOOK_SECRET') || '';
  if (savedSecret && incomingSecret !== savedSecret) {
    throw new Error('연동 키가 일치하지 않습니다.');
  }
}

function findExistingEvent_(calendar, taskId, startTime, endTime) {
  const from = new Date(startTime.getTime() - 24 * 60 * 60 * 1000);
  const to = new Date(endTime.getTime() + 24 * 60 * 60 * 1000);
  const events = calendar.getEvents(from, to, { search: taskId });
  return events.length > 0 ? events[0] : null;
}

function buildDescription_(task) {
  const comments = Array.isArray(task.comments) && task.comments.length > 0
    ? '\n\n■ 현장 의견\n' + task.comments.map(function(comment) {
        return '- [' + (comment.senderRole || '') + '] ' + (comment.senderName || '') + ': ' + (comment.content || '');
      }).join('\n')
    : '';

  return [
    '* DMU 시설관리팀 스마트 업무 지시서',
    '',
    '- 작업 ID: ' + task.id,
    '- 분야: ' + (task.category || ''),
    '- 위치: ' + (task.location || ''),
    '- 담당자: ' + (task.assignee || ''),
    '- 우선순위: ' + (task.priority || ''),
    '- 상태: ' + (task.status || ''),
    '- 발행일: ' + formatDate_(task.createdAt),
    '',
    '■ 작업 설명',
    task.description || '',
    task.completionReport ? '\n■ 완료 보고\n' + task.completionReport : '',
    comments,
  ].join('\n');
}

function setEventColor_(event, priority) {
  if (priority === '긴급') {
    event.setColor(CalendarApp.EventColor.RED);
    return;
  }

  if (priority === '보통') {
    event.setColor(CalendarApp.EventColor.YELLOW);
    return;
  }

  event.setColor(CalendarApp.EventColor.BLUE);
}

function formatDate_(value) {
  if (!value) return '';
  return Utilities.formatDate(new Date(value), TIME_ZONE, 'yyyy-MM-dd HH:mm');
}

function jsonResponse(payload) {
  return ContentService
    .createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}
