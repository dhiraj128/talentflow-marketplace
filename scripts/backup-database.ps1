# TalentFlow Safe Production PostgreSQL Backup Script
# Reads $env:DATABASE_URL or talentflow-backend/.env
# Generates a timestamped .sql backup file in backups/ directory.

$ErrorActionPreference = "Stop"

Write-Host "================================================================" -ForegroundColor Cyan
Write-Host "TALENTFLOW PRODUCTION POSTGRESQL BACKUP" -ForegroundColor Cyan
Write-Host "================================================================" -ForegroundColor Cyan

$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$ProjectRoot = Split-Path -Parent $ScriptDir
$BackendEnv = Join-Path $ProjectRoot "talentflow-backend\.env"

if (-not $env:DATABASE_URL -and (Test-Path $BackendEnv)) {
    Get-Content $BackendEnv | ForEach-Object {
        if ($_ -match '^\s*DATABASE_URL\s*=\s*"(.*)"\s*$') {
            $env:DATABASE_URL = $matches[1]
        } elseif ($_ -match '^\s*DATABASE_URL\s*=\s*(.*)\s*$') {
            $env:DATABASE_URL = $matches[1]
        }
    }
}

if (-not $env:DATABASE_URL) {
    Write-Host "ERROR: DATABASE_URL environment variable is not set." -ForegroundColor Red
    Write-Host "Please set `$env:DATABASE_URL or configure talentflow-backend/.env" -ForegroundColor Yellow
    exit 1
}

$MaskedUrl = $env:DATABASE_URL -replace '://([^:]+):([^@]+)@', '://[REDACTED_USER]:[REDACTED_PASS]@'
Write-Host "Source Database Target: $MaskedUrl" -ForegroundColor White

$BackupsDir = Join-Path $ProjectRoot "backups"
if (-not (Test-Path $BackupsDir)) {
    New-Item -ItemType Directory -Path $BackupsDir | Out-Null
}

$Timestamp = Get-Date -Format "yyyy-MM-dd_HH-mm-ss"
$OutputFile = Join-Path $BackupsDir "talentflow-backup-$Timestamp.sql"

Write-Host "Output File Target:    $OutputFile" -ForegroundColor White
Write-Host ""
Write-Host "Executing pg_dump export..." -ForegroundColor Yellow

node "$ScriptDir\backup-pg.js"

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "Backup script completed successfully!" -ForegroundColor Green
} else {
    Write-Host ""
    Write-Host "Backup script failed with exit code $LASTEXITCODE" -ForegroundColor Red
    exit $LASTEXITCODE
}
