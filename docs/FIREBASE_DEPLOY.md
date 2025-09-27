# 🔥 Venus Hotel & SPA - Firebase Deployment Guide

## 📋 Overview

This guide covers deploying the Venus Hotel & SPA application to Firebase, which provides:

- **Hosting**: Static file hosting for React frontend
- **Functions**: Serverless API backend
- **Firestore**: NoSQL database
- **Storage**: File storage for images
- **Cost**: Nearly free for the first few months

## 🚀 Quick Deploy

### Prerequisites

1. **Firebase CLI**: `npm install -g firebase-tools`
2. **Google Account**: Logged in to Firebase
3. **Billing Enabled**: Required for Firebase Hosting (but free tier applies)

### One-Click Deploy

```bash
./deploy-firebase.sh
```

## 📁 Project Structure

```
venus/
├── frontend/                 # React app
│   ├── dist/                # Build output (for hosting)
│   └── src/
├── functions/               # Firebase Functions (API)
│   ├── src/
│   │   └── index.ts        # API endpoints
│   └── package.json
├── firebase.json           # Firebase configuration
├── .firebaserc            # Project configuration
├── firestore.rules        # Database security rules
├── storage.rules          # Storage security rules
└── firestore.indexes.json # Database indexes
```

## 🔧 Manual Setup

### 1. Enable Firebase Services

Visit [Firebase Console](https://console.firebase.google.com/project/venus-hotel-spa):

1. **Hosting**: Enable Web App Hosting
2. **Functions**: Enable Cloud Functions
3. **Firestore**: Create database
4. **Storage**: Enable Cloud Storage

### 2. Enable Billing

**Required for Hosting** (but free tier applies):

- Go to [Billing Setup](https://console.firebase.google.com/project/venus-hotel-spa/usage/details)
- Add payment method
- Free tier: 10GB storage, 10GB transfer/month

### 3. Build and Deploy

```bash
# Build frontend
cd frontend
npm run build

# Install and build functions
cd ../functions
npm install
npm run build

# Deploy everything
cd ..
firebase deploy
```

## 🌐 URLs After Deploy

- **Frontend**: https://venus-hotel-spa.web.app
- **API**: https://us-central1-venus-hotel-spa.cloudfunctions.net/api
- **Console**: https://console.firebase.google.com/project/venus-hotel-spa

## 📊 Data Migration

### From Strapi to Firestore

1. **Export Strapi Data**:

   ```bash
   # In Strapi admin, export collections as JSON
   ```

2. **Import to Firestore**:
   - Go to Firebase Console → Firestore
   - Create collections: `rooms`, `spa-services`, `attractions`, `galleries`, `contact-pages`, `pages`
   - Import JSON data

### Data Structure

```typescript
// Room
{
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  imageUrl: string;
  amenities: string[];
  language: string;
}

// Spa Service
{
  id: string;
  name: string;
  slug: string;
  description: string;
  duration: number;
  price: number;
  imageUrl: string;
  language: string;
}

// Attraction
{
  id: string;
  name: string;
  slug: string;
  description: string;
  imageUrl: string;
  location: string;
  language: string;
}
```

## 🖼️ Image Migration

### Upload to Firebase Storage

1. **Create folders**:

   - `/images/rooms/`
   - `/images/spa-services/`
   - `/images/attractions/`
   - `/images/gallery/`

2. **Upload images** via Firebase Console

3. **Update image URLs** in Firestore documents

## 🔒 Security Rules

### Firestore Rules

```javascript
// Allow read access to all public data
match /{document=**} {
  allow read: if true;
  allow write: if false; // Admin only via console
}
```

### Storage Rules

```javascript
// Allow read access to all files
match /{allPaths=**} {
  allow read: if true;
  allow write: if false; // Admin only via console
}
```

## 💰 Cost Estimation

### Free Tier Limits

- **Hosting**: 10GB storage, 10GB transfer/month
- **Functions**: 2M invocations/month
- **Firestore**: 1GB storage, 50K reads, 20K writes/day
- **Storage**: 5GB storage, 1GB transfer/day

### Estimated Monthly Cost

- **Month 1-3**: $0-5 (within free limits)
- **Month 4+**: $10-20 (depending on traffic)

## 🛠️ Development

### Local Development

```bash
# Start Firebase emulators
firebase emulators:start

# Frontend will use local API
# API: http://localhost:5001/venus-hotel-spa/us-central1/api
```

### Environment Variables

```bash
# Frontend (.env)
VITE_API_URL=http://localhost:5001/venus-hotel-spa/us-central1/api

# Production (automatic)
VITE_API_URL=https://us-central1-venus-hotel-spa.cloudfunctions.net/api
```

## 🔄 CI/CD

### GitHub Actions (Optional)

```yaml
name: Deploy to Firebase
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: "18"
      - run: npm install -g firebase-tools
      - run: ./deploy-firebase.sh
```

## 🚨 Troubleshooting

### Common Issues

1. **Billing Required Error**:

   - Enable billing in Firebase Console
   - Free tier still applies

2. **Functions Deploy Failed**:

   - Check Node.js version (18+)
   - Verify TypeScript compilation

3. **CORS Errors**:

   - Functions have CORS enabled
   - Check API URL in frontend

4. **Image Loading Issues**:
   - Verify Storage rules allow read access
   - Check image URLs in Firestore

### Support

- [Firebase Documentation](https://firebase.google.com/docs)
- [Firebase Console](https://console.firebase.google.com)
- [Firebase Support](https://firebase.google.com/support)

## 🎯 Next Steps

1. **Custom Domain**: Configure in Firebase Console
2. **SSL Certificate**: Automatic with Firebase
3. **Analytics**: Enable Firebase Analytics
4. **Performance**: Monitor with Firebase Performance
5. **Monitoring**: Set up Firebase Crashlytics

---

**🎉 Your Venus Hotel & SPA is now live on Firebase!**
