# Script to start all services
# This will open multiple PowerShell windows, one for each service

Write-Host "Starting all Talk Legally services..." -ForegroundColor Green
Write-Host "This will open 12 separate terminal windows" -ForegroundColor Yellow

$services = @(
    @{Name="Auth Service"; Path="backend/services/auth-service"; Port=3001},
    @{Name="User Service"; Path="backend/services/user-service"; Port=3006},
    @{Name="Lawyer Service"; Path="backend/services/lawyer-service"; Port=3007},
    @{Name="Wallet Service"; Path="backend/services/wallet-service"; Port=3002},
    @{Name="Payment Service"; Path="backend/services/payment-service"; Port=3003},
    @{Name="Session Service"; Path="backend/services/session-service"; Port=3004},
    @{Name="Chat Service"; Path="backend/services/chat-service"; Port=3005},
    @{Name="Notification Service"; Path="backend/services/notification-service"; Port=3008},
    @{Name="Admin Service"; Path="backend/services/admin-service"; Port=3009},
    @{Name="API Gateway"; Path="backend/api-gateway"; Port=3000},
    @{Name="Admin Panel"; Path="admin-panel"; Port=5173; Command="npm run dev"},
    @{Name="Mobile App"; Path="mobile"; Port=19006; Command="npm start"}
)

foreach ($service in $services) {
    $command = if ($service.Command) { $service.Command } else { "npm run start:dev" }
    $scriptBlock = "cd '$($service.Path)'; $command"
    $title = "$($service.Name) - Port $($service.Port)"
    
    Write-Host "Starting $title..." -ForegroundColor Cyan
    
    $cmd = "Write-Host '$title' -ForegroundColor Green; $scriptBlock"
    Start-Process powershell -ArgumentList "-NoExit", "-Command", $cmd
    
    Start-Sleep -Milliseconds 500
}

Write-Host ""
Write-Host "All services starting in separate windows!" -ForegroundColor Green
Write-Host ""
Write-Host "Services will be available at:" -ForegroundColor Yellow
Write-Host "  - API Gateway: http://localhost:3000" -ForegroundColor White
Write-Host "  - Admin Panel: http://localhost:5173" -ForegroundColor White
Write-Host "  - Mobile App: Expo will show QR code" -ForegroundColor White
