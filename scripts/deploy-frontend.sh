#!/bin/bash

# Venus Hotel & SPA - Frontend Deployment Script
# Deploys frontend from venus-frontend repository to Firebase

set -e

echo "🚀 Venus Hotel & SPA - Frontend Deployment"
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

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    print_error "package.json not found. Please run this script from the venus-frontend directory."
    exit 1
fi

# Check if Firebase CLI is installed
if ! command -v firebase &> /dev/null; then
    print_error "Firebase CLI is not installed. Please install it first:"
    echo "npm install -g firebase-tools"
    exit 1
fi

# Check if user is logged in
if ! firebase projects:list &> /dev/null; then
    print_error "You are not logged in to Firebase. Please run:"
    echo "firebase login"
    exit 1
fi

print_status "Starting frontend deployment process..."

# Step 1: Install dependencies
print_status "Installing dependencies..."
npm install
print_success "Dependencies installed"

# Step 2: Build frontend
print_status "Building frontend..."
npm run build
print_success "Frontend built successfully"

# Step 3: Deploy to Firebase
print_status "Deploying to Firebase..."
firebase deploy --only hosting

print_success "🎉 Frontend deployment completed successfully!"
echo ""
echo "🌐 Your app is now live at:"
echo "   https://venus-hotel-spa.web.app"
echo ""
echo "📊 Firebase Console:"
echo "   https://console.firebase.google.com/project/venus-hotel-spa"
echo ""
echo "🔧 Backend API:"
echo "   https://venus-strapi-backend-production.up.railway.app"
echo ""
print_warning "Remember to:"
echo "   1. Ensure backend is running on Railway"
echo "   2. Test all pages and functionality"
echo "   3. Configure custom domain (optional)"
