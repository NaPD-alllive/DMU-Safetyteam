$ErrorActionPreference = "Stop"

Set-Location -LiteralPath $PSScriptRoot

$repoUrl = "https://github.com/safety-lang/DMU-Safetyteam.git"

function Write-Step($message) {
  Write-Host ""
  Write-Host "== $message =="
}

function Run-Git($arguments, $failureMessage) {
  & git @arguments
  if ($LASTEXITCODE -ne 0) {
    throw $failureMessage
  }
}

function Test-ValidGitRepository {
  $oldErrorActionPreference = $ErrorActionPreference
  $ErrorActionPreference = "Continue"
  try {
    & git rev-parse --is-inside-work-tree > $null 2> $null
    return $LASTEXITCODE -eq 0
  } finally {
    $ErrorActionPreference = $oldErrorActionPreference
  }
}

function Test-GitRemoteOrigin {
  $oldErrorActionPreference = $ErrorActionPreference
  $ErrorActionPreference = "Continue"
  try {
    & git remote get-url origin > $null 2> $null
    return $LASTEXITCODE -eq 0
  } finally {
    $ErrorActionPreference = $oldErrorActionPreference
  }
}

function Test-StagedChanges {
  $oldErrorActionPreference = $ErrorActionPreference
  $ErrorActionPreference = "Continue"
  try {
    & git diff --cached --quiet > $null 2> $null
    return $LASTEXITCODE -ne 0
  } finally {
    $ErrorActionPreference = $oldErrorActionPreference
  }
}

Write-Host "========================================"
Write-Host "DMU Facility App - GitHub Upload"
Write-Host "========================================"
Write-Host "Repository: $repoUrl"
Write-Host "Project folder: $PWD"
Write-Host ""

if (-not (Get-Command git -ErrorAction SilentlyContinue)) {
  throw "Git is not installed. Install Git for Windows: https://git-scm.com/download/win"
}

$safeDirectory = $PWD.ProviderPath.Replace("\", "/")
& git config --global --add safe.directory "$safeDirectory" > $null 2> $null

if (-not (Test-ValidGitRepository)) {
  Write-Step "Creating clean local git setup"

  $dotGitPath = Join-Path $PWD ".git"
  if (Test-Path -LiteralPath $dotGitPath) {
    $backupName = ".git-broken-$(Get-Date -Format 'yyyyMMddHHmmss')"
    $backupPath = Join-Path $PWD $backupName

    try {
      attrib -h -s "$dotGitPath" 2>$null
      Rename-Item -LiteralPath $dotGitPath -NewName $backupName -Force
      Write-Host "Old git setup moved to: $backupName"
    } catch {
      Write-Host "Could not rename old git setup. Removing invalid local git setup..."
      Remove-Item -LiteralPath $dotGitPath -Recurse -Force
      if (Test-Path -LiteralPath $backupPath) {
        Remove-Item -LiteralPath $backupPath -Recurse -Force
      }
    }
  }

  Run-Git @("init") "Failed to create local git repository."
}

if (-not (Test-ValidGitRepository)) {
  throw "This folder is still not recognized as a git repository."
}

Write-Step "Setting git user"
Run-Git @("config", "--local", "user.name", "DMU Facility Team") "Failed to set git user name."
Run-Git @("config", "--local", "user.email", "facility-team@dongyang.ac.kr") "Failed to set git user email."

Write-Step "Setting GitHub remote"
if (Test-GitRemoteOrigin) {
  Run-Git @("remote", "set-url", "origin", $repoUrl) "Failed to update GitHub remote."
} else {
  Run-Git @("remote", "add", "origin", $repoUrl) "Failed to add GitHub remote."
}

Write-Step "Setting main branch"
Run-Git @("branch", "-M", "main") "Failed to set main branch."

Write-Step "Adding project files"
Run-Git @("add", ".") "Failed to add project files."

Write-Step "Creating commit"
if (Test-StagedChanges) {
  Run-Git @("commit", "-m", "Upload facility management system") "Failed to create commit."
} else {
  Write-Host "No new files to commit."
}

Write-Step "Uploading to GitHub"
Write-Host "If a browser sign-in window opens, approve GitHub access."
Run-Git @("push", "-u", "origin", "main") "GitHub upload failed. Check sign-in and repository write permission."

Write-Host ""
Write-Host "DONE."
Write-Host "Open and refresh:"
Write-Host "https://github.com/safety-lang/DMU-Safetyteam"
