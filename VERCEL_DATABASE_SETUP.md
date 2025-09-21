# Database Setup for Vercel Deployment

## Option 1: Use Supabase (Recommended)

Supabase is a great choice for Vercel deployments because:
- Built-in PostgreSQL database
- Easy integration with Next.js
- Free tier available
- Good documentation

### Setup Steps:

1. Go to https://supabase.com/ and create an account
2. Create a new project
3. Get your database connection string from the Supabase dashboard
4. In your Vercel project settings, add this environment variable:
   ```
   DATABASE_URL=postgresql://[USER]:[PASSWORD]@[HOST]:[PORT]/[DATABASE]
   ```

### Update Prisma Schema:

Modify your `prisma/schema.prisma` file:

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}
```

### Run Migrations:

After setting up your Supabase database:

```bash
npx prisma generate
npx prisma migrate deploy
```

## Option 2: Use PlanetScale

PlanetScale is a serverless MySQL platform that works well with Vercel.

### Setup Steps:

1. Go to https://planetscale.com/ and create an account
2. Create a new database
3. Create a password for your database
4. In your Vercel project settings, add this environment variable:
   ```
   DATABASE_URL=mysql://[USERNAME]:[PASSWORD]@[HOST]/[DATABASE]?sslaccept=strict
   ```

### Update Prisma Schema:

Modify your `prisma/schema.prisma` file:

```prisma
datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}
```

## Option 3: Use Vercel Postgres (if available)

If you have access to Vercel Postgres:

1. Enable Vercel Postgres in your Vercel dashboard
2. Get your connection string from the Vercel dashboard
3. Add it as an environment variable in Vercel:
   ```
   DATABASE_URL=your_vercel_postgres_connection_string
   ```

## Option 4: Use Railway

Railway provides a simple PostgreSQL service that works well with Vercel.

### Setup Steps:

1. Go to https://railway.app/ and create an account
2. Create a new project
3. Add a PostgreSQL database
4. Get your connection string from the Railway dashboard
5. In your Vercel project settings, add this environment variable:
   ```
   DATABASE_URL=your_railway_postgres_connection_string
   ```

## Environment Variables Required

Regardless of which database provider you choose, you'll need these environment variables in Vercel:

```
DATABASE_URL=your_database_connection_string
JWT_SECRET=your_secure_jwt_secret
NEXT_PUBLIC_APP_URL=https://your-app-name.vercel.app
NEXT_PUBLIC_API_URL=https://your-app-name.vercel.app/api
NODE_ENV=production
```

## Testing Your Database Connection

Before deploying, test your database connection locally:

1. Update your local `.env.local` file with the new DATABASE_URL
2. Run:
   ```bash
   npx prisma generate
   npx prisma migrate deploy
   ```
3. Test your API endpoints locally

## Troubleshooting

### Connection Issues:
- Verify your database is accessible from the internet
- Check if you need to whitelist IP addresses
- Ensure your connection string is correct

### Migration Errors:
- Make sure your Prisma schema matches your database provider
- Run `npx prisma migrate reset` if you need to start fresh
- Check that your database user has the necessary permissions

### Performance Issues:
- Consider using connection pooling
- Optimize your queries
- Use database indexes appropriately