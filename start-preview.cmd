@echo off
setlocal
cd /d "%~dp0"

set "NODE_EXE=node"
where node >nul 2>nul
if errorlevel 1 (
  set "NODE_EXE=%USERPROFILE%\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe"
)

if not "%NODE_EXE%"=="node" (
  if not exist "%NODE_EXE%" (
    echo ERROR: Node.js could not be found.
    echo Please tell Codex this message is shown.
    pause
    exit /b 1
  )
)

if not exist dist\index.html (
  echo ERROR: App build files are missing.
  echo Please ask Codex to run the build once.
  pause
  exit /b 1
)

echo.
echo App URL: http://localhost:4173/
echo.
echo IMPORTANT:
echo - Keep this window open while using the app.
echo - If this window is closed, http://localhost:4173/ will stop working.
echo - The browser opens after the server is ready.
echo.
echo.
echo Starting local server.
set FACILITY_OPEN_BROWSER=1
"%NODE_EXE%" server.cjs
echo.
echo Server stopped. Close this window or run this file again to restart.
echo If localhost does not open, run open-app-file.cmd in this folder.
pause
