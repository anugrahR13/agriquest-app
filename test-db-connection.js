const { Client } = require('pg');
require('dotenv').config({ path: '.env.local' });

async function testDBConnection() {
  console.log('Testing PostgreSQL connection...');
  
  // Test with Docker credentials
  const dockerClient = new Client({
    host: 'localhost',
    port: 5432,
    database: 'agriquest_db',
    user: 'agriquest_user',
    password: 'agriquest_password',
  });
  
  // Test with local credentials
  const localClient = new Client({
    connectionString: process.env.DATABASE_URL,
  });
  
  try {
    await dockerClient.connect();
    console.log('✅ Successfully connected to PostgreSQL database (Docker)');
    
    // Run a simple query to test
    const result = await dockerClient.query('SELECT version()');
    console.log('Database version:', result.rows[0].version);
    
    await dockerClient.end();
    console.log('✅ Docker database connection test completed successfully');
  } catch (error) {
    console.log('❌ Failed to connect to PostgreSQL database (Docker):', error.message);
    
    try {
      await localClient.connect();
      console.log('✅ Successfully connected to PostgreSQL database (Local)');
      
      // Run a simple query to test
      const result = await localClient.query('SELECT version()');
      console.log('Database version:', result.rows[0].version);
      
      await localClient.end();
      console.log('✅ Local database connection test completed successfully');
    } catch (localError) {
      console.error('❌ Failed to connect to PostgreSQL database (Local):', localError.message);
      
      // Provide troubleshooting steps
      console.log('\nTroubleshooting steps:');
      console.log('1. Ensure PostgreSQL is running on localhost:5432');
      console.log('2. Verify credentials in .env.local file');
      console.log('3. If not installed, install PostgreSQL or use Docker:');
      console.log('   - Run: docker-compose up -d');
      console.log('   - Or install PostgreSQL locally');
    }
  }
}

testDBConnection();