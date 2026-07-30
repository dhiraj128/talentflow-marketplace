# Safe Production Prisma Studio Launcher
# Refuses to run unless $env:DATABASE_URL is explicitly set to a production database URL.

if (-not $env:DATABASE_URL -or $env:DATABASE_URL -like "*localhost:5433*") {
    Write-Host "================================================================" -ForegroundColor Yellow
    Write-Host "ERROR: DATABASE_URL is not set to a production database." -ForegroundColor Red
    Write-Host "================================================================" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "To inspect production with Prisma Studio, set DATABASE_URL first:" -ForegroundColor Cyan
    Write-Host '  $env:DATABASE_URL="postgresql://<user>:<password>@<render-host>/<db>?sslmode=require"' -ForegroundColor White
    Write-Host "  npx prisma studio" -ForegroundColor White
    Write-Host ""
    Write-Host "DO NOT hardcode credentials into scripts or commit them to Git." -ForegroundColor Yellow
    exit 1
}

Write-Host "Starting Prisma Studio with production DATABASE_URL environment variable..." -ForegroundColor Green
Set-Location -Path "$PSScriptRoot/../talentflow-backend"
npx prisma studio
