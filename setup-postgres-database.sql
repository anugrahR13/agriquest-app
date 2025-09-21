-- Create the agriquest_dev database
CREATE DATABASE agriquest_dev;

-- Connect to the agriquest_dev database
\c agriquest_dev

-- Create the agriquest_user with password
CREATE USER agriquest_user WITH PASSWORD 'agriquest_password';

-- Grant privileges to the agriquest_user
GRANT ALL PRIVILEGES ON DATABASE agriquest_dev TO agriquest_user;

-- Grant privileges on schema
GRANT ALL ON SCHEMA public TO agriquest_user;

-- If you need to grant privileges on all tables in the public schema
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO agriquest_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO agriquest_user;

-- Set default privileges for future tables
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO agriquest_user;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO agriquest_user;