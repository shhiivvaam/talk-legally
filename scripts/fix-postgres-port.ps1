# Script to fix PostgreSQL port conflict
# Changes Docker PostgreSQL to use port 5433 instead of 5432

Write-Host "Fixing PostgreSQL port conflict..." -ForegroundColor Yellow

$dockerComposeFile = "docker/docker-compose.yml"

if (Test-Path $dockerComposeFile) {
    $content = Get-Content $dockerComposeFile -Raw
    $content = $content -replace '5432:5432', '5433:5432'
    Set-Content $dockerComposeFile -Value $content
    Write-Host "✓ Updated docker-compose.yml to use port 5433" -ForegroundColor Green
    Write-Host "⚠ Remember to update all .env files: DB_PORT=5433" -ForegroundColor Yellow
} else {
    Write-Host "✗ docker-compose.yml not found" -ForegroundColor Red
}
