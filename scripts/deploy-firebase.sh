#!/bin/bash

# Venus Hotel & SPA - Firebase Deployment Script
# Author: AI Assistant
# Date: $(date)

set -e

echo "🔥 Venus Hotel & SPA - Firebase Deployment"
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

print_status "Starting deployment process..."

# Step 1: Build frontend
print_status "Building frontend..."
cd frontend
npm run build
print_success "Frontend built successfully"

# Step 2: Install Firebase Functions dependencies
print_status "Installing Firebase Functions dependencies..."
cd ../functions
npm install
print_success "Firebase Functions dependencies installed"

# Step 3: Build Firebase Functions
print_status "Building Firebase Functions..."
npm run build
print_success "Firebase Functions built successfully"

# Step 4: Deploy to Firebase
print_status "Deploying to Firebase..."
cd ..
firebase deploy

print_success "🎉 Deployment completed successfully!"
echo ""
echo "🌐 Your app is now live at:"
echo "   https://venus-hotel-spa.web.app"
echo ""
echo "📊 Firebase Console:"
echo "   https://console.firebase.google.com/project/venus-hotel-spa"
echo ""
echo "🔧 API Endpoint:"
echo "   https://us-central1-venus-hotel-spa.cloudfunctions.net/api"
echo ""
print_warning "Remember to:"
echo "   1. Add your data to Firestore collections"
echo "   2. Upload images to Firebase Storage"
echo "   3. Configure custom domain (optional)"
echo "   4. Set up SSL certificate (automatic with Firebase)" 