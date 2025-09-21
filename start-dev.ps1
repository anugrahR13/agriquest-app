# AgriQuest Development Environment Startup Script

Write-Host "🌱 Starting AgriQuest Development Environment..." -ForegroundColor Green

# Start the unified Next.js application (frontend + backend API routes)
Write-Host "🚀 Starting unified Next.js application..." -ForegroundColor Yellow
Write-Host "   - Frontend will be available at http://localhost:3000" -ForegroundColor Cyan
Write-Host "   - API routes are integrated within the Next.js app" -ForegroundColor Cyan

Set-Location -Path "c:\Users\venum\agriquest app\agriquest-app"
npm run dev

Write-Host "👋 Development environment stopped." -ForegroundColor Green