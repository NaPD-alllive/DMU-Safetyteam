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
echo Open on this computer:
echo   http://localhost:4173/
echo.
echo Candidate team share URLs:
powershell -NoProfile -ExecutionPolicy Bypass -Command "$addresses = [System.Net.Dns]::GetHostAddresses($env:COMPUTERNAME); foreach ($address in $addresses) { if ($address.AddressFamily -eq 'InterNetwork' -and $address.IPAddressToString -notlike '127.*') { '  http://' + $address.IPAddressToString + ':4173/' } }"
echo.
echo Notes:
echo - Give a working candidate URL above to teammates on the same network.
echo - If Windows Firewall asks, allow access.
echo - Keep this window open while teammates use the app.
echo - If this window is closed, http://localhost:4173/ and team share URLs will stop working.
echo - Shared work data is stored at I:\facility-team-share\facility-state.json.
echo - The browser opens after the server is ready.
echo.

echo.
echo Starting shared server.
set "FACILITY_DATA_DIR=I:\facility-team-share"
if not exist "%FACILITY_DATA_DIR%\" (
  mkdir "%FACILITY_DATA_DIR%" >nul 2>nul
  if errorlevel 1 (
    echo WARNING: Could not create %FACILITY_DATA_DIR%.
    echo Please check whether I drive is connected and writable.
    echo.
  )
)
if exist "data\facility-state.json" (
  if not exist "%FACILITY_DATA_DIR%\facility-state.json" (
    echo Copying existing shared data to %FACILITY_DATA_DIR%\facility-state.json
    copy /Y "data\facility-state.json" "%FACILITY_DATA_DIR%\facility-state.json" >nul
    if errorlevel 1 (
      echo WARNING: Existing data could not be copied to I drive.
      echo After the app opens, press the current data server save button once.
    )
    echo.
  )
)
set FACILITY_OPEN_BROWSER=1
"%NODE_EXE%" server.cjs
echo.
echo Server stopped. Close this window or run this file again to restart.
echo If localhost does not open, run open-app-file.cmd in this folder.
pause
