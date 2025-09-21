# Docker and PostgreSQL Setup for AgriQuest

This guide will help you set up Docker and PostgreSQL for the AgriQuest application.

## Prerequisites

Before proceeding, ensure you have the following installed:
- Node.js (version 16 or higher)
- npm (comes with Node.js)

## Option 1: Using Docker (Recommended)

### 1. Install Docker Desktop

1. Download Docker Desktop for Windows from [https://www.docker.com/products/docker-desktop](https://www.docker.com/products/docker-desktop)
2. Run the installer and follow the installation wizard
3. Restart your computer if prompted

### 2. Verify Docker Installation

Open a new PowerShell terminal and run:
```bash
docker --version
docker-compose --version
```

You should see version information for both commands.

### 3. Start PostgreSQL and AgriQuest Services

From the project root directory, run:
```bash
docker-compose up -d
```

This will start:
- PostgreSQL database on port 5432
- AgriQuest application with both frontend and backend

### 4. Verify Services are Running

```bash
docker-compose ps
```

You should see both `agriquest-db` and `agriquest-app` containers running.

### 5. Run Database Migrations

```bash
docker-compose exec agriquest-app npm run db:migrate
docker-compose exec agriquest-app npm run db:generate
```

### 6. Access the Application

- Frontend: http://localhost:3000
- Backend API: http://localhost:3001

## Option 2: Local PostgreSQL Installation

### 1. Install PostgreSQL

1. Download PostgreSQL for Windows from [https://www.postgresql.org/download/windows/](https://www.postgresql.org/download/windows/)
2. Run the installer and follow the installation wizard
3. During installation:
   - Set password to `password` (to match .env.local)
   - Keep port as 5432
   - Make sure to install pgAdmin (optional but helpful)

### 2. Create Database

Using pgAdmin or psql, create a database named `agriquest_dev`.

### 3. Update Environment Variables

Ensure your [.env.local](file:///c:/Users/venum/agriquest%20app/agriquest-app/.env.local) file has the correct database URL:
```bash
DATABASE_URL="postgresql://postgres:password@localhost:5432/agriquest_dev"
```

### 4. Run Database Migrations

```bash
npm run db:migrate
npm run db:generate
```

### 5. Start the Application

```bash
npm run dev:full
```

## Troubleshooting

### Docker Issues

1. **Docker command not found**: 
   - Ensure Docker Desktop is installed
   - Add Docker to your system PATH
   - Restart your terminal

2. **Permission denied**:
   - Run PowerShell as Administrator
   - Share your drive in Docker Desktop settings

3. **Port already in use**:
   - Stop applications using ports 3000, 3001, or 5432
   - Modify ports in [docker-compose.yml](file:///c:/Users/venum/agriquest%20app/agriquest-app/docker-compose.yml) if needed

### PostgreSQL Issues

1. **Connection refused**:
   - Ensure PostgreSQL service is running
   - Check that port 5432 is not blocked by firewall
   - Verify username and password in [.env.local](file:///c:/Users/venum/agriquest%20app/agriquest-app/.env.local)

2. **Database does not exist**:
   - Create the `agriquest_dev` database manually
   - Or update [.env.local](file:///c:/Users/venum/agriquest%20app/agriquest-app/.env.local) to use an existing database

## Useful Commands

### Docker Management
```bash
# Start services
docker-compose up -d

# Stop services
docker-compose down

# View logs
docker-compose logs

# Execute commands in container
docker-compose exec agriquest-app bash
```

### Database Management
```bash
# Run migrations
npm run db:migrate

# Generate Prisma client
npm run db:generate

# Seed database
npm run db:seed

# Open Prisma Studio
npm run db:studio
```

## Next Steps

Once Docker and PostgreSQL are running:

1. Run database migrations:
   ```bash
   npm run db:migrate
   npm run db:generate
   ```

2. Start the development server:
   ```bash
   npm run dev:full
   ```

3. Access the application at http://localhost:3000

4. For production deployment, update the [Dockerfile](file:///c:/Users/venum/agriquest%20app/agriquest-app/Dockerfile) and [docker-compose.yml](file:///c:/Users/venum/agriquest%20app/agriquest-app/docker-compose.yml) with production settings