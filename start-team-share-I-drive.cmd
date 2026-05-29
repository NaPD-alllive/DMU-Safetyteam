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

set "FACILITY_DATA_DIR=I:\facility-team-share"

echo.
echo Facility team share server with I drive storage
echo.
echo Open on this computer:
echo   http://localhost:4174/
echo.
echo Smartphone / team share URLs:
powershell -NoProfile -ExecutionPolicy Bypass -Command "$addresses = [System.Net.Dns]::GetHostAddresses($env:COMPUTERNAME); $recommended = @(); $other = @(); foreach ($address in $addresses) { if ($address.AddressFamily -eq 'InterNetwork' -and $address.IPAddressToString -notlike '127.*') { $ip = $address.IPAddressToString; $p = $ip.Split('.'); $isPrivate = $p[0] -eq '10' -or ($p[0] -eq '172' -and [int]$p[1] -ge 16 -and [int]$p[1] -le 31) -or ($p[0] -eq '192' -and $p[1] -eq '168'); $url = '  http://' + $ip + ':4174/'; if ($isPrivate) { $recommended += $url } else { $other += $url } } }; if ($recommended.Count -gt 0) { 'Recommended phone URLs:'; $recommended } else { 'No same-Wi-Fi private address was found.'; 'Use a phone hotspot, same Wi-Fi, or ask network/admin to allow access.' }; if ($other.Count -gt 0) { ''; 'Other addresses - may be blocked by school/campus network:'; $other }"
echo.
echo Smartphone use:
echo   1. Keep this server window open.
echo   2. Connect the phone to the same Wi-Fi as this computer.
echo   3. Open a Recommended phone URL above on the phone.
echo   4. If Windows Firewall asks, allow access on private networks.
echo.
echo Shared work data is stored at:
echo   I:\facility-team-share\facility-state.json
echo.
echo Keep this window open while teammates use the app.
echo.

if not exist "%FACILITY_DATA_DIR%\" (
  mkdir "%FACILITY_DATA_DIR%" >nul 2>nul
  if errorlevel 1 (
    echo WARNING: Could not create %FACILITY_DATA_DIR%.
    echo Please check whether I drive is connected and writable.
    echo.
  )
)

if exist "I:\facility-state.json" (
  if not exist "%FACILITY_DATA_DIR%\facility-state.json" (
    echo Moving existing I drive shared data into the team share folder.
    copy /Y "I:\facility-state.json" "%FACILITY_DATA_DIR%\facility-state.json" >nul
    if errorlevel 1 (
      echo WARNING: Existing I drive data could not be copied.
    )
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

set "PORT=4174"
set "FACILITY_OPEN_BROWSER=0"
"%NODE_EXE%" server.cjs

echo.
echo Server stopped. Close this window or run this file again to restart.
pause
