@echo off
setlocal
title Copy Apps Script Code.gs
cd /d "%~dp0"

set "SCRIPT_FILE=%~dp0apps-script\facility-calendar-webhook.gs"

echo.
echo Copying Apps Script Code.gs content to clipboard...
echo Source: %SCRIPT_FILE%
echo.

if not exist "%SCRIPT_FILE%" (
  echo ERROR: Apps Script code file was not found.
  pause
  exit /b 1
)

powershell.exe -NoLogo -NoProfile -ExecutionPolicy Bypass -Command "$path = $env:SCRIPT_FILE; Set-Clipboard -Value ([System.IO.File]::ReadAllText($path, [System.Text.Encoding]::UTF8))"
if errorlevel 1 (
  echo ERROR: Clipboard copy failed.
  pause
  exit /b 1
)

echo.
echo DONE: Code.gs content has been copied to the clipboard.
echo Open Google Apps Script Code.gs and press Ctrl+V.
echo.
pause
