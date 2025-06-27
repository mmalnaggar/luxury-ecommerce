#!/bin/bash

echo "🚀 Vercel Deployment Setup for Luxury E-commerce Platform"
echo "=========================================================="

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${BLUE}Step 1:${NC} Vercel Deployment"
echo "   The Vercel deployment is waiting for your input."
echo "   In your terminal, type 'Y' and press Enter to continue."
echo ""

read -p "Press Enter when you've completed the Vercel deployment..."

echo -e "${BLUE}Step 2:${NC} Get Vercel Project Details"
echo "   After deployment, Vercel will show you:"
echo "   - Deployment URL (e.g., https://your-app.vercel.app)"
echo "   - Project ID"
echo "   - Organization ID"
echo ""

echo -e "${BLUE}Step 3:${NC} Set up GitHub Secrets"
echo "   Go to: https://github.com/mmalnaggar/luxury-ecommerce/settings/secrets/actions"
echo "   Add these secrets:"
echo ""

echo -e "${YELLOW}Required Secrets:${NC}"
echo "VERCEL_TOKEN=your_vercel_token_here"
echo "VERCEL_ORG_ID=your_organization_id_here"
echo "VERCEL_PROJECT_ID=your_project_id_here"
echo "DATABASE_URL=your_production_database_url_here"
echo "NEXTAUTH_SECRET=your_nextauth_secret_here"
echo "NEXTAUTH_URL=https://your-domain.vercel.app"
echo ""

echo -e "${BLUE}Step 4:${NC} Set up Production Database"
echo "   Option A: Vercel Postgres (Recommended)"
echo "   - Go to your Vercel dashboard"
echo "   - Navigate to Storage"
echo "   - Create a new Postgres database"
echo "   - Copy the connection string"
echo ""

echo -e "${BLUE}Step 5:${NC} Configure Environment Variables in Vercel"
echo "   - Go to your Vercel project dashboard"
echo "   - Navigate to Settings → Environment Variables"
echo "   - Add the same environment variables as GitHub secrets"
echo ""

echo -e "${GREEN}✅ Setup complete!${NC}"
echo ""
echo "Your luxury e-commerce platform will be deployed automatically"
echo "when you push changes to the main branch."
echo ""
echo "Repository: https://github.com/mmalnaggar/luxury-ecommerce"
echo "For detailed instructions, see: DEPLOYMENT.md" 