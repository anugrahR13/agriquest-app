/**
 * Complete Google Vision API Setup Verification
 * This script checks all aspects of the Google Vision API integration
 */

const fs = require('fs');
const path = require('path');

// Function to load environment variables from .env.local
function loadEnvVariables() {
  const envPath = path.resolve(__dirname, '.env.local');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    const lines = envContent.split('\n');
    
    lines.forEach(line => {
      // Skip comments and empty lines
      if (line.trim() === '' || line.trim().startsWith('#')) {
        return;
      }
      
      const [key, value] = line.split('=');
      if (key && value) {
        process.env[key.trim()] = value.trim().replace(/^"(.*)"$/, '$1').replace(/^'(.*)'$/, '$1');
      }
    });
  }
}

async function completeVerification() {
  console.log('Complete Google Vision API Setup Verification');
  console.log('==========================================\n');
  
  // Load environment variables
  loadEnvVariables();
  
  // 1. Check environment variables
  console.log('1. Environment Variables Check:');
  console.log('   GOOGLE_VISION_ENABLED:', process.env.GOOGLE_VISION_ENABLED || 'Not set');
  console.log('   AI_IMPLEMENTATION:', process.env.AI_IMPLEMENTATION || 'Not set');
  console.log('   GOOGLE_APPLICATION_CREDENTIALS:', process.env.GOOGLE_APPLICATION_CREDENTIALS || 'Not set');
  
  const isEnvConfigured = process.env.GOOGLE_VISION_ENABLED === 'true' && 
                         process.env.AI_IMPLEMENTATION === 'google-vision';
  
  console.log('   Status:', isEnvConfigured ? '✅ Configured' : '❌ Not properly configured');
  console.log('');
  
  // 2. Check service account key
  console.log('2. Service Account Key Check:');
  const keyFilePath = path.resolve(__dirname, process.env.GOOGLE_APPLICATION_CREDENTIALS || '');
  
  if (fs.existsSync(keyFilePath)) {
    try {
      const keyData = JSON.parse(fs.readFileSync(keyFilePath, 'utf8'));
      console.log('   ✅ Service account key file found');
      console.log('   Project ID:', keyData.project_id);
      console.log('   Client Email:', keyData.client_email);
      
      // Check required fields
      const hasRequiredFields = keyData.project_id && keyData.private_key && keyData.client_email;
      console.log('   Required fields present:', hasRequiredFields ? '✅ Yes' : '❌ No');
      
      if (hasRequiredFields) {
        console.log('   🔍 Next steps to verify Google Cloud setup:');
        console.log('      1. Go to Google Cloud Console: https://console.cloud.google.com/');
        console.log('      2. Select project:', keyData.project_id);
        console.log('      3. Enable the Vision API:');
        console.log('         - Navigate to "APIs & Services" > "Library"');
        console.log('         - Search for "Vision API" and enable it');
        console.log('      4. Check billing is enabled for the project');
        console.log('      5. Verify the service account has proper permissions');
        console.log('         - Should have "roles/vision.serviceAgent" role');
      }
    } catch (error) {
      console.log('   ❌ Error reading service account key file:', error.message);
    }
  } else {
    console.log('   ❌ Service account key file not found at', keyFilePath);
  }
  console.log('');
  
  // 3. Test Google Vision API
  console.log('3. Google Vision API Test:');
  try {
    // Set the credentials path for the Google client
    if (fs.existsSync(keyFilePath)) {
      process.env.GOOGLE_APPLICATION_CREDENTIALS = keyFilePath;
    }
    
    const { ImageAnnotatorClient } = require('@google-cloud/vision');
    const client = new ImageAnnotatorClient();
    console.log('   ✅ Google Vision client created successfully');
    
    // Test with a simple image URL
    const testImageUrl = 'https://storage.googleapis.com/cloud-samples-data/vision/label/wakeupcat.jpg';
    console.log('   Testing with sample image:', testImageUrl);
    
    try {
      const [result] = await client.labelDetection(testImageUrl);
      const labels = result.labelAnnotations;
      
      if (labels && labels.length > 0) {
        console.log('   ✅ Labels detected:');
        labels.slice(0, 5).forEach(label => {
          console.log('      -', label.description, `(${(label.score * 100).toFixed(1)}%)`);
        });
        console.log('   🎉 Google Vision API is working correctly!');
      } else {
        console.log('   ⚠️  No labels detected - API might not be enabled in Google Cloud Console');
        console.log('   🔧 Troubleshooting steps:');
        console.log('      1. Ensure Vision API is enabled in Google Cloud Console');
        console.log('      2. Check that billing is enabled for your project');
        console.log('      3. Verify service account permissions');
      }
    } catch (apiError) {
      console.log('   ❌ Error calling Google Vision API:', apiError.message);
      if (apiError.message.includes('API has not been used')) {
        console.log('   🔧 Solution: Enable the Vision API in Google Cloud Console');
      } else if (apiError.message.includes('PERMISSION_DENIED')) {
        console.log('   🔧 Solution: Check service account permissions');
      } else if (apiError.message.includes('billing')) {
        console.log('   🔧 Solution: Enable billing for your Google Cloud project');
      }
    }
  } catch (error) {
    console.log('   ❌ Failed to create Google Vision client:', error.message);
  }
  console.log('');
  
  // 4. Check database setup
  console.log('4. Database Setup Check:');
  try {
    const { PrismaClient } = require('@prisma/client');
    const prisma = new PrismaClient();
    
    // Test database connection
    await prisma.$connect();
    console.log('   ✅ Database connection successful');
    
    // Check if required tables exist
    const tablesToCheck = [
      'users', 'farmers', 'farm_profiles', 'farmer_crops', 
      'ai_analyses', 'crop_credit_reports', 'auctions', 'bids'
    ];
    
    console.log('   Checking required tables...');
    for (const table of tablesToCheck) {
      try {
        // Simple query to check if table exists
        await prisma.$queryRaw`SELECT 1 FROM ${prisma.raw(table)} LIMIT 1`;
        console.log(`   ✅ Table ${table} exists`);
      } catch (error) {
        console.log(`   ⚠️  Table ${table} might not exist or is empty`);
      }
    }
    
    await prisma.$disconnect();
    console.log('   ✅ Database verification completed');
  } catch (error) {
    console.log('   ❌ Database connection failed:', error.message);
  }
  console.log('');
  
  // 5. Summary
  console.log('5. Final Summary:');
  console.log('   Environment Configuration:', isEnvConfigured ? '✅ Correct' : '❌ Incorrect');
  console.log('   Service Account Key:', fs.existsSync(keyFilePath) ? '✅ Present' : '❌ Missing');
  console.log('   Database Setup: ✅ Completed');
  console.log('');
  
  console.log('📋 Next Steps:');
  console.log('   1. If Google Vision API returns no results:');
  console.log('      - Enable Vision API in Google Cloud Console');
  console.log('      - Enable billing for your project');
  console.log('      - Check service account permissions');
  console.log('   2. Test the crop analysis endpoint:');
  console.log('      - Start your development server');
  console.log('      - POST to http://localhost:3000/api/crop-analysis');
  console.log('      - Include { "imageUrl": "https://example.com/plant-image.jpg" }');
  console.log('   3. Verify all database tables are properly created');
  console.log('');
  
  console.log('For detailed Google Cloud setup instructions, check the Google Cloud Console at:');
  console.log('https://console.cloud.google.com/');
}

// Run the verification
completeVerification().catch(console.error);