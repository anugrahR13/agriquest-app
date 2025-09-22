# Google Vision API Integration Steps

## Overview
This document provides step-by-step instructions to complete the Google Vision API integration in your AgriQuest application.

## Steps to Complete Integration

### 1. Place Your Service Account Key File
First, you need to place your downloaded service account JSON file in the correct location:

1. Navigate to the location where you downloaded your service account JSON file
2. Copy the file to: `c:\Users\venum\agriquest app\agriquest-app\config\`
3. Rename the file to: `service-account-key.json`

### 2. Verify Environment Variables
Ensure your `.env.local` file has the correct configuration:

```env
# AI Configuration
GOOGLE_APPLICATION_CREDENTIALS=./config/service-account-key.json
GOOGLE_VISION_ENABLED=true
AI_IMPLEMENTATION=google-vision
```

### 3. Test the Integration
Run the test scripts to verify that everything is working properly:

1. First, test the Google Vision integration directly:
   ```bash
   cd "c:\Users\venum\agriquest app\agriquest-app"
   npx ts-node test-google-vision-integration.js
   ```

2. Then, test the crop analysis API endpoint:
   ```bash
   # Make sure your development server is running first:
   # cd "c:\Users\venum\agriquest app\agriquest-app" && npm run dev
   
   # In a separate terminal, run:
   node test-crop-analysis-api.js
   ```

### 4. Restart Development Server
After making these changes, restart your development server to ensure the new environment variables are loaded:

1. Stop the current development server (Ctrl+C)
2. Start it again:
   ```bash
   cd "c:\Users\venum\agriquest app\agriquest-app"
   npm run dev
   ```

## Expected Results

When the integration is successful, you should see:

1. **Direct Google Vision Test**: The script should return a detailed analysis of the sample plant image with a health score, disease detection status, and recommendations.

2. **API Endpoint Test**: The API should return a JSON response with the analysis results when called.

## Troubleshooting

### Common Issues and Solutions

1. **"Could not load the default credentials" Error**
   - Ensure the service account key file is in the correct location
   - Verify the filename is exactly `service-account-key.json`
   - Check that the `GOOGLE_APPLICATION_CREDENTIALS` path in `.env.local` is correct

2. **"API key not valid" Error**
   - Make sure you've enabled the Vision API in your Google Cloud Console
   - Verify that billing is enabled for your Google Cloud project

3. **"Permission denied" Error**
   - Ensure your service account has the necessary permissions (Project Editor role is recommended)
   - Check that the key file hasn't expired

### Verifying Google Cloud Setup

1. **Check if Vision API is Enabled**:
   - Go to the Google Cloud Console
   - Navigate to "APIs & Services" > "Library"
   - Search for "Vision API" and ensure it's enabled

2. **Verify Billing**:
   - Go to the Google Cloud Console
   - Navigate to "Billing"
   - Ensure a billing account is linked to your project

3. **Check Service Account Permissions**:
   - Go to "IAM & Admin" > "Service Accounts"
   - Verify your service account has the necessary permissions

## Using Google Vision in the Application

Once integration is complete, the application will automatically use Google Vision API for:

1. **Crop Health Analysis**: When users upload images for analysis
2. **Disease Detection**: Identifying plant diseases from images
3. **Growth Monitoring**: Tracking plant growth over time

The system includes fallback mechanisms:
- Primary: Google Vision API (when properly configured)
- Secondary: TensorFlow.js (client-side analysis)
- Fallback: Mock implementation (when both above fail)

This ensures the application remains functional regardless of external service availability.

## Security Considerations

1. **Keep credentials secure**:
   - Never commit service account keys to version control
   - Use environment variables for configuration
   - Rotate keys periodically

2. **Limit permissions**:
   - Grant only the minimum required permissions to service accounts
   - Use dedicated service accounts for different applications

3. **Monitor usage**:
   - Regularly check API usage in the Google Cloud Console
   - Set up billing alerts to avoid unexpected charges