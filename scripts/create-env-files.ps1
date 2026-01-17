# Script to create .env files from .env.example
# Run: .\scripts\create-env-files.ps1

Write-Host "Creating .env files from .env.example..." -ForegroundColor Green

$services = @(
    "backend/api-gateway",
    "backend/services/auth-service",
    "backend/services/user-service",
    "backend/services/lawyer-service",
    "backend/services/wallet-service",
    "backend/services/payment-service",
    "backend/services/session-service",
    "backend/services/chat-service",
    "backend/services/notification-service",
    "backend/services/admin-service",
    "admin-panel",
    "mobile"
)

foreach ($service in $services) {
    $envExample = Join-Path $service ".env.example"
    $envFile = Join-Path $service ".env"
    
    if (Test-Path $envExample) {
        if (-not (Test-Path $envFile)) {
            Copy-Item $envExample $envFile
            Write-Host "✓ Created $envFile" -ForegroundColor Green
        } else {
            Write-Host "⚠ $envFile already exists, skipping..." -ForegroundColor Yellow
        }
    } else {
        Write-Host "✗ .env.example not found in $service" -ForegroundColor Red
    }
}

Write-Host "`nDone! Please update .env files with your actual credentials." -ForegroundColor Cyan
