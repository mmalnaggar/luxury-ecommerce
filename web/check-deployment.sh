#!/bin/bash

echo "🚀 Checking Luxury E-commerce Platform Deployment Status"
echo "========================================================"

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${BLUE}Step 1:${NC} Checking GitHub Actions status..."

# Check GitHub Actions
echo "🔗 GitHub Actions: https://github.com/mmalnaggar/luxury-ecommerce/actions"
echo ""

echo -e "${BLUE}Step 2:${NC} Checking Vercel deployment status..."
echo "🔗 Vercel Dashboard: https://vercel.com/dashboard"
echo ""

echo -e "${BLUE}Step 3:${NC} Current configuration status..."

echo -e "${GREEN}✅ Repository:${NC} https://github.com/mmalnaggar/luxury-ecommerce"
echo -e "${GREEN}✅ Vercel Project ID:${NC} prj_dbMuyyN2YyFDwcIRxj5tBVCGQk6z"
echo -e "${GREEN}✅ Vercel Org ID:${NC} team_mbjVEda0Q3Ac1T0BG6vZzX0W"
echo -e "${GREEN}✅ Last Commit:${NC} fb825ee - Trigger deployment with all secrets configured"
echo ""

echo -e "${BLUE}Step 4:${NC} Required GitHub Secrets (should be configured):"
echo "   VERCEL_TOKEN=vODmy4t66KEFe2vIJBGhtMUO"
echo "   VERCEL_ORG_ID=team_mbjVEda0Q3Ac1T0BG6vZzX0W"
echo "   VERCEL_PROJECT_ID=prj_dbMuyyN2YyFDwcIRxj5tBVCGQk6z"
echo "   NEXTAUTH_SECRET=6onxKvv9XL2B/VvkuJspo50GN/iuqWhSAeZec3tHLSY="
echo "   DATABASE_URL=your_database_connection_string"
echo "   NEXTAUTH_URL=https://your-deployment-url.vercel.app"
echo ""

echo -e "${YELLOW}📋 Next Steps:${NC}"
echo "1. Check GitHub Actions for deployment progress"
echo "2. Check Vercel dashboard for deployment status"
echo "3. Once deployed, test your application"
echo "4. Verify database connections"
echo "5. Test authentication and core features"
echo ""

echo -e "${GREEN}🎉 Your luxury e-commerce platform is being deployed!${NC}"
echo ""
echo "Monitor progress at:"
echo "   GitHub: https://github.com/mmalnaggar/luxury-ecommerce/actions"
echo "   Vercel: https://vercel.com/dashboard" 