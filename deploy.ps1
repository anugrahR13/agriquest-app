# AgriQuest Production Deployment Script for PowerShell

Write-Host "🌱 Starting AgriQuest Production Deployment..." -ForegroundColor Green

# Check if Docker is installed
try {
    $dockerVersion = docker --version
    Write-Host "✅ Docker is installed: $dockerVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Docker is not installed. Please install Docker first." -ForegroundColor Red
    Write-Host "Download Docker Desktop from: https://www.docker.com/products/docker-desktop" -ForegroundColor Yellow
    exit 1
}

# Check if Docker Compose is installed
try {
    $dockerComposeVersion = docker-compose --version
    Write-Host "✅ Docker Compose is installed: $dockerComposeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Docker Compose is not installed. Please install Docker Compose first." -ForegroundColor Red
    Write-Host "Docker Compose is included with Docker Desktop on Windows." -ForegroundColor Yellow
    exit 1
}

# Build and start services
Write-Host "🐳 Building and starting Docker containers..." -ForegroundColor Yellow
docker-compose -f docker-compose.prod.yml up -d

# Wait for services to be ready
Write-Host "⏳ Waiting for services to start..." -ForegroundColor Yellow
Start-Sleep -Seconds 30

# Check if services are running
$dockerPs = docker-compose -f docker-compose.prod.yml ps
if ($dockerPs -like "*agriquest-app*Up*") {
    Write-Host "✅ AgriQuest application is running!" -ForegroundColor Green
} else {
    Write-Host "⚠️  Checking application status..." -ForegroundColor Yellow
    # Give it a bit more time
    Start-Sleep -Seconds 10
}

if ($dockerPs -like "*agriquest-db*Up*") {
    Write-Host "✅ Database is running!" -ForegroundColor Green
} else {
    Write-Host "⚠️  Checking database status..." -ForegroundColor Yellow
    # Give it a bit more time
    Start-Sleep -Seconds 10
}

# Show deployment info
Write-Host "🎉 Deployment process completed!" -ForegroundColor Green
Write-Host "🌍 Application will be available at: http://localhost:3000" -ForegroundColor Cyan
Write-Host "📊 Database is running on port: 5432" -ForegroundColor Cyan
Write-Host "📁 To stop the application, run: docker-compose -f docker-compose.prod.yml down" -ForegroundColor Cyan
Write-Host "📝 IMPORTANT: Please change the JWT_SECRET in .env.production for security!" -ForegroundColor Red