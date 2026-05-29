$path = Join-Path $PSScriptRoot 'apps-script\appsscript.json'

if (!(Test-Path -LiteralPath $path)) {
  Write-Host 'ERROR: apps-script\appsscript.json was not found.'
  Read-Host 'Press Enter to close'
  exit 1
}

Set-Clipboard -Value ([System.IO.File]::ReadAllText($path, [System.Text.Encoding]::UTF8))
Write-Host 'DONE: appsscript.json content has been copied to the clipboard.'
Write-Host 'Open Google Apps Script appsscript.json and press Ctrl+V.'
Read-Host 'Press Enter to close'
