@echo off
title AgriQuest Dependency Update

echo 🌱 Updating AgriQuest dependencies to resolve deprecation warnings...
echo.

REM Check if we're in the right directory
if not exist "package.json" (
  echo ❌ Error: package.json not found. Please run this script from the project root directory.
  pause
  exit /b 1
)

echo ✅ Found project files

REM Backup package.json
echo 🔧 Creating backup of package.json...
copy package.json package.json.backup

REM Update dependencies with known deprecations
echo 🔄 Updating dependencies...

REM Update rollup dependencies
echo Removing rollup-plugin-terser...
call npm uninstall rollup-plugin-terser

echo Installing @rollup/plugin-terser...
call npm install --save-dev @rollup/plugin-terser

REM Update sourcemap-codec
echo Removing sourcemap-codec...
call npm uninstall sourcemap-codec

REM Update inflight
echo Removing inflight...
call npm uninstall inflight

REM Update source-map
echo Removing source-map...
call npm uninstall source-map

echo 📦 Running npm install to update all dependencies...
call npm install

echo 🔍 Checking for remaining outdated dependencies...
call npm outdated

echo ✅ Dependency update process completed!
echo 📝 Notes:
echo   - Some warnings may persist if they come from nested dependencies
echo   - Check package.json.backup if you need to restore the original configuration
echo   - Run 'npm test' to ensure everything still works correctly
echo.
pause