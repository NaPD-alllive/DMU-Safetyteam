# 시설관리팀 공유캘린더 Apps Script 연동

이 방식은 앱 사용자가 Google 로그인을 하지 않습니다. Apps Script 웹앱이 공유캘린더 권한을 가진 계정으로 실행되어 작업지시 일정을 대신 등록합니다.

## 준비된 파일

- `facility-calendar-webhook.gs`: 공유캘린더에 작업지시 일정을 등록하는 Apps Script 코드
- `appsscript.json`: Apps Script 권한 범위를 명시하는 manifest 파일

## 배포 순서 상세

1. Google Apps Script에서 새 프로젝트를 만듭니다.
2. 이 프로젝트 폴더의 `copy-apps-script-code.cmd`를 두 번 클릭합니다.
3. 기본 `Code.gs` 파일을 열고, 클립보드에 복사된 내용을 붙여넣습니다.
4. 이 프로젝트 폴더의 `copy-apps-script-manifest.cmd`를 두 번 클릭합니다.
5. 왼쪽의 프로젝트 설정에서 `appsscript.json` manifest 표시를 켭니다.
6. `appsscript.json` 파일을 열고, 클립보드에 복사된 내용으로 교체합니다.
7. 선택 사항: 프로젝트 설정의 스크립트 속성에 `WEBHOOK_SECRET` 값을 추가합니다.
8. 상단의 실행 또는 저장을 눌러 프로젝트를 저장합니다.
9. 배포 > 새 배포를 선택합니다.
10. 배포 유형에서 `웹 앱`을 선택합니다.
11. 실행 계정은 공유캘린더 변경 권한이 있는 본인 계정으로 설정합니다.
12. 액세스 권한은 내부 사용 환경에 맞게 설정합니다. 로컬 앱에서 바로 보내려면 `모든 사용자`가 가장 단순합니다.
13. 배포를 누르고 Google 권한 승인 화면에서 Calendar 권한을 허용합니다.
14. 배포 후 생성된 `/exec` URL을 앱의 `Apps Script 웹앱 URL` 입력칸에 저장합니다.
15. 7번에서 연동 키를 설정했다면 앱의 `연동 키` 입력칸에도 같은 값을 넣습니다.

웹앱 URL은 `https://script.google.com/macros/s/.../exec` 형식이어야 합니다.

## 테스트 방법

1. 앱에서 `Apps Script 웹앱 URL`을 저장합니다.
2. 작업지시 하나를 선택합니다.
3. 상세 화면의 `공유캘린더` 영역에서 `일정 전송`을 누릅니다.
4. `웹앱 확인`을 눌러 새 창에 `ok: true`와 `calendarAccess: true`가 함께 보이는지 확인합니다.
5. Google Calendar의 시설관리팀 공유캘린더에 `[시설관리]` 일정이 생겼는지 확인합니다.

## 자주 막히는 지점

- 배포 URL이 `/dev`로 끝나면 앱에서 거부됩니다. 반드시 `/exec` URL을 사용해야 합니다.
- Apps Script 실행 계정이 공유캘린더에 `변경 및 공유 관리` 또는 `소유자` 권한을 가져야 합니다.
- `웹앱 확인`에서 `calendarAccess: false`가 보이면 Apps Script 실행 계정이 공유캘린더를 찾지 못한 상태입니다.
- `WEBHOOK_SECRET`을 설정했다면 앱의 `연동 키`와 값이 정확히 같아야 합니다.
- 배포 후 코드를 수정했다면 새 버전으로 다시 배포해야 실제 `/exec` URL에 반영됩니다.
