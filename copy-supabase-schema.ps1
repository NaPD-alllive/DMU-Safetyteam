$ErrorActionPreference = "Stop"

Set-Location -LiteralPath $PSScriptRoot

$schemaPath = Join-Path $PSScriptRoot "supabase\facility-app-state-schema.sql"

if (-not (Test-Path -LiteralPath $schemaPath)) {
  throw "Schema file not found: $schemaPath"
}

$schema = Get-Content -LiteralPath $schemaPath -Raw -Encoding UTF8
Set-Clipboard -Value $schema

Write-Host "Supabase schema copied to clipboard."
Write-Host "Paste it into Supabase SQL Editor and click Run."
