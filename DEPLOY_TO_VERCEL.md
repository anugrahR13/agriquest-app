# Deploy AgriQuest to Vercel - Complete Guide

## Prerequisites
1. A GitHub account
2. A Vercel account
3. This project pushed to a GitHub repository

## Step 1: Push Your Code to GitHub
Make sure all your changes are committed and pushed to GitHub:
```bash
git add .
git commit -m "Prepare for Vercel deployment"
git push origin main
```

## Step 2: Set Up a Managed Database
Since Vercel's serverless functions can't connect to local databases, you need a managed database service.

### Option 1: Supabase (Recommended)
1. Go to https://supabase.com/
2. Sign up for a free account
3. Create a new project
4. Get your database connection string from the Supabase dashboard
   - It will look like: `postgresql://[USER]:[PASSWORD]@[HOST]:[PORT]/[DATABASE]`

### Option 2: Neon.tech
1. Go to https://neon.tech/
2. Sign up for a free account
3. Create a new project
4. Get your connection string

## Step 3: Configure Environment Variables in Vercel
1. Go to your Vercel dashboard
2. Select your AgriQuest project
3. Go to "Settings" → "Environment Variables"
4. Add these variables:

| Variable Name | Value | Type |
|---------------|-------|------|
| DATABASE_URL | Your database connection string | Plain Text |
| JWT_SECRET | A secure random string (at least 32 characters) | Secret |
| NEXT_PUBLIC_APP_URL | https://your-app-name.vercel.app | Plain Text |
| NEXT_PUBLIC_API_URL | https://your-app-name.vercel.app/api | Plain Text |
| NODE_ENV | production | Plain Text |

## Step 4: Deploy to Vercel
1. Go to your Vercel dashboard
2. Click "New Project"
3. Import your GitHub repository
4. Configure the project:
   - Framework: Next.js
   - Root directory: Leave as is
   - Build command: `next build`
   - Output directory: `.next`
5. Click "Deploy"

## Step 5: Run Database Migrations
After your first deployment, you'll need to set up your database schema:
1. Connect to your database using a tool like psql or the Supabase dashboard
2. Run the Prisma migrations:
   ```bash
   npx prisma migrate deploy
   ```

## Troubleshooting

### If You See Build Warnings
The warnings you see are related to code style and won't prevent deployment:
- Image optimization warnings: You can replace `<img>` tags with Next.js `<Image />` component
- Missing dependency warnings: You can add missing dependencies to useEffect dependency arrays
- Unescaped entities: Replace `'` with `&#39;` or use template literals

### If You See Build Errors
The errors you see are related to missing imports:
- 'Target' is not defined: Import the Target component from lucide-react
- 'Sprout' is not defined: Import the Sprout component from lucide-react
- Unescaped entities: Replace `'` with `&#39;` or use template literals

### If Your Application Doesn't Work After Deployment
1. Check the runtime logs in Vercel
2. Verify database connections
3. Test API endpoints individually
4. Check browser console for client-side errors

## Success Metrics
✅ Application builds successfully on Vercel
✅ All API endpoints are accessible
✅ Database connections work correctly
✅ User authentication functions properly
✅ All major features are working
✅ Application is accessible via your Vercel URL

## Files That Were Fixed for Vercel Deployment
1. [src/app/api/auction/[farmId]/route.ts](file:///C:/Users/venum/agriquest%20app/agriquest-app/src/app/api/auction/%5BfarmId%5D/route.ts) - Fixed TypeScript typing issues
2. [src/app/api/crop-score/[farmId]/route.ts](file:///C:/Users/venum/agriquest%20app/agriquest-app/src/app/api/crop-score/%5BfarmId%5D/route.ts) - Fixed TypeScript typing issues
3. [next.config.ts](file:///C:/Users/venum/agriquest%20app/agriquest-app/next.config.ts) - Removed invalid configuration options
4. [package.json](file:///C:/Users/venum/agriquest%20app/agriquest-app/package.json) - Updated dependencies
5. [.eslintrc.json](file:///C:/Users/venum/agriquest%20app/agriquest-app/.eslintrc.json) - Added ESLint configuration
6. Added missing ESLint dependencies

## Next Steps
1. Fix the remaining code style issues (optional but recommended)
2. Test all application features
3. Share your deployed application with teammates