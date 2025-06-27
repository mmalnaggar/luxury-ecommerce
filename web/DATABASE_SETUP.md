# 🗄️ Production Database Setup Guide

## Option A: Vercel Postgres (Recommended)

### Step 1: Create Vercel Postgres Database
1. Go to your Vercel dashboard: https://vercel.com/dashboard
2. Click on your project: `luxury-ecommerce`
3. Navigate to **Storage** tab
4. Click **"Create Database"**
5. Select **Postgres**
6. Choose your preferred region
7. Click **"Create"**

### Step 2: Get Connection String
1. Once created, click on your database
2. Go to **Settings** tab
3. Copy the **Connection String**
4. It will look like: `postgresql://username:password@host:port/database`

### Step 3: Add to GitHub Secrets
1. Go to: https://github.com/mmalnaggar/luxury-ecommerce/settings/secrets/actions
2. Add new secret: `DATABASE_URL`
3. Value: Your connection string from Step 2

## Option B: External Database Providers

### Railway (railway.app)
1. Sign up at railway.app
2. Create new project
3. Add PostgreSQL service
4. Copy connection string
5. Add to GitHub secrets

### Supabase (supabase.com)
1. Sign up at supabase.com
2. Create new project
3. Go to Settings → Database
4. Copy connection string
5. Add to GitHub secrets

### Neon (neon.tech)
1. Sign up at neon.tech
2. Create new project
3. Copy connection string
4. Add to GitHub secrets

## 🔧 Database Migration

After setting up the database, run migrations:

```bash
# Connect to your production database
npx prisma migrate deploy
```

## 📋 Required Environment Variables

Make sure these are set in GitHub secrets:

```
DATABASE_URL=your_database_connection_string
NEXTAUTH_URL=https://your-deployment-url.vercel.app
```

## 🆘 Troubleshooting

### Connection Issues
- Verify the connection string format
- Check if database is accessible from Vercel
- Ensure proper credentials

### Migration Issues
- Check if database exists
- Verify user permissions
- Check Prisma schema compatibility

## ✅ Success Indicators

Database is properly set up when:
- Connection string is valid
- Migrations run successfully
- Application can connect to database
- No connection errors in logs 