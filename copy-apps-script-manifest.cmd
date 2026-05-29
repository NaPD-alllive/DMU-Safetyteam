@echo off
setlocal
title Copy Apps Script appsscript.json
cd /d "%~dp0"

set "MANIFEST_FILE=%~dp0apps-script\appsscript.json"

echo.
echo Copying Apps Script appsscript.json content to clipboard...
echo Source: %MANIFEST_FILE%
echo.

if not exist "%MANIFEST_FILE%" (
  echo ERROR: Apps Script manifest file was not found.
  pause
  exit /b 1
)

powershell.exe -NoLogo -NoProfile -ExecutionPolicy Bypass -Command "$path = $env:MANIFEST_FILE; Set-Clipboard -Value ([System.IO.File]::ReadAllText($path, [System.Text.Encoding]::UTF8))"
if errorlevel 1 (
  echo ERROR: Clipboard copy failed.
  pause
  exit /b 1
)

echo.
echo DONE: appsscript.json content has been copied to the clipboard.
echo Open Google Apps Script appsscript.json and press Ctrl+V.
echo.
pause
