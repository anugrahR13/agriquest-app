@echo off
REM AgriQuest Deployment Verification Script

echo 🔍 Verifying AgriQuest Deployment...

REM Check if Docker is installed
docker --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Docker is not installed.
    exit /b 1
) else (
    echo ✅ Docker is installed
    docker --version
)

REM Check if Docker Compose is installed
docker-compose --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Docker Compose is not installed.
    exit /b 1
) else (
    echo ✅ Docker Compose is installed
    docker-compose --version
)

REM Check if containers are running
echo 🔍 Checking container status...
docker-compose -f docker-compose.prod.yml ps | findstr "agriquest-app.*Up" >nul
if %errorlevel% equ 0 (
    echo ✅ AgriQuest application container is running!
) else (
    echo ❌ AgriQuest application container is not running.
    echo Try running: docker-compose -f docker-compose.prod.yml up -d
)

docker-compose -f docker-compose.prod.yml ps | findstr "agriquest-db.*Up" >nul
if %errorlevel% equ 0 (
    echo ✅ Database container is running!
) else (
    echo ❌ Database container is not running.
    echo Try running: docker-compose -f docker-compose.prod.yml up -d
)

REM Show container logs if there are issues
echo 📋 Showing container status...
docker-compose -f docker-compose.prod.yml ps

echo ✅ Verification complete!
echo 🌍 Access your application at: http://localhost:3000