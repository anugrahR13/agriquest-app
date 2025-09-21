# AgriQuest Complete Setup Guide

This guide provides comprehensive instructions for setting up the AgriQuest application with either Docker or local installation.

## Prerequisites

Before starting, ensure you have:
- Node.js (version 18 or higher)
- npm (version 8 or higher)
- Git

## Option 1: Local PostgreSQL Installation (Recommended for Windows)

### 1. Install PostgreSQL

1. Navigate to your Downloads folder
2. Double-click on `postgresql-17.6-1-windows-x64.exe` to start the installation
3. Follow the installation wizard with these settings:
   - Password: `password` (to match .env.local)
   - Port: `5432` (default)
   - Locale: Default

### 2. Add PostgreSQL to PATH

1. Open System Properties → Advanced → Environment Variables
2. In System Variables, find and select "Path", then click "Edit"
3. Add the PostgreSQL bin directory:
   - Typically: `C:\Program Files\PostgreSQL\17\bin`
4. Click "OK" to save

### 3. Create Database

1. Open Command Prompt or PowerShell as Administrator
2. Connect to PostgreSQL:
   ```bash
   psql -U postgres
   ```
   (Password: `password`)

3. Create the database:
   ```sql
   CREATE DATABASE agriquest_dev;
   ```

4. Exit PostgreSQL:
   ```sql
   \q
   ```

## Option 2: Docker Setup (Alternative)

### 1. Install Docker Desktop

1. If not already installed, download Docker Desktop from: https://www.docker.com/products/docker-desktop
2. Install Docker Desktop
3. Restart your computer

### 2. Start PostgreSQL Container

From your project directory:
```bash
docker-compose up -d
```

If you encounter PATH issues, use the full path:
```bash
"C:\Program Files\Docker\Docker\resources\bin\docker.exe" compose up -d
```

## Database Setup

### 1. Test Database Connection

From your project directory:
```bash
node test-db-connection.js
```

### 2. Run Database Migrations

```bash
npm run db:migrate
npm run db:generate
```

## Start the Application

### 1. Install Dependencies

```bash
npm install
```

### 2. Start Development Server

```bash
npm run dev:full
```

This will start both the Next.js frontend and Express backend servers.

## Troubleshooting

### Common Issues

1. **Database Connection Failed**
   - Ensure PostgreSQL is running
   - Verify credentials in `.env.local`
   - Check if port 5432 is not blocked by firewall

2. **Docker Issues**
   - Ensure Docker Desktop is running
   - Check Docker logs for errors
   - Try restarting Docker Desktop

3. **Node.js Version Issues**
   - Ensure Node.js version is 18 or higher
   - Use `node --version` to check

### Environment Variables

Ensure your `.env.local` file contains:
```env
# Database
DATABASE_URL=postgresql://postgres:password@localhost:5432/agriquest_dev

# Next.js
NEXT_PUBLIC_API_URL=http://localhost:3001

# AI Configuration
NEXT_PUBLIC_TFJS_MODEL_URL=/models/model.json
GOOGLE_APPLICATION_CREDENTIALS=./service-account-key.json
GOOGLE_VISION_ENABLED=false
```

## Testing the Setup

After completing the setup, you should be able to:

1. Access the application at http://localhost:3000
2. Connect to the database successfully
3. Run database migrations without errors
4. Start both frontend and backend servers

## Next Steps

1. Create a test user account
2. Explore the dashboard
3. Test the mission tracking features
4. Try the AI plant health analysis

If you encounter any issues during setup, please refer to the specific error messages and consult the troubleshooting section above.