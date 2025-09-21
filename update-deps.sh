#!/bin/bash

# Script to update deprecated dependencies in AgriQuest

echo "🌱 Updating AgriQuest dependencies to resolve deprecation warnings..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
  echo "❌ Error: package.json not found. Please run this script from the project root directory."
  exit 1
fi

echo "✅ Found project files"

# Backup package.json
echo "🔧 Creating backup of package.json..."
cp package.json package.json.backup

# Update dependencies with known deprecations
echo "🔄 Updating dependencies..."

# Update workbox-webpack-plugin (check for newer versions)
npm outdated workbox-webpack-plugin

# Update rollup dependencies
npm uninstall rollup-plugin-terser
npm install --save-dev @rollup/plugin-terser

# Update sourcemap-codec
npm uninstall sourcemap-codec

# Update inflight
npm uninstall inflight

# Update glob dependencies
# Note: These are likely dependencies of other packages, so we need to update the parent packages

# Update source-map
npm uninstall source-map
# This might be a dependency of another package

echo "📦 Running npm install to update all dependencies..."
npm install

echo "🔍 Checking for remaining outdated dependencies..."
npm outdated

echo "✅ Dependency update process completed!"
echo "📝 Notes:"
echo "  - Some warnings may persist if they come from nested dependencies"
echo "  - Check package.json.backup if you need to restore the original configuration"
echo "  - Run 'npm test' to ensure everything still works correctly"