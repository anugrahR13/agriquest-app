const { exec } = require('child_process');
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

// Load environment variables
loadEnvVariables();

console.log('DATABASE_URL:', process.env.DATABASE_URL);

// Run Prisma migration
exec('npx prisma migrate dev --name init', (error, stdout, stderr) => {
  if (error) {
    console.error(`Error: ${error.message}`);
    return;
  }
  if (stderr) {
    console.error(`Stderr: ${stderr}`);
    return;
  }
  console.log(`Stdout: ${stdout}`);
});