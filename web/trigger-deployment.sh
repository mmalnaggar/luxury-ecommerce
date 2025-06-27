#!/bin/bash

echo "🚀 Triggering Luxury E-commerce Platform Deployment"
echo "=================================================="

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${BLUE}Step 1:${NC} Checking current status..."

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Please run this script from the web directory"
    exit 1
fi

echo -e "${GREEN}✅ In correct directory${NC}"

# Check git status
echo -e "${BLUE}Step 2:${NC} Checking git status..."
git status --porcelain

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Git repository ready${NC}"
else
    echo -e "${YELLOW}⚠️  Git issues detected${NC}"
fi

echo -e "${BLUE}Step 3:${NC} Triggering deployment..."

# Add any changes
git add .

# Commit changes
git commit -m "Trigger deployment $(date)"

# Push to trigger GitHub Actions
git push origin main

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Deployment triggered successfully!${NC}"
    echo ""
    echo "🔗 Monitor deployment progress:"
    echo "   GitHub Actions: https://github.com/mmalnaggar/luxury-ecommerce/actions"
    echo "   Vercel Dashboard: https://vercel.com/dashboard"
    echo ""
    echo "📋 Required GitHub Secrets:"
    echo "   VERCEL_TOKEN=vODmy4t66KEFe2vIJBGhtMUO"
    echo "   VERCEL_ORG_ID=team_mbjVEda0Q3Ac1T0BG6vZzX0W"
    echo "   VERCEL_PROJECT_ID=prj_dbMuyyN2YyFDwcIRxj5tBVCGQk6z"
    echo "   NEXTAUTH_SECRET=6onxKvv9XL2B/VvkuJspo50GN/iuqWhSAeZec3tHLSY="
    echo "   DATABASE_URL=your_database_connection_string"
    echo "   NEXTAUTH_URL=https://your-deployment-url.vercel.app"
    echo ""
    echo "🎉 Your luxury e-commerce platform is being deployed!"
else
    echo -e "${YELLOW}⚠️  Deployment trigger failed${NC}"
    echo "Please check your git configuration and try again."
fi 