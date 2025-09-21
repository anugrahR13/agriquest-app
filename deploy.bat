@echo off
REM AgriQuest Production Deployment Script for Windows

echo 🌱 Starting AgriQuest Production Deployment...

REM Check if Docker is installed
docker --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Docker is not installed. Please install Docker first.
    echo Download Docker Desktop from: https://www.docker.com/products/docker-desktop
    exit /b 1
)

REM Check if Docker Compose is installed
docker-compose --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Docker Compose is not installed. Please install Docker Compose first.
    echo Docker Compose is included with Docker Desktop on Windows.
    exit /b 1
)

REM Build and start services
echo 🐳 Building and starting Docker containers...
docker-compose -f docker-compose.prod.yml up -d

REM Wait for services to be ready
echo ⏳ Waiting for services to start...
timeout /t 30 /nobreak >nul

REM Check if services are running
docker-compose -f docker-compose.prod.yml ps | findstr "agriquest-app.*Up" >nul
if %errorlevel% equ 0 (
    echo ✅ AgriQuest application is running!
) else (
    echo ⚠️  Checking application status...
    REM Give it a bit more time
    timeout /t 10 /nobreak >nul
)

docker-compose -f docker-compose.prod.yml ps | findstr "agriquest-db.*Up" >nul
if %errorlevel% equ 0 (
    echo ✅ Database is running!
) else (
    echo ⚠️  Checking database status...
    REM Give it a bit more time
    timeout /t 10 /nobreak >nul
)

REM Show deployment info
echo 🎉 Deployment process completed!
echo 🌍 Application will be available at: http://localhost:3000
echo 📊 Database is running on port: 5432
echo 📁 To stop the application, run: docker-compose -f docker-compose.prod.yml down
echo 📝 IMPORTANT: Please change the JWT_SECRET in .env.production for security!