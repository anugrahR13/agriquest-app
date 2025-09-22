# 🚀 Deploying AgriQuest on Netlify

## 📋 Prerequisites

Before deploying to Netlify, you'll need:

1. A [Netlify account](https://netlify.com)
2. A GitHub, GitLab, or Bitbucket account
3. Your Google Cloud service account key file (for Google Vision API)

## ⚠️ Important Considerations

This is a **full-stack Next.js application** with:
- Frontend (React/Next.js)
- Backend API routes (`/api/*`)
- Database dependencies (PostgreSQL via Prisma)
- Server-side environment variables
- Authentication system

**Netlify is primarily designed for static sites.** For a full-stack application like this, you have a few options:

## 🛠️ Deployment Options

### Option 1: Frontend Only Deployment (Limited Functionality)
Deploy only the frontend to Netlify, but you'll need to:
- Host your backend API separately (Vercel, Render, Railway, etc.)
- Update API endpoint URLs in your frontend code
- Configure CORS properly

### Option 2: Use Netlify Functions (Recommended)
Deploy the frontend on Netlify and convert API routes to Netlify Functions.

### Option 3: Use Vercel (Recommended for Next.js)
Since this is a Next.js application, Vercel provides better integration and support.

## 📦 Option 1: Frontend Only Deployment

### 1. Prepare Your Code

First, you'll need to modify API calls to point to your external backend:

```bash
# Update API base URL in your environment variables
NEXT_PUBLIC_API_URL=https://your-backend-domain.com/api
```

### 2. Create netlify.toml

Create a `netlify.toml` file in your project root:

```toml
[build]
  command = "npm run build"
  publish = ".next"

[[plugins]]
  package = "@netlify/plugin-nextjs"

[functions]
  included_files = ["public/**", "config/**"]
```

### 3. Install Netlify CLI

```bash
npm install -g netlify-cli
```

### 4. Build and Deploy

```bash
# Build the project
npm run build

# Deploy to Netlify
netlify deploy --prod
```

## 🔧 Option 2: Using Netlify Functions

### 1. Restructure API Routes

Move your Next.js API routes to Netlify Functions format:

1. Create a `netlify/functions` directory
2. Convert each API route to a Netlify Function
3. Update database connection strings

Example conversion:
```javascript
// Next.js API Route: src/app/api/auth/request-otp/route.ts
// Netlify Function: netlify/functions/request-otp.js

const { PrismaClient } = require('@prisma/client');

exports.handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const { phone } = JSON.parse(event.body);
    
    // Your OTP logic here
    
    return {
      statusCode: 200,
      body: JSON.stringify({ success: true })
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message })
    };
  }
};
```

### 2. Update Environment Variables

Add your environment variables in Netlify dashboard:
- DATABASE_URL
- JWT_SECRET
- GOOGLE_APPLICATION_CREDENTIALS
- GOOGLE_VISION_ENABLED
- AI_IMPLEMENTATION

### 3. Configure netlify.toml

```toml
[build]
  command = "next build"
  publish = ".next"

[[plugins]]
  package = "@netlify/plugin-nextjs"

[functions]
  directory = "netlify/functions"
  included_files = ["config/**", "prisma/**"]

[dev]
  command = "next dev"
  port = 3000
  targetPort = 3000
```

## 🌐 Option 3: Recommended - Deploy to Vercel

Since this is a Next.js application, Vercel is the recommended platform:

### 1. Push to GitHub
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/yourusername/agriquest.git
git push -u origin main
```

### 2. Connect to Vercel
1. Go to [vercel.com](https://vercel.com)
2. Sign up or log in
3. Click "New Project"
4. Import your GitHub repository
5. Configure environment variables
6. Deploy!

### 3. Environment Variables for Vercel

Set these environment variables in your Vercel project settings:

```env
# Database
DATABASE_URL=postgresql://user:password@host:port/database

# Authentication
JWT_SECRET=your-jwt-secret-key

# AI Configuration
GOOGLE_APPLICATION_CREDENTIALS=./config/service-account-key.json
GOOGLE_VISION_ENABLED=true
AI_IMPLEMENTATION=google-vision

# API URLs
NEXT_PUBLIC_API_URL=https://your-app.vercel.app
```

## 🗃️ Database Deployment

You'll need to deploy your PostgreSQL database separately:

### Options:
1. **Railway** - Easy PostgreSQL hosting
2. **Render** - Free tier available
3. **Supabase** - PostgreSQL with additional features
4. **Heroku** - PostgreSQL add-on
5. **DigitalOcean** - Managed PostgreSQL

### Steps:
1. Create a PostgreSQL database on your chosen platform
2. Update your `DATABASE_URL` environment variable
3. Run database migrations:
   ```bash
   npx prisma migrate deploy
   ```
4. Seed initial data if needed:
   ```bash
   npx prisma db seed
   ```

## 🔐 Google Vision API Configuration

### 1. Service Account Key
- Upload your `service-account-key.json` to your deployment platform
- Set `GOOGLE_APPLICATION_CREDENTIALS` to point to this file

### 2. Environment Variables
```env
GOOGLE_APPLICATION_CREDENTIALS=./config/service-account-key.json
GOOGLE_VISION_ENABLED=true
AI_IMPLEMENTATION=google-vision
```

## 🧪 Testing Your Deployment

After deployment, test these key features:

1. **Authentication**
   - Login with phone number
   - OTP verification

2. **Farmer Dashboard**
   - Crop management
   - Mission system

3. **Auction System**
   - Auction listings
   - Bidding functionality

4. **AI Features**
   - Crop analysis with Google Vision
   - Report generation

5. **Community Features**
   - Posts and comments
   - Leaderboard

## 🚨 Common Issues and Solutions

### 1. Environment Variables Not Loaded
- Ensure all environment variables are set in your deployment platform
- Check that variable names match exactly

### 2. Database Connection Failed
- Verify `DATABASE_URL` format
- Check database credentials
- Ensure database is accessible from your deployment platform

### 3. API Routes Not Working
- Check server logs for errors
- Verify CORS configuration
- Ensure proper authentication headers

### 4. Google Vision API Not Working
- Verify service account key file is uploaded
- Check that Vision API is enabled in Google Cloud Console
- Ensure billing is enabled for your Google Cloud project

## 📈 Performance Optimization

### 1. Image Optimization
Next.js automatically optimizes images. Ensure your image hosting supports this.

### 2. Caching
Configure caching headers for static assets:
```toml
[[headers]]
  for = "/_next/static/*"
  [headers.values]
    cache-control = "public, max-age=31536000, immutable"
```

### 3. Bundle Optimization
- Use dynamic imports for large components
- Optimize images and assets
- Remove unused dependencies

## 🛡️ Security Considerations

1. **Environment Variables**
   - Never commit sensitive data to version control
   - Use deployment platform's environment variable management

2. **Authentication**
   - Use HTTPS only
   - Implement proper session management
   - Validate all user inputs

3. **Database**
   - Use connection pooling
   - Implement proper access controls
   - Regular backups

## 🆘 Support

If you encounter issues during deployment:

1. Check the deployment logs
2. Verify all environment variables
3. Test database connectivity
4. Ensure all required services are running
5. Contact your deployment platform's support if needed

## 🎉 Success!

Once deployed successfully, your AgriQuest application will be accessible to farmers and government officials, providing:

- Sustainable farming mission system
- AI-powered crop analysis
- Government auction platform
- Community features
- Gamification elements

The application will help farmers adopt sustainable practices while providing them access to government support programs through the auction system.