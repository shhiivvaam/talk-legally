# Script to install all dependencies
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
    "admin-panel",
    "mobile"
)

$failed = @()

foreach ($service in $services) {
    if (Test-Path $service) {
        Write-Host "`nInstalling $service..." -ForegroundColor Yellow
        Push-Location $service
        try {
            npm install 2>&1 | Out-Null
            if ($LASTEXITCODE -eq 0) {
                Write-Host "✓ $service installed successfully" -ForegroundColor Green
            } else {
                Write-Host "✗ Failed to install $service" -ForegroundColor Red
                $failed += $service
            }
        } catch {
            Write-Host "✗ Error installing $service : $_" -ForegroundColor Red
            $failed += $service
        }
        Pop-Location
    } else {
        Write-Host "✗ Directory not found: $service" -ForegroundColor Red
        $failed += $service
    }
}

Write-Host "`n========================================" -ForegroundColor Cyan
if ($failed.Count -eq 0) {
    Write-Host "✓ All dependencies installed successfully!" -ForegroundColor Green
} else {
    Write-Host "⚠ Some services failed to install:" -ForegroundColor Yellow
    $failed | ForEach-Object { Write-Host "  - $_" -ForegroundColor Red }
}
Write-Host "========================================" -ForegroundColor Cyan
