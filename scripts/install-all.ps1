# PowerShell script to install all dependencies
# Run: .\scripts\install-all.ps1

Write-Host "Installing all dependencies..." -ForegroundColor Green

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
    "mobile",
    "admin-panel"
)

foreach ($service in $services) {
    if (Test-Path $service) {
        Write-Host "Installing dependencies for $service..." -ForegroundColor Yellow
        Set-Location $service
        npm install
        Set-Location ../..
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✓ $service installed successfully" -ForegroundColor Green
        } else {
            Write-Host "✗ Failed to install $service" -ForegroundColor Red
        }
    } else {
        Write-Host "✗ Directory not found: $service" -ForegroundColor Red
    }
}

Write-Host "`nAll dependencies installed!" -ForegroundColor Green
