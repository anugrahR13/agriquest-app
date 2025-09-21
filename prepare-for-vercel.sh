#!/bin/bash

# Script to prepare AgriQuest for Vercel deployment

echo "🌱 Preparing AgriQuest for Vercel deployment..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
  echo "❌ Error: package.json not found. Please run this script from the project root directory."
  exit 1
fi

echo "✅ Found project files"

# Backup important files
echo "🔧 Creating backups..."
cp package.json package.json.backup
cp next.config.ts next.config.ts.backup
cp vercel.json vercel.json.backup

# Update dependencies to resolve deprecation warnings
echo "🔄 Updating dependencies..."
npm install

# Generate Prisma client
echo "🔧 Generating Prisma client..."
npm run db:generate

# Create a simple build test
echo "🔍 Testing build..."
npm run build

# Check for TypeScript errors
echo "🔍 Checking for TypeScript errors..."
npx tsc --noEmit

# Verify Git status
echo "🔍 Checking Git status..."
git status

echo "✅ Preparation complete!"
echo ""
echo "Next steps:"
echo "1. Set up a managed database (Supabase recommended)"
echo "2. Configure environment variables in Vercel dashboard"
echo "3. Push changes to GitHub"
echo "4. Deploy to Vercel"
echo ""
echo "For detailed instructions, see VERCEL_DEPLOY_SUCCESS.md"