# Installing PostgreSQL Locally

Since Docker is having issues, we'll install PostgreSQL directly on your system.

## Installation Steps

1. **Run the PostgreSQL Installer**
   - Navigate to your Downloads folder
   - Double-click on `postgresql-17.6-1-windows-x64.exe` to start the installation

2. **Installation Wizard Steps**
   - Welcome Screen: Click "Next"
   - Select Components: 
     - Keep all default selections checked:
       - PostgreSQL Server ✅
       - pgAdmin 4 ✅ (Recommended for database management)
       - Stack Builder ✅ (Optional, for additional tools)
     - Click "Next"
   - Installation Directory: Keep default, click "Next"
   - Data Directory: Keep default, click "Next"

3. **Set Password**
   - Set password to: `password` (to match your .env.local configuration)
   - Click "Next"

4. **Port Configuration**
   - Keep port as: `5432`
   - Click "Next"

5. **Locale**
   - Keep default locale, click "Next"

6. **Ready to Install**
   - Click "Next" to begin installation
   - Wait for installation to complete
   - Click "Finish" when done

## Configure Environment Variables

After installation, add PostgreSQL to your PATH:

1. Open System Properties → Advanced → Environment Variables
2. In System Variables, find and select "Path", then click "Edit"
3. Add the PostgreSQL bin directory:
   - Common paths (check which one exists on your system):
     - `C:\Program Files\PostgreSQL\17\bin`
     - `C:\Program Files\PostgreSQL\16\bin`
     - `C:\Program Files\PostgreSQL\15\bin`
   - To find the exact path:
     - Open File Explorer
     - Navigate to `C:\Program Files\PostgreSQL\`
     - Look for the version folder (e.g., 17, 16, 15)
     - Go into that folder and then into the `bin` subfolder
4. Click "OK" to save

## Create Database

After installation, create the database for AgriQuest:

1. Open Command Prompt or PowerShell as Administrator
2. Run the following command to connect to PostgreSQL:
   ```bash
   psql -U postgres
   ```
   (Password: `password`)

3. Create the database:
   ```sql
   CREATE DATABASE agriquest_dev;
   ```

4. Exit PostgreSQL:
   ```sql
   \q
   ```

## Test Connection

From your AgriQuest project directory, test the connection:
```bash
node test-db-connection.js
```

## Run Database Migrations

After successful connection, run the database migrations:
```bash
npm run db:migrate
npm run db:generate
```

## Start the Application

Finally, start the application:
```bash
npm run dev:full
```