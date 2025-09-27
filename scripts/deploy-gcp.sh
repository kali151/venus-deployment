#!/bin/bash

# Deploy script for Venus Hotel & SPA on Google Cloud Platform
set -e

# Configuration
PROJECT_ID="your-gcp-project-id"
REGION="europe-west1"
SERVICE_NAME="venus-hotel"

echo "🚀 Starting deployment to Google Cloud Platform..."

# 1. Set project
echo "📋 Setting GCP project..."
gcloud config set project $PROJECT_ID

# 2. Enable required APIs
echo "🔧 Enabling required APIs..."
gcloud services enable cloudbuild.googleapis.com
gcloud services enable run.googleapis.com
gcloud services enable sqladmin.googleapis.com
gcloud services enable storage.googleapis.com

# 3. Build and deploy Backend (Strapi)
echo "🏗️ Building and deploying Backend..."
cd backend
gcloud builds submit --tag gcr.io/$PROJECT_ID/venus-backend
gcloud run deploy venus-backend \
  --image gcr.io/$PROJECT_ID/venus-backend \
  --platform managed \
  --region $REGION \
  --allow-unauthenticated \
  --port 1337 \
  --set-env-vars NODE_ENV=production

# Get backend URL
BACKEND_URL=$(gcloud run services describe venus-backend --region=$REGION --format="value(status.url)")

# 4. Build and deploy Frontend (React)
echo "🏗️ Building and deploying Frontend..."
cd ../frontend

# Update API URL in build
echo "🔗 Updating API URL to: $BACKEND_URL"
sed -i "s|http://localhost:1337|$BACKEND_URL|g" src/**/*.tsx src/**/*.ts

# Build frontend
npm run build

# Deploy to Cloud Storage
echo "📤 Deploying to Cloud Storage..."
gsutil mb -l $REGION gs://$PROJECT_ID-venus-frontend 2>/dev/null || true
gsutil -m rsync -r -d dist gs://$PROJECT_ID-venus-frontend

# Make bucket public
gsutil iam ch allUsers:objectViewer gs://$PROJECT_ID-venus-frontend

# 5. Setup Cloud Load Balancer (optional)
echo "🌐 Setting up Cloud Load Balancer..."
gcloud compute url-maps create venus-load-balancer \
  --default-service gs://$PROJECT_ID-venus-frontend

echo "✅ Deployment completed!"
echo "🌍 Frontend URL: https://storage.googleapis.com/$PROJECT_ID-venus-frontend/index.html"
echo "🔗 Backend URL: $BACKEND_URL"
echo ""
echo "📝 Next steps:"
echo "1. Configure custom domain"
echo "2. Setup SSL certificates"
echo "3. Configure Cloud CDN"
echo "4. Setup monitoring and logging" 