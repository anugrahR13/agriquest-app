# AgriQuest Production Deployment Guide

This guide provides instructions for deploying the AgriQuest application to a production environment.

## Prerequisites

Before deploying, ensure you have the following installed on your server:

1. **Docker** (v20.10 or higher)
2. **Docker Compose** (v1.29 or higher)
3. **Git** (for cloning the repository)

## Deployment Options

### Option 1: Deploy with Docker Compose (Recommended)

#### 1. Clone the Repository

```bash
git clone <repository-url>
cd agriquest-app
```

#### 2. Configure Environment Variables

Create a `.env.production` file based on `.env.example`:

```bash
cp .env.example .env.production
```

On Windows:
```cmd
copy .env.example .env.production
```

Edit the `.env.production` file and update the following variables for production:

```env
# Database
DATABASE_URL="postgresql://agriquest_user:agriquest_password@postgres:5432/agriquest_db"

# JWT Configuration (CHANGE THIS IN PRODUCTION!)
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"

# App Configuration
NODE_ENV="production"
PORT=3000
NEXT_PUBLIC_API_URL="http://your-domain.com/api"
NEXT_PUBLIC_APP_URL="http://your-domain.com"

# Security
NEXT_PUBLIC_DEFAULT_LANGUAGE="en"
DEBUG_MODE="false"
```

**Important**: Change the `JWT_SECRET` to a strong, random secret in production!

#### 3. Build and Deploy

Run the deployment script:

```bash
# On Linux/Mac
chmod +x deploy.sh
./deploy.sh

# On Windows (Command Prompt)
deploy.bat

# On Windows (PowerShell)
.\deploy.ps1
```

Or manually deploy using Docker Compose:

```bash
docker-compose -f docker-compose.prod.yml up -d
```

#### 4. Run Database Migrations

After the containers are up, run the database migrations:

```bash
docker-compose -f docker-compose.prod.yml exec app npm run db:migrate
```

### Option 2: Manual Deployment

#### 1. Install Dependencies

```bash
npm install
```

#### 2. Configure Environment

Create a `.env.local` file with production settings:

```env
DATABASE_URL="postgresql://username:password@localhost:5432/agriquest_db"
JWT_SECRET="your-super-secret-jwt-key-change-this-in-production"
NODE_ENV="production"
PORT=3000
NEXT_PUBLIC_API_URL="http://your-domain.com/api"
NEXT_PUBLIC_APP_URL="http://your-domain.com"
```

#### 3. Build the Application

```bash
npm run build
```

#### 4. Start the Application

```bash
npm start
```

## Accessing the Application

After deployment, the application will be available at:

- **URL**: http://localhost:3000 (or your domain)
- **API Endpoints**: http://localhost:3000/api/*
- **Health Check**: http://localhost:3000/api/health

## Verifying the Deployment

To verify that your deployment was successful, you can use the provided verification scripts:

```bash
# On Linux/Mac
chmod +x verify-deployment.sh
./verify-deployment.sh

# On Windows (PowerShell)
.\verify-deployment.ps1

# On Windows (Command Prompt)
verify-deployment.bat
```

Or manually check the application health:

```bash
curl http://localhost:3000/api/health
```

## Production Considerations

### Security

1. **Change Default Secrets**: Update `JWT_SECRET` in environment variables
2. **HTTPS**: Configure SSL/TLS for production use
3. **Database Security**: Use strong database credentials
4. **Rate Limiting**: Implement rate limiting for API endpoints

### Performance

1. **Reverse Proxy**: Use Nginx or Apache as a reverse proxy
2. **Caching**: Implement caching strategies for static assets
3. **CDN**: Use a CDN for images and static files
4. **Database Optimization**: Monitor and optimize database queries

### Monitoring

1. **Logging**: Configure centralized logging
2. **Health Checks**: Implement health check endpoints
3. **Error Tracking**: Set up error tracking and alerting
4. **Performance Monitoring**: Monitor application performance

### Backup and Recovery

1. **Database Backups**: Regular database backups
2. **File Backups**: Backup uploaded files and configurations
3. **Disaster Recovery**: Plan for disaster recovery scenarios

## Troubleshooting

### Common Issues

1. **Port Conflicts**: If port 3000 is in use, change the port in docker-compose.prod.yml

2. **Database Connection Issues**: 
   - Check database credentials in environment variables
   - Ensure the database container is running

3. **Application Not Starting**:
   - Check logs: `docker-compose -f docker-compose.prod.yml logs app`
   - Verify environment variables

### Checking Logs

```bash
# Application logs
docker-compose -f docker-compose.prod.yml logs app

# Database logs
docker-compose -f docker-compose.prod.yml logs postgres
```

### Stopping the Application

To stop the application:

```bash
docker-compose -f docker-compose.prod.yml down
```

To stop and remove volumes (including database data):

```bash
docker-compose -f docker-compose.prod.yml down -v
```

## Scaling

For high-traffic deployments, consider:

1. **Load Balancing**: Use multiple application instances behind a load balancer
2. **Database Replication**: Set up database replication
3. **Caching Layer**: Add Redis for caching
4. **Container Orchestration**: Use Kubernetes for container orchestration

## Updating the Application

To update to a new version:

1. Pull the latest code:
   ```bash
   git pull origin main
   ```

2. Rebuild and restart containers:
   ```bash
   docker-compose -f docker-compose.prod.yml down
   docker-compose -f docker-compose.prod.yml up -d --build
   ```

3. Run database migrations if needed:
   ```bash
   docker-compose -f docker-compose.prod.yml exec app npm run db:migrate
   ```

## Support

For deployment assistance, contact the development team or refer to the project documentation.