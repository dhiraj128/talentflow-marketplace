# TalentFlow Safe Disaster Recovery Restore & Verification Script
# Restores backup strictly into an isolated non-production DR database target.

param (
    [string]$TargetDbUrl = $env:DATABASE_URL_DR
)

$ErrorActionPreference = "Stop"

Write-Host "================================================================" -ForegroundColor Cyan
Write-Host "TALENTFLOW DISASTER RECOVERY RESTORE & VERIFICATION" -ForegroundColor Cyan
Write-Host "================================================================" -ForegroundColor Cyan

$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path

if (-not $TargetDbUrl) {
    Write-Host "ERROR: Target DR Database URL is required." -ForegroundColor Red
    Write-Host "Usage: .\scripts\verify-restore.ps1 -TargetDbUrl 'postgresql://<user>:<pass>@<dr-host>/<dr-db>'" -ForegroundColor Yellow
    Write-Host "Or set environment variable `$env:DATABASE_URL_DR" -ForegroundColor Yellow
    exit 1
}

# Production Safety Assertion
$LowerTarget = $TargetDbUrl.ToLower()
if ($LowerTarget -like "*onrender.com*" -or $LowerTarget -like "*sispl.shop*" -or $LowerTarget -like "*dpg-*") {
    Write-Host "================================================================" -ForegroundColor Red
    Write-Host "FATAL SAFETY VIOLATION: PRODUCTION RESTORE TARGET BLOCKED!" -ForegroundColor Red
    Write-Host "================================================================" -ForegroundColor Red
    Write-Host "The specified URL is a production database target." -ForegroundColor Red
    Write-Host "Restoring into production PostgreSQL is strictly forbidden." -ForegroundColor Red
    exit 1
}

$env:DATABASE_URL_DR = $TargetDbUrl
node "$ScriptDir\restore-pg.js" "$TargetDbUrl"

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "Disaster Recovery verification script completed successfully!" -ForegroundColor Green
} else {
    Write-Host ""
    Write-Host "Disaster Recovery verification script failed with exit code $LASTEXITCODE" -ForegroundColor Red
    exit $LASTEXITCODE
}
