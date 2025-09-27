#!/bin/bash

# Venus Hotel & SPA - Backend Deployment Script
# Deploys backend from venus-backend repository to Railway

set -e

echo "🚂 Venus Hotel & SPA - Backend Deployment"
echo "=========================================="

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

print_status "Backend deployment to Railway"
echo ""
echo "📋 Manual steps required:"
echo ""
echo "1. Navigate to backend repository:"
echo "   cd ../venus-backend"
echo ""
echo "2. Make sure you're on main branch:"
echo "   git checkout main"
echo "   git pull origin main"
echo ""
echo "3. Push changes to trigger Railway deployment:"
echo "   git push origin main"
echo ""
echo "4. Monitor deployment in Railway Dashboard:"
echo "   https://railway.app/dashboard"
echo ""
echo "5. Check backend health:"
echo "   curl https://venus-strapi-backend-production.up.railway.app/api/health"
echo ""
echo "6. Access Strapi Admin:"
echo "   https://venus-strapi-backend-production.up.railway.app/admin"
echo ""
print_warning "Note: Railway automatically deploys when you push to main branch"
print_warning "Make sure all environment variables are set in Railway dashboard"
