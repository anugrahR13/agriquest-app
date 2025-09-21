# Vercel Environment Variable Setup

## Required Environment Variables

To deploy AgriQuest to Vercel successfully, you need to configure these environment variables in your Vercel project dashboard:

### 1. Database Configuration
```
DATABASE_URL=your_production_database_connection_string
```

### 2. Security Configuration
```
JWT_SECRET=your_secure_jwt_secret_key
```

### 3. Application URLs
```
NEXT_PUBLIC_APP_URL=https://your-app-name.vercel.app
NEXT_PUBLIC_API_URL=https://your-app-name.vercel.app/api
```

### 4. Node Environment
```
NODE_ENV=production
```

## Step-by-Step Setup Instructions

### 1. Access Vercel Dashboard
1. Go to https://vercel.com/dashboard
2. Select your AgriQuest project

### 2. Navigate to Environment Variables
1. Click on your project
2. Go to "Settings" tab
3. Click on "Environment Variables" in the left sidebar

### 3. Add Required Variables
Add each of the following variables:

#### Database URL
- Name: `DATABASE_URL`
- Value: Your production database connection string (see database setup guide)
- Type: "Plain Text"

#### JWT Secret
- Name: `JWT_SECRET`
- Value: A secure random string (at least 32 characters)
- Type: "Secret" (important for security)

#### Application URLs
- Name: `NEXT_PUBLIC_APP_URL`
- Value: `https://your-app-name.vercel.app` (replace with your actual Vercel URL)
- Type: "Plain Text"

- Name: `NEXT_PUBLIC_API_URL`
- Value: `https://your-app-name.vercel.app/api` (replace with your actual Vercel URL)
- Type: "Plain Text"

#### Node Environment
- Name: `NODE_ENV`
- Value: `production`
- Type: "Plain Text"

### 4. Save and Redeploy
1. Click "Add" for each variable
2. After adding all variables, go to the "Deployments" tab
3. Click the three dots next to your latest deployment
4. Select "Redeploy" to apply the new environment variables

## Database Setup Options

### Option 1: Supabase (Recommended)
1. Go to https://supabase.com/
2. Create a free account
3. Create a new project
4. Get your database connection string from the Supabase dashboard
5. Use this format for DATABASE_URL:
   ```
   postgresql://[USER]:[PASSWORD]@[HOST]:[PORT]/[DATABASE]
   ```

### Option 2: Neon.tech
1. Go to https://neon.tech/
2. Create a free account
3. Create a new project
4. Get your connection string
5. Use this format for DATABASE_URL:
   ```
   postgresql://[USER]:[PASSWORD]@[HOST]:[PORT]/[DATABASE]
   ```

## Security Notes

1. **JWT_SECRET**: This should be a long, random string. Never share this value publicly.
2. **DATABASE_URL**: If your database provider offers a "connection pool" URL, use that for better performance.
3. **Environment Variable Types**: 
   - Use "Secret" for sensitive information like JWT_SECRET
   - Use "Plain Text" for non-sensitive configuration

## Verification

After setting up your environment variables:

1. Check that all variables appear in the Environment Variables list
2. Redeploy your application
3. Monitor the build logs for any database connection errors
4. Test the application after deployment

## Troubleshooting

### Missing Environment Variables
If you see errors about missing environment variables:
1. Double-check that all required variables are added
2. Ensure variable names match exactly (case-sensitive)
3. Redeploy after making changes

### Database Connection Issues
If you see database connection errors:
1. Verify your DATABASE_URL is correct
2. Check that your database accepts connections from Vercel's IP ranges
3. Ensure your database user has the necessary permissions

### Incorrect URLs
If links in your application don't work correctly:
1. Verify NEXT_PUBLIC_APP_URL and NEXT_PUBLIC_API_URL match your Vercel deployment URL
2. Remember to include the protocol (https://)