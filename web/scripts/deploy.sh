#!/bin/bash

# Deployment Script for Luxury E-commerce Platform
# This script helps automate the deployment process

set -e

echo "🚀 Luxury E-commerce Platform Deployment Script"
echo "================================================"

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

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    print_error "Please run this script from the web directory"
    exit 1
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed. Please install Node.js 18 or higher."
    exit 1
fi

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    print_error "Node.js version 18 or higher is required. Current version: $(node -v)"
    exit 1
fi

print_success "Node.js version: $(node -v)"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    print_error "npm is not installed."
    exit 1
fi

print_success "npm version: $(npm -v)"

# Install dependencies
print_status "Installing dependencies..."
npm ci

# Run linting
print_status "Running linting..."
npm run lint

# Run tests
print_status "Running tests..."
npm test

# Build the application
print_status "Building the application..."
npm run build

print_success "Build completed successfully!"

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    print_warning "Vercel CLI is not installed. Installing..."
    npm install -g vercel
fi

print_success "Vercel CLI version: $(vercel --version)"

# Check if user is logged in to Vercel
if ! vercel whoami &> /dev/null; then
    print_warning "You are not logged in to Vercel."
    echo "Please run: vercel login"
    echo "Then run this script again."
    exit 1
fi

print_success "Logged in to Vercel as: $(vercel whoami)"

# Deploy to Vercel
print_status "Deploying to Vercel..."
vercel --prod

print_success "Deployment completed!"
echo ""
echo "🎉 Your luxury e-commerce platform has been deployed!"
echo ""
echo "Next steps:"
echo "1. Set up your production database"
echo "2. Configure environment variables in Vercel dashboard"
echo "3. Run database migrations"
echo "4. Test your application"
echo ""
echo "For detailed instructions, see: DEPLOYMENT.md" 