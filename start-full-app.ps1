# AgriQuest Full Application Startup Script

Write-Host "🌱 Starting AgriQuest Full Application..." -ForegroundColor Green

# Start the unified Next.js application (frontend + backend API routes)
Write-Host "🚀 Starting unified Next.js application..." -ForegroundColor Yellow
Write-Host "   - Application will be available at http://localhost:3000" -ForegroundColor Cyan
Write-Host "   - All API routes are integrated within the Next.js app" -ForegroundColor Cyan

Set-Location -Path "c:\Users\venum\agriquest app\agriquest-app"
npm run dev

Write-Host "👋 Full application stopped." -ForegroundColor Green