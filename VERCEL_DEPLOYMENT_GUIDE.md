# Vercel Deployment Guide for AgriQuest

## Common Issues and Solutions

### 1. Database Connection Issues
Vercel serverless functions have limitations with traditional database connections. Here's how to resolve this:

#### Solution A: Use a Managed Database Service
1. Create a PostgreSQL database on a service like:
   - Supabase
   - PlanetScale
   - Neon.tech
   - Railway
2. Update your environment variables in Vercel with the new database connection string

#### Solution B: Use Vercel Postgres (if available)
1. Enable Vercel Postgres in your Vercel dashboard
2. Update your Prisma schema to use Vercel's connection pooling

### 2. Environment Variables Setup
You need to configure these environment variables in your Vercel project settings:

```
DATABASE_URL=your_production_database_url
JWT_SECRET=your_secure_jwt_secret
NEXT_PUBLIC_APP_URL=https://your-app-name.vercel.app
NEXT_PUBLIC_API_URL=https://your-app-name.vercel.app/api
NODE_ENV=production
```

### 3. TensorFlow.js and AI Dependencies
These dependencies might cause issues in the serverless environment:

#### Solution:
Modify your Next.js configuration to exclude these from serverless functions:

```javascript
// next.config.js
const nextConfig = {
  // ... existing config
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Client-side only configurations
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
      };
    }
    return config;
  },
};

export default nextConfig;
```

## Step-by-Step Deployment Process

### 1. Prepare Your Repository
1. Ensure your code is pushed to GitHub
2. Make sure the main branch is up to date

### 2. Connect to Vercel
1. Go to https://vercel.com/dashboard
2. Click "New Project"
3. Import your GitHub repository
4. Configure the project:
   - Framework: Next.js
   - Root directory: Leave as is
   - Build command: `next build`
   - Output directory: `.next`

### 3. Configure Environment Variables
In the Vercel project settings, add these environment variables:
1. Go to your project → Settings → Environment Variables
2. Add the following variables:
   ```
   DATABASE_URL=your_production_database_url
   JWT_SECRET=your_secure_jwt_secret (generate a strong secret)
   NEXT_PUBLIC_APP_URL=https://your-app-name.vercel.app
   NEXT_PUBLIC_API_URL=https://your-app-name.vercel.app/api
   NODE_ENV=production
   ```

### 4. Update Your Database Schema
If using a new database:
1. Update the DATABASE_URL in your local .env file
2. Run the Prisma migrations:
   ```bash
   npx prisma migrate deploy
   npx prisma generate
   ```

### 5. Deploy
1. Click "Deploy" in Vercel
2. Wait for the build to complete
3. Check the build logs for any errors

## Troubleshooting Common Errors

### Error: "Module not found" for TensorFlow or other AI libraries
This happens because these libraries are too large for serverless functions.

#### Solution:
1. Lazy load these libraries only when needed
2. Move AI processing to API routes that can handle larger dependencies
3. Consider using external AI services instead

### Error: "Can't resolve 'fs' or 'path'"
This happens when Node.js specific modules are used in the browser.

#### Solution:
Add this to your Next.js config:
```javascript
webpack: (config, { isServer }) => {
  if (!isServer) {
    config.resolve.fallback = {
      fs: false,
      path: false,
    };
  }
  return config;
}
```

### Error: "PrismaClientKnownRequestError"
This usually indicates a database connection issue.

#### Solution:
1. Verify your DATABASE_URL is correct
2. Ensure your database is accessible from Vercel
3. Check if you need to whitelist Vercel's IP addresses in your database provider

## Alternative Approach: Simplified Deployment

If you continue to face issues, consider deploying a simplified version:

1. Remove AI dependencies for initial deployment
2. Use mock data instead of real database calls
3. Deploy with minimal features first, then add complexity

## Getting Help

If you're still experiencing issues:
1. Check the build logs in Vercel for specific error messages
2. Verify all environment variables are correctly set
3. Ensure your database is accessible from the internet
4. Contact Vercel support if needed

Remember to replace `your-app-name` with your actual Vercel project name.