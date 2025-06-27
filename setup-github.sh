#!/bin/bash

echo "🚀 Setting up GitHub repository for Luxury E-commerce Platform"
echo "=============================================================="

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${BLUE}Step 1:${NC} Please create a new repository on GitHub.com"
echo "   - Go to https://github.com/new"
echo "   - Repository name: luxury-ecommerce"
echo "   - Make it Public (or Private if you prefer)"
echo "   - Don't initialize with README, .gitignore, or license"
echo "   - Click 'Create repository'"
echo ""

read -p "Press Enter when you've created the repository..."

echo -e "${BLUE}Step 2:${NC} Enter your GitHub username:"
read GITHUB_USERNAME

echo -e "${BLUE}Step 3:${NC} Setting up remote and pushing code..."

# Add remote origin
git remote add origin https://github.com/$GITHUB_USERNAME/luxury-ecommerce.git

# Set main branch
git branch -M main

# Push to GitHub
git push -u origin main

echo -e "${GREEN}✅ Repository setup complete!${NC}"
echo ""
echo -e "${YELLOW}Next steps:${NC}"
echo "1. Go to your repository: https://github.com/$GITHUB_USERNAME/luxury-ecommerce"
echo "2. Set up GitHub Secrets (Settings → Secrets and variables → Actions)"
echo "3. Follow the deployment guide in web/DEPLOYMENT.md"
echo ""
echo "Required GitHub Secrets:"
echo "- VERCEL_TOKEN"
echo "- VERCEL_ORG_ID" 
echo "- VERCEL_PROJECT_ID"
echo "- DATABASE_URL"
echo "- NEXTAUTH_SECRET"
echo "- NEXTAUTH_URL" 