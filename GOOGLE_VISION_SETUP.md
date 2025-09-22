# Google Vision API Setup Guide

## Overview
The AgriQuest application supports both TensorFlow.js (client-side) and Google Vision API (server-side) for plant health analysis. This document explains how to properly set up and use the Google Vision API implementation.

## Current Implementation Status

### ✅ Installed and Working
- Google Cloud Vision API client library (`@google-cloud/vision`) is properly installed
- The AI analysis utility (`server/utils/aiAnalysis.ts`) correctly implements both TensorFlow.js and Google Vision API
- Fallback mechanism works properly when Google Vision credentials are not available

### ⚠️ Configuration Required
- Google Cloud service account credentials are missing
- Environment variables need to be configured

## Setting Up Google Vision API

### 1. Create a Google Cloud Project
1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable billing for the project

### 2. Enable the Vision API
1. In the Google Cloud Console, navigate to "APIs & Services" > "Library"
2. Search for "Vision API"
3. Click on "Cloud Vision API" and press "Enable"

### 3. Create a Service Account
1. Go to "IAM & Admin" > "Service Accounts"
2. Click "Create Service Account"
3. Give it a name (e.g., "agriquest-vision")
4. Grant it the "Project" > "Editor" role
5. Click "Done"

### 4. Create and Download Service Account Key
1. Click on the service account you just created
2. Go to the "Keys" tab
3. Click "Add Key" > "Create new key"
4. Select "JSON" format and click "Create"
5. Save the downloaded JSON file securely

### 5. Configure Environment Variables
Update your `.env.local` file with the following:

```env
# Enable Google Vision API
GOOGLE_VISION_ENABLED=true

# Path to your service account key file
GOOGLE_APPLICATION_CREDENTIALS=./config/google-vision-key.json

# AI Implementation (optional - defaults to tfjs)
AI_IMPLEMENTATION=google-vision
```

### 6. Place the Key File
Create a `config` directory in your project root and place the downloaded JSON key file there, renaming it to `google-vision-key.json`:

```
agriquest-app/
├── config/
│   └── google-vision-key.json  ← Place your key file here
├── src/
├── server/
└── ...
```

## API Implementation Details

### How It Works
The AI analysis utility (`server/utils/aiAnalysis.ts`) provides a unified interface that can switch between implementations based on environment configuration:

1. When `GOOGLE_VISION_ENABLED=true`, it uses Google Vision API
2. When `GOOGLE_VISION_ENABLED=false` or if Google Vision fails, it falls back to TensorFlow.js
3. If both fail, it uses a mock implementation

### API Endpoints
A new API route has been created at `/api/crop-analysis` to handle image analysis requests:

```bash
POST /api/crop-analysis
Content-Type: application/json

{
  "imageUrl": "https://example.com/plant-image.jpg"
}
```

Response:
```json
{
  "message": "Crop analysis completed successfully",
  "analysis": {
    "healthScore": 85,
    "leafColor": "GREEN",
    "density": 78,
    "diseaseDetected": false,
    "growthPercent": 82,
    "canopyCover": 85,
    "recommendations": [
      "Maintain current care routine for optimal growth",
      "Monitor for pests and diseases regularly",
      "Ensure proper spacing between plants for air circulation",
      "Mulch around plants to retain soil moisture"
    ]
  }
}
```

## Testing the Implementation

### Automated Testing
Run the verification script to check if all components are properly installed:

```bash
npm run verify-setup
```

### Manual Testing
Use the test script to verify Google Vision functionality:

```bash
npx ts-node test-google-vision.ts
```

## Troubleshooting

### Common Issues

1. **"Could not load the default credentials"**
   - Ensure `GOOGLE_APPLICATION_CREDENTIALS` points to the correct JSON key file
   - Verify the key file exists and is readable

2. **"API key not valid"**
   - Check that the Vision API is enabled in your Google Cloud project
   - Verify that billing is enabled for your project

3. **"Permission denied"**
   - Ensure your service account has the necessary permissions
   - Check that the key file hasn't expired

### Fallback Behavior
If Google Vision API is not properly configured, the system will automatically fall back to:
1. TensorFlow.js (if models are available)
2. Mock implementation (if both above fail)

This ensures the application remains functional even when external services are not available.

## Security Considerations

1. **Keep credentials secure**
   - Never commit service account keys to version control
   - Use environment variables for configuration
   - Rotate keys periodically

2. **Limit permissions**
   - Grant only the minimum required permissions to service accounts
   - Use dedicated service accounts for different applications

3. **Monitor usage**
   - Regularly check API usage in the Google Cloud Console
   - Set up billing alerts to avoid unexpected charges

## Performance Considerations

1. **Caching**
   - Consider caching analysis results to reduce API calls
   - Implement rate limiting to prevent excessive API usage

2. **Error Handling**
   - The system includes robust error handling and fallback mechanisms
   - Always handle API errors gracefully in your frontend code

3. **Cost Management**
   - Monitor your Google Cloud billing
   - The Vision API has free tiers but charges apply for heavy usage