#!/bin/sh

# Wait for database to be ready
echo "Starting AgriQuest application..."

# Check if DATABASE_URL is set
if [ -z "$DATABASE_URL" ]; then
  echo "ERROR: DATABASE_URL environment variable is not set"
  echo "Please set DATABASE_URL to your PostgreSQL database connection string"
  exit 1
fi

# Run database migrations
echo "Running database migrations..."
npx prisma migrate deploy

# Check if migration was successful
if [ $? -ne 0 ]; then
  echo "ERROR: Database migrations failed"
  exit 1
fi

echo "Database migrations completed successfully"

# Start the application
echo "Starting Next.js application..."
exec npm start