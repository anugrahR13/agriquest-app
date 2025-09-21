#!/bin/bash

# AgriQuest Production Deployment Script

echo "🌱 Starting AgriQuest Production Deployment..."

# Check if Docker is installed
if ! command -v docker &> /dev/null
then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null
then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

# Build and start services
echo "🐳 Building and starting Docker containers..."
docker-compose -f docker-compose.prod.yml up -d

# Wait for services to be ready
echo "⏳ Waiting for services to start..."
sleep 30

# Check if services are running
if docker-compose -f docker-compose.prod.yml ps | grep -q "agriquest-app.*Up"; then
    echo "✅ AgriQuest application is running!"
else
    echo "❌ AgriQuest application failed to start."
    docker-compose -f docker-compose.prod.yml logs app
    exit 1
fi

if docker-compose -f docker-compose.prod.yml ps | grep -q "agriquest-db.*Up"; then
    echo "✅ Database is running!"
else
    echo "❌ Database failed to start."
    docker-compose -f docker-compose.prod.yml logs postgres
    exit 1
fi

# Run database migrations
echo "🔄 Running database migrations..."
docker-compose -f docker-compose.prod.yml exec app npm run db:migrate

# Show deployment info
echo "🎉 Deployment completed successfully!"
echo "🌍 Application is available at: http://localhost:3000"
echo "📊 Database is running on port: 5432"
echo "📁 To stop the application, run: docker-compose -f docker-compose.prod.yml down"