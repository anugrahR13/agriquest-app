/**
 * Script to verify Google Cloud setup for Vision API
 */

const { exec } = require('child_process');

function runCommand(command) {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        reject(error);
      } else {
        resolve({ stdout, stderr });
      }
    });
  });
}

async function verifyGoogleCloudSetup() {
  console.log('Verifying Google Cloud setup...\n');
  
  try {
    // Check if gcloud is installed
    console.log('1. Checking if gcloud is installed...');
    const gcloudVersion = await runCommand('gcloud --version');
    console.log('✅ gcloud is installed');
    console.log(gcloudVersion.stdout.split('\n')[0]); // First line only
    
    // Check if authenticated
    console.log('\n2. Checking authentication...');
    try {
      const authList = await runCommand('gcloud auth list');
      console.log('✅ gcloud authentication is set up');
      console.log(authList.stdout);
    } catch (error) {
      console.log('ℹ️  Not authenticated with gcloud (this is OK if using service account key)');
    }
    
    // Check project configuration
    console.log('3. Checking project configuration...');
    try {
      const projectConfig = await runCommand('gcloud config list');
      const projectLines = projectConfig.stdout.split('\n');
      const projectLine = projectLines.find(line => line.includes('project ='));
      if (projectLine) {
        console.log('✅ Project configured:', projectLine.trim());
      } else {
        console.log('ℹ️  No project configured in gcloud');
      }
    } catch (error) {
      console.log('ℹ️  Unable to check project configuration');
    }
    
    // Check service account key file
    console.log('\n4. Checking service account key file...');
    const fs = require('fs');
    const keyFilePath = './config/service-account-key.json';
    
    if (fs.existsSync(keyFilePath)) {
      const keyData = JSON.parse(fs.readFileSync(keyFilePath, 'utf8'));
      console.log('✅ Service account key file found');
      console.log('   Project ID:', keyData.project_id);
      console.log('   Client Email:', keyData.client_email);
      console.log('   Private Key ID:', keyData.private_key_id);
    } else {
      console.log('❌ Service account key file not found at', keyFilePath);
      return;
    }
    
    console.log('\n🔧 Manual verification steps:');
    console.log('1. Go to Google Cloud Console: https://console.cloud.google.com/');
    console.log('2. Select your project (reference-flux-472907-i7)');
    console.log('3. Navigate to "APIs & Services" > "Library"');
    console.log('4. Search for "Vision API" and ensure it is enabled');
    console.log('5. Navigate to "Billing" and ensure a billing account is linked');
    console.log('6. Navigate to "IAM & Admin" > "Service Accounts"');
    console.log('7. Verify your service account has the "Editor" role or "Vision API User" role');
    
  } catch (error) {
    console.error('Error during verification:', error.message);
    console.log('\nℹ️  This might be because gcloud CLI is not installed or not in PATH');
    console.log('You can still use the service account key method for authentication');
  }
}

// Run the verification
verifyGoogleCloudSetup();