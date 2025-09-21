# AgriQuest Deployment Verification Script

Write-Host "🔍 Verifying AgriQuest Deployment..." -ForegroundColor Green

# Check if Docker is installed
try {
    $dockerVersion = docker --version
    Write-Host "✅ Docker is installed: $dockerVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Docker is not installed." -ForegroundColor Red
    exit 1
}

# Check if Docker Compose is installed
try {
    $dockerComposeVersion = docker-compose --version
    Write-Host "✅ Docker Compose is installed: $dockerComposeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Docker Compose is not installed." -ForegroundColor Red
    exit 1
}

# Check if containers are running
Write-Host "🔍 Checking container status..." -ForegroundColor Yellow
$dockerPs = docker-compose -f docker-compose.prod.yml ps

if ($dockerPs -like "*agriquest-app*Up*") {
    Write-Host "✅ AgriQuest application container is running!" -ForegroundColor Green
} else {
    Write-Host "❌ AgriQuest application container is not running." -ForegroundColor Red
    Write-Host "Try running: docker-compose -f docker-compose.prod.yml up -d" -ForegroundColor Yellow
}

if ($dockerPs -like "*agriquest-db*Up*") {
    Write-Host "✅ Database container is running!" -ForegroundColor Green
} else {
    Write-Host "❌ Database container is not running." -ForegroundColor Red
    Write-Host "Try running: docker-compose -f docker-compose.prod.yml up -d" -ForegroundColor Yellow
}

# Check if application is responding
try {
    Write-Host "🔍 Checking application health..." -ForegroundColor Yellow
    $response = Invoke-WebRequest -Uri "http://localhost:3000/api/health" -UseBasicParsing -TimeoutSec 10
    if ($response.StatusCode -eq 200) {
        Write-Host "✅ Application is responding correctly!" -ForegroundColor Green
        Write-Host "Response: $($response.Content)" -ForegroundColor Cyan
    } else {
        Write-Host "⚠️  Application returned status code: $($response.StatusCode)" -ForegroundColor Yellow
    }
} catch {
    Write-Host "❌ Unable to reach application at http://localhost:3000" -ForegroundColor Red
    Write-Host "Error: $($_.Exception.Message)" -ForegroundColor Yellow
}

# Show container logs if there are issues
if (-not ($dockerPs -like "*agriquest-app*Up*") -or -not ($dockerPs -like "*agriquest-db*Up*")) {
    Write-Host "📋 Showing container logs for troubleshooting..." -ForegroundColor Yellow
    docker-compose -f docker-compose.prod.yml logs --tail=20
}

Write-Host "✅ Verification complete!" -ForegroundColor Green
Write-Host "🌍 Access your application at: http://localhost:3000" -ForegroundColor Cyan