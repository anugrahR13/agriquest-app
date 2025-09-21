# AgriQuest Deployment Instructions

## Quick Start

To deploy AgriQuest to production:

1. **Ensure Prerequisites**:
   - Docker (v20.10 or higher)
   - Docker Compose (v1.29 or higher)

2. **Configure Environment**:
   - Edit `.env.production` and change the `JWT_SECRET` for security

3. **Deploy Application**:
   ```bash
   # On Linux/Mac
   chmod +x deploy.sh
   ./deploy.sh
   
   # On Windows
   deploy.bat
   ```

4. **Access Application**:
   - Open browser to http://localhost:3000

## Important Security Note

Before deploying to production, please change the default `JWT_SECRET` in `.env.production` to a strong, random secret.

## Need Help?

Refer to `DEPLOYMENT_GUIDE.md` for detailed instructions.