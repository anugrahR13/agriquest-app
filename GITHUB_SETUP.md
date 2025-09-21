# GitHub Repository Setup for AgriQuest

This guide will help you create a GitHub repository for the AgriQuest application and push your code.

## Step 1: Create a GitHub Repository

1. Go to [github.com](https://github.com) and log in to your account
2. Click the "+" icon in the top right corner
3. Select "New repository"
4. Fill in the repository details:
   - **Repository name**: `agriquest-app`
   - **Description**: `AgriQuest - Gamified Sustainable Farming Platform`
   - **Public or Private**: Choose your preference
   - **IMPORTANT**: Leave all checkboxes **UNCHECKED** (no README, no .gitignore, no license)
5. Click "Create repository"

## Step 2: Get Your Repository URL

After creating the repository, you'll see a page with setup instructions. Note your repository URL, which will look like:
```
https://github.com/YOUR_USERNAME/agriquest-app.git
```

## Step 3: Connect Your Local Repository

Run one of the setup scripts:

### On Windows (Command Prompt):
```
setup-github.bat
```

### On Windows (PowerShell):
```
.\setup-github.ps1
```

### Manual Setup:
If you prefer to do it manually:

1. Open a terminal/command prompt
2. Navigate to your project directory:
   ```bash
   cd "c:\Users\venum\agriquest app\agriquest-app"
   ```

3. Add the remote repository (replace YOUR_USERNAME with your actual GitHub username):
   ```bash
   git remote remove origin
   git remote add origin https://github.com/YOUR_USERNAME/agriquest-app.git
   ```

4. Push your code:
   ```bash
   git add .
   git commit -m "Initial commit: AgriQuest application"
   git branch -M main
   git push -u origin main
   ```

## Step 4: Verify the Push

After pushing, refresh your GitHub repository page. You should see all your AgriQuest code files.

## Troubleshooting

### If you get "Authentication failed":
1. Make sure you're using the correct username in the URL
2. Try using GitHub CLI for authentication:
   ```bash
   gh auth login
   ```

### If you get "Permission denied":
1. Make sure you're the owner of the repository
2. Check that you have write permissions

### If you get "Repository not found":
1. Double-check the repository URL
2. Make sure the repository exists on GitHub
3. Verify your GitHub username is correct

## Next Steps

After successfully pushing your code to GitHub:

1. **Deploy to Vercel**:
   - Go to [vercel.com](https://vercel.com)
   - Sign up or log in
   - Click "New Project"
   - Import your GitHub repository
   - Deploy with one click

2. **Share with Teammates**:
   - Invite teammates to your GitHub repository
   - Share the Vercel deployment URL
   - Teammates can clone the repository and run locally

## Need Help?

If you encounter any issues during the setup process, please check:
1. Your internet connection
2. GitHub account credentials
3. Repository name and username spelling
4. Git installation on your system