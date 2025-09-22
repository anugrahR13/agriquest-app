# AgriQuest Application - Render.com Deployment Guide

## Overview
This guide provides step-by-step instructions for deploying the AgriQuest application to Render.com.

## Prerequisites
1. GitHub account with the AgriQuest repository
2. Render.com account
3. PostgreSQL database (can be provisioned on Render.com)

## Deployment Steps

### 1. Create a New Web Service on Render.com
1. Log in to your Render.com account
2. Click "New" and select "Web Service"
3. Connect your GitHub repository
4. Select the branch to deploy (usually `main`)

### 2. Configure Build Settings
- **Environment**: Node
- **Build Command**: `npm run build`
- **Start Command**: `npm start`
- **Plan**: Free (or select appropriate plan)

### 3. Configure Environment Variables
Add the following environment variables in the Render.com dashboard:

```
DATABASE_URL=your_postgresql_connection_string
JWT_SECRET=your_jwt_secret_key
NEXT_PUBLIC_API_URL=https://your-app-name.onrender.com
GOOGLE_APPLICATION_CREDENTIALS=./config/service-account-key.json
GOOGLE_VISION_ENABLED=true
AI_IMPLEMENTATION=google-vision
PORT=3000
```

### 4. Add Database (Optional)
1. In the same Render.com project, create a new "PostgreSQL" database
2. Note the connection string provided by Render.com
3. Update the `DATABASE_URL` environment variable with this connection string

### 5. Configure Health Check
Render.com will automatically use the `/api/health` endpoint to check application health.

### 6. Deploy
1. Click "Create Web Service"
2. Render.com will automatically start the deployment process
3. Monitor the build logs for any issues

## Post-Deployment Steps

### 1. Database Migration
After the first deployment, you may need to run database migrations:
1. Go to the "Manual Deploy" section
2. Run the command: `npm run db:migrate`

### 2. Seed Initial Data (Optional)
To seed initial data:
1. Go to the "Manual Deploy" section
2. Run the command: `npm run db:seed`

### 3. Verify Deployment
1. Visit your application URL (provided by Render.com)
2. Test key features:
   - Authentication
   - Auction system
   - Crop reporting
   - API endpoints

## Troubleshooting

### Common Issues

1. **Build Failures**
   - Check build logs for specific error messages
   - Ensure all dependencies are correctly listed in package.json

2. **Runtime Errors**
   - Check application logs in Render.com dashboard
   - Verify all environment variables are correctly set

3. **Database Connection Issues**
   - Verify DATABASE_URL is correctly formatted
   - Ensure the database is accessible from Render.com

4. **Google Vision API Issues**
   - Verify service account key file is correctly uploaded
   - Check that GOOGLE_APPLICATION_CREDENTIALS points to the correct file

### Health Check Endpoint
Use the `/api/health` endpoint to verify the application is running correctly:
```
GET https://your-app-name.onrender.com/api/health
```

Expected response:
```json
{
  "status": "ok",
  "timestamp": "2025-09-22T17:14:39.316Z",
  "database": "connected",
  "message": "AgriQuest API is running smoothly"
}
```

## Scaling Considerations

### Free Tier Limitations
- Limited resources
- Application may sleep after periods of inactivity
- Limited database storage

### Production Deployment
For production use:
- Upgrade to a paid plan for better performance
- Use a managed PostgreSQL database
- Implement proper monitoring and logging
- Set up custom domain

## Maintenance

### Updates
To update the application:
1. Push changes to your GitHub repository
2. Render.com will automatically deploy the new version
3. Monitor the deployment process for any issues

### Backups
- Regularly backup your database
- Keep copies of environment variables
- Maintain version control of your code

## Support
For issues with deployment:
1. Check Render.com documentation
2. Review application logs
3. Verify all configuration settings
4. Contact Render.com support if needed

## Conclusion
The AgriQuest application is now ready for deployment to Render.com. Following this guide should result in a successful deployment with all features working correctly.