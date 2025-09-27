# Venus Hotel & SPA - Deployment & Scripts

Deployment scripts, documentation, and archived migration data for Venus Hotel & SPA project.

## 📁 Structure

```
venus-deployment/
├── scripts/              # Deployment and utility scripts
├── docs/                 # Documentation and guides
├── archive/              # Archived migration data
└── docker-compose.yml    # Local development setup
```

## 🚀 Deployment Scripts

### Frontend Deployment

```bash
# From venus-frontend directory
./scripts/deploy-frontend.sh
```

### Backend Deployment

```bash
# From venus-backend directory
./scripts/deploy-backend.sh
```

### Testing

```bash
node scripts/test-endpoints.js
```

## 📚 Documentation

- `docs/DEPLOY.md` - General deployment guide
- `docs/FIREBASE_DEPLOY.md` - Firebase deployment
- `docs/RAILWAY_DEPLOY.md` - Railway deployment
- `docs/MIGRATION_GUIDE.md` - Data migration guide

## 🐳 Local Development

Run full stack locally with Docker:

```bash
docker-compose up
```

Services:

- **Frontend:** http://localhost:80
- **Backend:** http://localhost:1337
- **Database:** PostgreSQL on port 5432

## 🗄️ Archive

Historical migration data and scripts are stored in `archive/` directory.

## 🔗 Related Repositories

- **Frontend:** venus-frontend
- **Backend:** [venus-backend](https://github.com/kali151/venus-strapi-backend)

## 🛠️ Scripts Overview

| Script                      | Description                     |
| --------------------------- | ------------------------------- |
| `deploy-frontend.sh`        | Deploy frontend to Firebase     |
| `deploy-backend.sh`         | Deploy backend to Railway       |
| `deploy-firebase.sh`        | Legacy Firebase deployment      |
| `deploy-gcp.sh`             | Deploy to Google Cloud Platform |
| `fix-api-urls.sh`           | Fix API URLs in config          |
| `generate-keys.sh`          | Generate security keys          |
| `prepare-railway-deploy.sh` | Prepare Railway deployment      |
| `migrate-to-railway.js`     | Migrate data to Railway         |
| `migrate-simple.js`         | Simple data migration           |
| `test-endpoints.js`         | Test API endpoints              |

## ⚙️ Environment Setup

Before running scripts, ensure you have:

1. **Node.js** (v18+)
2. **Firebase CLI** (`npm install -g firebase-tools`)
3. **Docker** (for local development)
4. **Git** access to repositories

## 🔐 Security

- Never commit API keys or secrets
- Use environment variables for sensitive data
- Review scripts before execution

## 📝 Usage Examples

### Deploy Frontend

```bash
cd ../venus-frontend
./scripts/deploy-frontend.sh
```

### Test All Endpoints

```bash
cd scripts
node test-endpoints.js
```

### Local Development

```bash
docker-compose up -d
# Frontend: http://localhost:80
# Backend: http://localhost:1337/admin
```
