# 🚀 Deployment Guide - Luxury E-commerce Platform

This guide will help you deploy your luxury e-commerce application to Vercel using GitHub Actions.

## Prerequisites

Before deploying, ensure you have:
- [Vercel CLI](https://vercel.com/cli) installed
- [Git](https://git-scm.com/) installed
- A [Vercel account](https://vercel.com/signup)
- A [Stripe account](https://stripe.com) for payments
- A PostgreSQL database (recommended: [Supabase](https://supabase.com) or [PlanetScale](https://planetscale.com))

## 🗄️ Database Setup

### Option 1: Supabase (Recommended)
1. Create a new project at [supabase.com](https://supabase.com)
2. Go to Settings > Database
3. Copy the connection string
4. Run the Prisma migration:
   ```bash
   npx prisma db push
   ```

### Option 2: PlanetScale
1. Create a new database at [planetscale.com](https://planetscale.com)
2. Connect your local database
3. Run migrations:
   ```bash
   npx prisma db push
   ```

## 🔐 Environment Variables

Create a `.env.local` file with the following variables:

```env
# Database Configuration
DATABASE_URL="postgresql://username:password@localhost:5432/luxury_ecommerce"

# NextAuth Configuration
NEXTAUTH_SECRET="your-nextauth-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"

# Stripe Configuration
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# Email Configuration (for notifications)
EMAIL_SERVER_HOST="smtp.gmail.com"
EMAIL_SERVER_PORT="587"
EMAIL_SERVER_USER="your-email@gmail.com"
EMAIL_SERVER_PASSWORD="your-app-password"

# Production URLs
NEXT_PUBLIC_APP_URL="https://your-domain.vercel.app"
NEXT_PUBLIC_API_URL="https://your-domain.vercel.app/api"

# Security
JWT_SECRET="your-jwt-secret-key"
ENCRYPTION_KEY="your-32-character-encryption-key"
```

## 🚀 Deploy to Vercel

### Method 1: Vercel CLI (Recommended)

1. **Install Vercel CLI:**
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel:**
   ```bash
   vercel login
   ```

3. **Deploy from the web directory:**
   ```bash
   cd web
   vercel
   ```

4. **Follow the prompts:**
   - Link to existing project or create new
   - Set project name
   - Confirm deployment settings

5. **Set environment variables:**
   ```bash
   vercel env add DATABASE_URL
   vercel env add NEXTAUTH_SECRET
   vercel env add NEXTAUTH_URL
   vercel env add STRIPE_SECRET_KEY
   vercel env add STRIPE_PUBLISHABLE_KEY
   vercel env add STRIPE_WEBHOOK_SECRET
   ```

### Method 2: GitHub Integration

1. **Push your code to GitHub**
2. **Connect your repository to Vercel:**
   - Go to [vercel.com/dashboard](https://vercel.com/dashboard)
   - Click "New Project"
   - Import your GitHub repository
   - Set the root directory to `web`
   - Configure environment variables

3. **Automatic deployments:**
   - Every push to `main` branch will trigger deployment
   - Pull requests will create preview deployments

## 🔧 Post-Deployment Setup

### 1. Database Migration
After deployment, run database migrations:
```bash
vercel env pull .env.local
npx prisma db push
```

### 2. Stripe Webhook Setup
1. Go to [Stripe Dashboard](https://dashboard.stripe.com/webhooks)
2. Create a new webhook endpoint
3. Set URL to: `https://your-domain.vercel.app/api/webhooks/stripe`
4. Select events: `payment_intent.succeeded`, `payment_intent.payment_failed`
5. Copy the webhook secret to your environment variables

### 3. Email Configuration
1. Set up SMTP credentials (Gmail, SendGrid, etc.)
2. Add email environment variables to Vercel
3. Test email functionality

### 4. Custom Domain (Optional)
1. Go to your Vercel project settings
2. Add your custom domain
3. Update DNS records as instructed
4. Update `NEXTAUTH_URL` and `NEXT_PUBLIC_APP_URL` environment variables

## 🧪 Testing Deployment

### 1. Health Check
Visit: `https://your-domain.vercel.app/api/health`

### 2. Test Authentication
- Try signing up/signing in
- Verify email functionality

### 3. Test Payments
- Use Stripe test cards
- Verify webhook processing

### 4. Test AR Features
- Upload AR assets
- Test AR viewer functionality

## 📊 Monitoring & Analytics

### 1. Vercel Analytics
- Built-in performance monitoring
- View in Vercel dashboard

### 2. Error Tracking
- Consider adding [Sentry](https://sentry.io) for error tracking
- Add `NEXT_PUBLIC_SENTRY_DSN` to environment variables

### 3. Database Monitoring
- Monitor database performance
- Set up alerts for connection issues

## 🔒 Security Checklist

- [ ] Environment variables are set
- [ ] Database is properly secured
- [ ] Stripe webhooks are configured
- [ ] HTTPS is enabled (automatic with Vercel)
- [ ] Security headers are configured (in vercel.json)
- [ ] Rate limiting is implemented
- [ ] Input validation is working

## 🚨 Troubleshooting

### Common Issues:

1. **Database Connection Errors:**
   - Check DATABASE_URL format
   - Verify database is accessible from Vercel
   - Run `npx prisma db push` locally

2. **Authentication Issues:**
   - Verify NEXTAUTH_SECRET is set
   - Check NEXTAUTH_URL matches your domain
   - Ensure OAuth providers are configured

3. **Payment Issues:**
   - Verify Stripe keys are correct
   - Check webhook endpoint is accessible
   - Test with Stripe test mode first

4. **Build Errors:**
   - Check build logs in Vercel dashboard
   - Verify all dependencies are in package.json
   - Ensure TypeScript compilation passes

## 📈 Performance Optimization

### 1. Image Optimization
- Use Next.js Image component (already implemented)
- Optimize image sizes before upload

### 2. Database Optimization
- Add indexes for frequently queried fields
- Use connection pooling

### 3. Caching
- Implement Redis for session storage
- Add CDN for static assets

## 🔄 CI/CD Pipeline

The project includes GitHub Actions for automated testing and deployment:

1. **On Pull Request:**
   - Run tests
   - Build application
   - Create preview deployment

2. **On Main Branch:**
   - Run tests
   - Build application
   - Deploy to production

## 📞 Support

If you encounter issues:
1. Check Vercel deployment logs
2. Review environment variable configuration
3. Test locally with production environment variables
4. Check database connectivity

---

**🎉 Congratulations!** Your luxury e-commerce platform is now deployed and ready for customers! 

# Deployment Guide

This guide will help you deploy your luxury e-commerce application to Vercel using GitHub Actions.

## Prerequisites

1. **GitHub Repository**: Your code should be in a GitHub repository
2. **Vercel Account**: Sign up at [vercel.com](https://vercel.com)
3. **Database**: Set up a production database (PostgreSQL recommended)

## Step 1: Set up Vercel Project

### Option A: Using Vercel CLI (Recommended for first deployment)

1. **Install Vercel CLI** (if not already installed):
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Deploy manually first** to get project details:
   ```bash
   cd web
   vercel --prod
   ```

4. **Note down the project details** from the output:
   - Project ID
   - Organization ID

### Option B: Using Vercel Dashboard

1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Import your GitHub repository
4. Configure the project settings

## Step 2: Get Vercel Tokens and IDs

1. **Get Vercel Token**:
   - Go to [vercel.com/account/tokens](https://vercel.com/account/tokens)
   - Create a new token with "Full Account" scope
   - Copy the token

2. **Get Project ID and Org ID**:
   - Go to your project in Vercel dashboard
   - Go to Settings → General
   - Copy the Project ID
   - Copy the Team ID (Organization ID)

## Step 3: Set up GitHub Secrets

1. Go to your GitHub repository
2. Navigate to Settings → Secrets and variables → Actions
3. Add the following secrets:

### Required Secrets:

```
VERCEL_TOKEN=your_vercel_token_here
VERCEL_ORG_ID=your_organization_id_here
VERCEL_PROJECT_ID=your_project_id_here
DATABASE_URL=your_production_database_url_here
NEXTAUTH_SECRET=your_nextauth_secret_here
NEXTAUTH_URL=https://your-domain.vercel.app
```

### Optional Secrets (if using these features):

```
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
PAYMOB_API_KEY=your_paymob_api_key
PAYMOB_INTEGRATION_ID=your_paymob_integration_id
SMTP_HOST=your_smtp_host
SMTP_PORT=your_smtp_port
SMTP_USER=your_smtp_user
SMTP_PASS=your_smtp_password
```

## Step 4: Set up Production Database

### Option A: Vercel Postgres (Recommended)

1. In your Vercel dashboard, go to Storage
2. Create a new Postgres database
3. Copy the connection string
4. Add it as `DATABASE_URL` in GitHub secrets

### Option B: External Database

1. Set up a PostgreSQL database (e.g., on Railway, Supabase, or AWS RDS)
2. Get the connection string
3. Add it as `DATABASE_URL` in GitHub secrets

## Step 5: Configure Environment Variables in Vercel

1. Go to your Vercel project dashboard
2. Navigate to Settings → Environment Variables
3. Add the same environment variables as GitHub secrets

## Step 6: Deploy

### Automatic Deployment (Recommended)

1. Push your code to the `main` branch:
   ```bash
   git add .
   git commit -m "Initial deployment"
   git push origin main
   ```

2. The GitHub Actions workflow will automatically:
   - Run tests
   - Build the application
   - Deploy to Vercel

### Manual Deployment

If you prefer manual deployment:

```bash
cd web
vercel --prod
```

## Step 7: Post-Deployment Setup

### 1. Run Database Migrations

After deployment, run database migrations:

```bash
# Connect to your production database and run:
npx prisma migrate deploy
```

### 2. Verify Deployment

1. Check your Vercel dashboard for deployment status
2. Visit your deployed URL
3. Test key functionality:
   - User registration/login
   - Product browsing
   - Cart functionality
   - Admin panel (if applicable)

### 3. Set up Custom Domain (Optional)

1. In Vercel dashboard, go to Settings → Domains
2. Add your custom domain
3. Update DNS records as instructed

## Troubleshooting

### Common Issues:

1. **Build Failures**:
   - Check GitHub Actions logs
   - Ensure all environment variables are set
   - Verify database connection

2. **Database Connection Issues**:
   - Verify `DATABASE_URL` is correct
   - Ensure database is accessible from Vercel
   - Check if migrations have been run

3. **Authentication Issues**:
   - Verify `NEXTAUTH_SECRET` is set
   - Check `NEXTAUTH_URL` matches your domain
   - Ensure OAuth providers are configured

### Useful Commands:

```bash
# Check deployment status
vercel ls

# View deployment logs
vercel logs

# Rollback to previous deployment
vercel rollback

# Run database migrations locally
npx prisma migrate deploy
```

## Monitoring and Maintenance

1. **Set up monitoring**:
   - Enable Vercel Analytics
   - Set up error tracking (e.g., Sentry)
   - Monitor database performance

2. **Regular maintenance**:
   - Keep dependencies updated
   - Monitor for security vulnerabilities
   - Backup database regularly

## Security Considerations

1. **Environment Variables**: Never commit sensitive data to your repository
2. **Database Security**: Use strong passwords and restrict access
3. **HTTPS**: Vercel provides SSL certificates automatically
4. **Rate Limiting**: Consider implementing rate limiting for API routes

## Support

If you encounter issues:

1. Check the [Vercel documentation](https://vercel.com/docs)
2. Review [Next.js deployment guide](https://nextjs.org/docs/deployment)
3. Check GitHub Actions logs for detailed error messages
4. Verify all environment variables are correctly set 