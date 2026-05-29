$path = Join-Path $PSScriptRoot 'apps-script\facility-calendar-webhook.gs'

if (!(Test-Path -LiteralPath $path)) {
  Write-Host 'ERROR: apps-script\facility-calendar-webhook.gs was not found.'
  Read-Host 'Press Enter to close'
  exit 1
}

Set-Clipboard -Value ([System.IO.File]::ReadAllText($path, [System.Text.Encoding]::UTF8))
Write-Host 'DONE: Code.gs content has been copied to the clipboard.'
Write-Host 'Open Google Apps Script Code.gs and press Ctrl+V.'
Read-Host 'Press Enter to close'
