# PowerShell script to start all services
# Run: .\scripts\start-all.ps1

Write-Host "Starting Talk Legally Platform..." -ForegroundColor Green

# Check if Docker is running
$dockerRunning = docker ps 2>&1
if ($LASTEXITCODE -ne 0) {
    Write-Host "Docker is not running. Please start Docker Desktop first." -ForegroundColor Red
    exit 1
}

# Start databases
Write-Host "Starting databases..." -ForegroundColor Yellow
Set-Location docker
docker-compose up -d
Set-Location ..

# Wait for databases to be ready
Write-Host "Waiting for databases to be ready..." -ForegroundColor Yellow
Start-Sleep -Seconds 10

# Check if databases are running
$postgres = docker ps --filter "name=talk-legally-postgres" --format "{{.Names}}"
$mongodb = docker ps --filter "name=talk-legally-mongodb" --format "{{.Names}}"
$redis = docker ps --filter "name=talk-legally-redis" --format "{{.Names}}"

if ($postgres -and $mongodb -and $redis) {
    Write-Host "All databases are running!" -ForegroundColor Green
} else {
    Write-Host "Some databases failed to start. Check docker-compose logs." -ForegroundColor Red
    exit 1
}

Write-Host "`nTo start services, open separate terminals and run:" -ForegroundColor Cyan
Write-Host "1. cd backend/services/auth-service && npm run start:dev" -ForegroundColor White
Write-Host "2. cd backend/services/user-service && npm run start:dev" -ForegroundColor White
Write-Host "3. cd backend/services/lawyer-service && npm run start:dev" -ForegroundColor White
Write-Host "4. cd backend/services/wallet-service && npm run start:dev" -ForegroundColor White
Write-Host "5. cd backend/services/payment-service && npm run start:dev" -ForegroundColor White
Write-Host "6. cd backend/services/session-service && npm run start:dev" -ForegroundColor White
Write-Host "7. cd backend/services/chat-service && npm run start:dev" -ForegroundColor White
Write-Host "8. cd backend/services/notification-service && npm run start:dev" -ForegroundColor White
Write-Host "9. cd backend/services/admin-service && npm run start:dev" -ForegroundColor White
Write-Host "10. cd backend/api-gateway && npm run start:dev" -ForegroundColor White
Write-Host "11. cd admin-panel && npm run dev" -ForegroundColor White
Write-Host "12. cd mobile && npm start" -ForegroundColor White
