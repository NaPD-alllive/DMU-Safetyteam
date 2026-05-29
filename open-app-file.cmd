@echo off
setlocal
cd /d "%~dp0"

if not exist dist\index.html (
  echo ERROR: App files are missing.
  echo Please ask Codex to build the app again.
  pause
  exit /b 1
)

echo Opening the app without localhost.
echo.
echo This mode works on this computer even when localhost is not running.
echo Team sharing still requires start-team-share.cmd.
echo.
start "" "%~dp0dist\index.html"
exit /b 0
