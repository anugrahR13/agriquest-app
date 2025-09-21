# Easy Deployment Options for AgriQuest

This guide provides simple ways to deploy the AgriQuest application for sharing with teammates.

## Option 1: Vercel (Recommended for Ease of Use)

### Prerequisites
- GitHub account
- Vercel account (free)

### Steps
1. **Push code to GitHub**
   ```bash
   git add .
   git commit -m "Prepare for deployment"
   git push origin main
   ```

2. **Deploy to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Sign up or log in
   - Click "New Project"
   - Import your GitHub repository
   - Vercel will automatically detect it's a Next.js app
   - Click "Deploy"

3. **Configure Environment Variables** (in Vercel dashboard)
   - Go to your project settings
   - Navigate to "Environment Variables"
   - Add these variables:
     ```
     NEXT_PUBLIC_APP_URL=https://your-project.vercel.app
     NEXT_PUBLIC_API_URL=https://your-project.vercel.app/api
     ```

### Advantages
- Zero configuration
- Automatic SSL
- Global CDN
- Preview deployments for each PR
- Free tier available

## Option 2: Railway

### Prerequisites
- GitHub account
- Railway account (free)

### Steps
1. **Push code to GitHub** (if not already done)
   ```bash
   git add .
   git commit -m "Prepare for Railway deployment"
   git push origin main
   ```

2. **Deploy to Railway**
   - Go to [railway.app](https://railway.app)
   - Sign up or log in
   - Click "New Project"
   - Select "Deploy from GitHub"
   - Choose your repository
   - Railway will automatically detect the project settings
   - Click "Deploy"

3. **Configure Environment Variables**
   - Go to your project
   - Click on your service
   - Go to "Variables"
   - Add these variables:
     ```
     NODE_ENV=production
     NEXT_PUBLIC_APP_URL=https://your-project.up.railway.app
     NEXT_PUBLIC_API_URL=https://your-project.up.railway.app/api
     ```

### Advantages
- Simple interface
- Free tier with good resources
- Built-in database hosting
- Easy environment management

## Option 3: Render

### Prerequisites
- GitHub account
- Render account (free)

### Steps
1. **Push code to GitHub** (if not already done)
   ```bash
   git add .
   git commit -m "Prepare for Render deployment"
   git push origin main
   ```

2. **Deploy to Render**
   - Go to [render.com](https://render.com)
   - Sign up or log in
   - Click "New +" and select "Web Service"
   - Connect your GitHub account
   - Select your repository
   - Configure settings:
     - Name: agriquest-app
     - Environment: Node
     - Build command: `npm install; npm run build`
     - Start command: `npm run start`
   - Click "Create Web Service"

3. **Configure Environment Variables**
   - In the service settings, go to "Environment"
   - Add these variables:
     ```
     NODE_ENV=production
     NEXT_PUBLIC_APP_URL=https://agriquest-app.onrender.com
     NEXT_PUBLIC_API_URL=https://agriquest-app.onrender.com/api
     ```

### Advantages
- Generous free tier
- Simple configuration
- Automatic SSL
- Easy scaling options

## Option 4: Netlify (Alternative)

### Prerequisites
- GitHub account
- Netlify account (free)

### Steps
1. **Push code to GitHub** (if not already done)
   ```bash
   git add .
   git commit -m "Prepare for Netlify deployment"
   git push origin main
   ```

2. **Deploy to Netlify**
   - Go to [netlify.com](https://netlify.com)
   - Sign up or log in
   - Click "Add new site" → "Import an existing project"
   - Connect to GitHub
   - Select your repository
   - Configure build settings:
     - Build command: `npm run build`
     - Publish directory: `.next`
   - Click "Deploy site"

### Note
Netlify is primarily for static sites, so for full Next.js functionality with API routes, Vercel is recommended.

## Sharing with Teammates

Once deployed, you can easily share the application with teammates:

1. **Vercel**: Share the deployed URL (e.g., `https://your-project.vercel.app`)
2. **Railway**: Share the deployed URL (e.g., `https://your-project.up.railway.app`)
3. **Render**: Share the deployed URL (e.g., `https://agriquest-app.onrender.com`)

## Demo Account Access

All deployment methods will include the demo account:
- Phone: `9876543210`
- OTP: `123456`

## Collaborative Development

For collaborative development:
1. Use GitHub for version control
2. Create feature branches for different teammates
3. Use pull requests for code review
4. Each teammate can have their own preview deployment

## Environment Variables for Team Sharing

When sharing with teammates, provide them with a `.env.local` file containing:
```env
# Database (for local development)
DATABASE_URL=postgresql://username:password@localhost:5432/agriquest_db

# JWT Configuration
JWT_SECRET=agriquest-super-secret-jwt-key-change-in-production

# App Configuration
NODE_ENV=development
PORT=3000
NEXT_PUBLIC_API_URL=http://localhost:3000/api
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Troubleshooting

### Common Issues
1. **Build Failures**: Check logs in the deployment platform
2. **Environment Variables**: Ensure all required variables are set
3. **Database Connection**: For simple sharing, you might use a shared database URL

### Quick Local Testing
Teammates can also run locally:
```bash
git clone <your-repo-url>
cd agriquest-app
npm install
npm run dev
```

## Recommendation

For the easiest and fastest deployment with team sharing:
1. **Use Vercel** - It's specifically designed for Next.js apps
2. **Push to GitHub** - Enables automatic deployments
3. **Share the URL** - Instant access for all teammates
4. **Use Preview Deployments** - Each PR gets its own URL for testing

This approach requires minimal setup and provides the best experience for team collaboration.