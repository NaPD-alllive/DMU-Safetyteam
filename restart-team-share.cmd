@echo off
setlocal
cd /d "%~dp0"
title Facility Team Share Server - DO NOT CLOSE

echo.
echo ============================================================
echo  Facility Management Team Share Server
echo ============================================================
echo.
echo This window runs the team share server.
echo Do not close this window while teammates use the app.
echo.
echo Open this address after this window says "server is running":
echo   http://localhost:4174/
echo.
echo Before starting, this script closes any old server still using port 4174.
echo.
echo Team shared data file:
echo   I:\facility-team-share\facility-state.json
echo.
echo If the browser says "refused to connect", this window is not running.
echo.

powershell -NoProfile -ExecutionPolicy Bypass -Command "$ids = @(Get-NetTCPConnection -LocalPort 4174 -State Listen -ErrorAction SilentlyContinue | Select-Object -ExpandProperty OwningProcess -Unique); foreach ($id in $ids) { if ($id) { Stop-Process -Id $id -Force -ErrorAction SilentlyContinue } }"
timeout /t 1 /nobreak >nul

call "%~dp0start-team-share-I-drive.cmd"

echo.
echo The server command ended.
echo If this was not intended, tell Codex the message shown above.
pause
