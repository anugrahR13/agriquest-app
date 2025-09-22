# 🚀 Easy Deployment Script for AgriQuest

## 🎯 Recommended: Railway.app Deployment (Easiest & Best Free Option)

### Step 1: Prepare Your Repository

```bash
# Initialize git if not already done
git init
git add .
git commit -m "Prepare for deployment"
```

### Step 2: Create GitHub Repository

1. Go to https://github.com/new
2. Create a new repository named "agriquest"
3. Follow the instructions to push your code:

```bash
git remote add origin https://github.com/yourusername/agriquest.git
git branch -M main
git push -u origin main
```

### Step 3: Deploy to Railway (Free Tier)

1. Go to [railway.app](https://railway.app)
2. Sign up with GitHub
3. Click "New Project" → "Deploy from GitHub repo"
4. Select your "agriquest" repository
5. Railway will auto-detect it's a Next.js app

### Step 4: Add PostgreSQL Database

1. In Railway dashboard, click "+ New" → "Database" → "PostgreSQL"
2. Railway automatically sets `DATABASE_URL` environment variable

### Step 5: Configure Environment Variables

In Railway → Your Project → Settings → Variables, add:

```
JWT_SECRET=your-random-jwt-secret-key-here-min-32-characters
GOOGLE_VISION_ENABLED=true
AI_IMPLEMENTATION=google-vision
NEXT_PUBLIC_API_URL=https://your-app-name.up.railway.app
```

### Step 6: Upload Google Service Account Key

1. Go to Settings → Variables
2. Add as Raw Text:
```
GOOGLE_APPLICATION_CREDENTIALS_JSON={"type":"service_account","project_id":"your-project",...}
```

### Step 7: Update Your Code for Railway

Create a new file `railway.toml` in your project root:

```toml
[build]
builder = "NIXPACKS"
buildCommand = "npm run build"

[deploy]
startCommand = "npm start"
restartPolicyType = "ON_FAILURE"
restartPolicyMaxRetries = 10
```

## 🛠️ Alternative: Render.com Deployment

### Step 1: Push to GitHub (if not done)

```bash
git init
git add .
git commit -m "Prepare for Render deployment"
git remote add origin https://github.com/yourusername/agriquest.git
git push -u origin main
```

### Step 2: Deploy to Render

1. Go to [render.com](https://render.com)
2. Sign up with GitHub
3. Create new Web Service
4. Connect to your GitHub repo
5. Set configuration:
   - Name: agriquest
   - Build command: `npm run build`
   - Start command: `npm start`
   - Environment: Node

### Step 3: Add PostgreSQL Database

1. Create new PostgreSQL database in Render
2. Copy the "External Database URL"
3. Add as environment variable in Web Service:
   `DATABASE_URL=your-postgresql-url`

### Step 4: Configure Environment Variables

In Environment → Add Environment Variables:
```
JWT_SECRET=your-random-secret-min-32-characters
GOOGLE_VISION_ENABLED=true
AI_IMPLEMENTATION=google-vision
NEXT_PUBLIC_API_URL=https://your-app.onrender.com
```

## 🔧 Fixing Common Vercel Issues

If you want to continue with Vercel, here are fixes for common issues:

### Issue 1: "Text Page" or Blank Page

Create/Update `next.config.js`:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['images.unsplash.com', 'storage.googleapis.com'],
  },
  // Handle environment variables
  env: {
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  },
  // Fix for server actions
  experimental: {
    serverActions: {
      allowedOrigins: ['localhost:3000', 'your-app.vercel.app'],
    },
  },
}

module.exports = nextConfig
```

### Issue 2: Environment Variables Not Set

In Vercel Dashboard:
1. Go to your project
2. Settings → Environment Variables
3. Add all required variables:

```
DATABASE_URL=your-postgresql-url
JWT_SECRET=your-random-secret-min-32-characters
GOOGLE_APPLICATION_CREDENTIALS=./config/service-account-key.json
GOOGLE_VISION_ENABLED=true
AI_IMPLEMENTATION=google-vision
NEXT_PUBLIC_API_URL=https://your-app.vercel.app
```

### Issue 3: Google Vision API Issues

For Vercel, you need to upload your service account key as a secret:

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Add your service account key as a secret
vercel secrets add google-service-account-key '{"type":"service_account","project_id":"your-project",...}'

# Then reference it in your environment variables
```

## 🎉 Quick Deployment Checklist

### Before Deployment:

- [ ] Push code to GitHub
- [ ] Create service account key for Google Vision API
- [ ] Prepare environment variables
- [ ] Test locally with `npm run dev`

### After Deployment:

- [ ] Verify all pages load correctly
- [ ] Test authentication flow
- [ ] Check API routes work
- [ ] Verify Google Vision integration
- [ ] Test database connections
- [ ] Confirm auction system works

## 🆘 Emergency Fixes

If nothing works, try this minimal deployment approach:

1. Create a new simple `pages/index.js`:

```javascript
export default function Home() {
  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h1>AgriQuest</h1>
      <p>Welcome to the sustainable farming platform!</p>
      <a href="/auth/login">Login</a> | <a href="/eoi">Express Interest</a>
    </div>
  );
}
```

2. Deploy this first to ensure the basic setup works
3. Gradually add back your full application

## 📞 Support

If you're still having issues:

1. Check deployment logs for specific error messages
2. Verify all environment variables are set
3. Ensure your database is accessible
4. Confirm Google Cloud setup is correct
5. Reach out to the platform's support team

## 🎯 Final Recommendation

For the smoothest deployment experience with minimal configuration:

1. **Use Railway.app** - $5/month credit, built-in PostgreSQL, easiest setup
2. **Push to GitHub first** - All platforms work better with version control
3. **Start with environment variables** - Most issues stem from missing configs
4. **Test locally before deploying** - `npm run dev` should work perfectly

The AgriQuest application is complex but deployable. The key is choosing the right platform and properly configuring environment variables.