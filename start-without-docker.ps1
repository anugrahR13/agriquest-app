# AgriQuest Local Development Server

Write-Host "================================" -ForegroundColor Green
Write-Host "🌱 AgriQuest Local Development" -ForegroundColor Green
Write-Host "================================" -ForegroundColor Green

Write-Host ""
Write-Host "Starting AgriQuest application..." -ForegroundColor Yellow
Write-Host ""

Write-Host "Installing dependencies..." -ForegroundColor Yellow
npm install

Write-Host ""
Write-Host "Starting development server..." -ForegroundColor Yellow
Write-Host ""
Write-Host "Access the application at: http://localhost:3000" -ForegroundColor Cyan
Write-Host ""
Write-Host "Demo account:" -ForegroundColor Yellow
Write-Host "Phone: 9876543210" -ForegroundColor Cyan
Write-Host "OTP: 123456" -ForegroundColor Cyan
Write-Host ""

npm run dev