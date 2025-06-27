#!/bin/bash

# 🚀 Luxury E-commerce Deployment Script
# This script automates the deployment process to Vercel

set -e

echo "🎯 Starting deployment process..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if we're in the correct directory
if [ ! -f "package.json" ]; then
    print_error "Please run this script from the web directory"
    exit 1
fi

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    print_warning "Vercel CLI not found. Installing..."
    npm install -g vercel
fi

# Check if user is logged in to Vercel
if ! vercel whoami &> /dev/null; then
    print_warning "Not logged in to Vercel. Please login first:"
    vercel login
fi

# Run pre-deployment checks
print_status "Running pre-deployment checks..."

# Check if all tests pass
print_status "Running tests..."
npm test -- --watchAll=false --passWithNoTests

# Check if build works
print_status "Building application..."
npm run build

print_success "Pre-deployment checks passed!"

# Deploy to Vercel
print_status "Deploying to Vercel..."
vercel --prod

print_success "Deployment completed successfully!"
print_status "Your application should now be live at the URL provided above."

# Post-deployment instructions
echo ""
echo "🔧 Post-deployment steps:"
echo "1. Set up your environment variables in Vercel dashboard"
echo "2. Configure your database connection"
echo "3. Set up Stripe webhooks"
echo "4. Test the application functionality"
echo ""
echo "📖 For detailed instructions, see DEPLOYMENT.md" 