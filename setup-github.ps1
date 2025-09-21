# AgriQuest GitHub Setup Script

Write-Host "🌱 AgriQuest GitHub Setup Script" -ForegroundColor Green
Write-Host "================================" -ForegroundColor Green

Write-Host ""
Write-Host "Step 1: Please create a new repository on GitHub:" -ForegroundColor Yellow
Write-Host "1. Go to https://github.com and log in" -ForegroundColor Cyan
Write-Host "2. Click the '+' icon and select 'New repository'" -ForegroundColor Cyan
Write-Host "3. Name it 'agriquest-app'" -ForegroundColor Cyan
Write-Host "4. Choose Public or Private" -ForegroundColor Cyan
Write-Host "5. Leave all checkboxes UNCHECKED" -ForegroundColor Cyan
Write-Host "6. Click 'Create repository'" -ForegroundColor Cyan

Write-Host ""
Write-Host "Press any key to continue after creating the repository..." -ForegroundColor Yellow
$host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

Write-Host ""
$github_username = Read-Host "Step 2: Enter your GitHub username"

Write-Host ""
Write-Host "Step 3: Adding remote repository..." -ForegroundColor Yellow
Set-Location -Path "c:\Users\venum\agriquest app\agriquest-app"
git remote remove origin 2>$null
git remote add origin "https://github.com/$github_username/agriquest-app.git"

Write-Host ""
Write-Host "Step 4: Pushing code to GitHub..." -ForegroundColor Yellow
git add .
git commit -m "Initial commit: AgriQuest application"
git branch -M main
git push -u origin main

Write-Host ""
Write-Host "🎉 Setup complete!" -ForegroundColor Green
Write-Host "Your repository is now available at: https://github.com/$github_username/agriquest-app" -ForegroundColor Cyan
Write-Host ""
Write-Host "To deploy to Vercel:" -ForegroundColor Yellow
Write-Host "1. Go to https://vercel.com" -ForegroundColor Cyan
Write-Host "2. Sign up/log in" -ForegroundColor Cyan
Write-Host "3. Click 'New Project'" -ForegroundColor Cyan
Write-Host "4. Import your GitHub repository" -ForegroundColor Cyan
Write-Host "5. Deploy!" -ForegroundColor Cyan
Write-Host ""
Write-Host "Press any key to exit..." -ForegroundColor Yellow
$host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")