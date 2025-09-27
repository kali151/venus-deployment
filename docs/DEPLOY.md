# 🚀 Deploy Venus Hotel & SPA na Google Cloud Platform

## 📋 Wymagania

- Konto Google Cloud Platform
- Google Cloud CLI zainstalowane
- Docker zainstalowany
- Domain (opcjonalnie)

## 🔧 Przygotowanie

### 1. Instalacja Google Cloud CLI

```bash
# macOS
brew install google-cloud-sdk

# Linux
curl https://sdk.cloud.google.com | bash
exec -l $SHELL

# Windows
# Pobierz z: https://cloud.google.com/sdk/docs/install
```

### 2. Konfiguracja projektu

```bash
# Login do GCP
gcloud auth login

# Utwórz nowy projekt lub wybierz istniejący
gcloud projects create venus-hotel-spa --name="Venus Hotel & SPA"

# Ustaw projekt jako aktywny
gcloud config set project venus-hotel-spa
```

### 3. Włączenie wymaganych API

```bash
gcloud services enable cloudbuild.googleapis.com
gcloud services enable run.googleapis.com
gcloud services enable sqladmin.googleapis.com
gcloud services enable storage.googleapis.com
gcloud services enable compute.googleapis.com
```

## 🗄️ Baza danych (PostgreSQL)

### 1. Utworzenie instancji Cloud SQL

```bash
gcloud sql instances create venus-postgres \
  --database-version=POSTGRES_15 \
  --tier=db-f1-micro \
  --region=europe-west1 \
  --storage-type=SSD \
  --storage-size=10GB \
  --backup-start-time=02:00 \
  --maintenance-window-day=SUN \
  --maintenance-window-hour=03:00
```

### 2. Utworzenie bazy danych

```bash
gcloud sql databases create venus_hotel --instance=venus-postgres
```

### 3. Utworzenie użytkownika

```bash
gcloud sql users create strapi \
  --instance=venus-postgres \
  --password=your-secure-password
```

### 4. Pobranie connection string

```bash
gcloud sql instances describe venus-postgres \
  --format="value(connectionName)"
```

## 🏗️ Deploy Backend (Strapi)

### 1. Konfiguracja środowiska

Skopiuj `backend/env.production.example` do `backend/.env.production` i uzupełnij:

```bash
cp backend/env.production.example backend/.env.production
```

### 2. Build i deploy

```bash
cd backend

# Build image
gcloud builds submit --tag gcr.io/venus-hotel-spa/venus-backend

# Deploy na Cloud Run
gcloud run deploy venus-backend \
  --image gcr.io/venus-hotel-spa/venus-backend \
  --platform managed \
  --region europe-west1 \
  --allow-unauthenticated \
  --port 1337 \
  --set-env-vars NODE_ENV=production \
  --set-env-vars DATABASE_CLIENT=postgres \
  --set-env-vars DATABASE_HOST=/cloudsql/venus-hotel-spa:europe-west1:venus-postgres \
  --set-env-vars DATABASE_NAME=venus_hotel \
  --set-env-vars DATABASE_USERNAME=strapi \
  --set-env-vars DATABASE_PASSWORD=your-secure-password \
  --set-env-vars DATABASE_SSL=true \
  --add-cloudsql-instances venus-hotel-spa:europe-west1:venus-postgres
```

## 🌐 Deploy Frontend (React)

### 1. Aktualizacja API URL

W pliku `frontend/src/config/api.ts` (lub podobnym) ustaw URL backendu:

```typescript
export const API_BASE_URL = "https://venus-backend-xxxxx-ew.a.run.app";
```

### 2. Build i deploy

```bash
cd frontend

# Build aplikacji
npm run build

# Utworzenie bucket
gsutil mb -l europe-west1 gs://venus-hotel-spa-frontend

# Upload plików
gsutil -m rsync -r -d dist gs://venus-hotel-spa-frontend

# Ustawienie publicznego dostępu
gsutil iam ch allUsers:objectViewer gs://venus-hotel-spa-frontend

# Ustawienie website
gsutil web set -m index.html -e 404.html gs://venus-hotel-spa-frontend
```

## 🔗 Custom Domain (opcjonalnie)

### 1. Mapowanie domeny

```bash
# Utworzenie load balancer
gcloud compute url-maps create venus-load-balancer \
  --default-service gs://venus-hotel-spa-frontend

# Utworzenie HTTPS proxy
gcloud compute target-https-proxies create venus-https-proxy \
  --url-map venus-load-balancer \
  --ssl-certificates your-ssl-cert

# Utworzenie forwarding rule
gcloud compute forwarding-rules create venus-https \
  --target-https-proxy venus-https-proxy \
  --global \
  --ports 443
```

### 2. DNS

Dodaj rekord A w DNS wskazujący na IP load balancer.

## 📊 Monitoring

### 1. Cloud Monitoring

```bash
# Włączenie monitoring
gcloud services enable monitoring.googleapis.com

# Utworzenie alertów
gcloud alpha monitoring policies create \
  --policy-from-file=monitoring-policy.yaml
```

### 2. Logging

```bash
# View logs
gcloud logging read "resource.type=cloud_run_revision" --limit 50
```

## 🔄 Automatyczny deploy

### 1. Cloud Build Trigger

```bash
# Utworzenie trigger dla GitHub
gcloud builds triggers create github \
  --repo-name=venus-hotel-spa \
  --repo-owner=your-username \
  --branch-pattern="^main$" \
  --build-config=cloudbuild.yaml
```

### 2. Cloud Build config

Utwórz `cloudbuild.yaml`:

```yaml
steps:
  # Build backend
  - name: "gcr.io/cloud-builders/docker"
    args: ["build", "-t", "gcr.io/$PROJECT_ID/venus-backend", "./backend"]

  # Deploy backend
  - name: "gcr.io/cloud-builders/gcloud"
    args:
      [
        "run",
        "deploy",
        "venus-backend",
        "--image",
        "gcr.io/$PROJECT_ID/venus-backend",
        "--region",
        "europe-west1",
        "--platform",
        "managed",
        "--allow-unauthenticated",
      ]

  # Build frontend
  - name: "node:18"
    entrypoint: npm
    args: ["run", "build"]
    dir: "frontend"

  # Deploy frontend
  - name: "gcr.io/cloud-builders/gsutil"
    args:
      [
        "-m",
        "rsync",
        "-r",
        "-d",
        "frontend/dist",
        "gs://$PROJECT_ID-venus-frontend",
      ]

images:
  - "gcr.io/$PROJECT_ID/venus-backend"
```

## 💰 Koszty

Szacowane koszty miesięczne:

- Cloud Run: ~$10-20
- Cloud SQL: ~$25-50
- Cloud Storage: ~$5-10
- **Razem: ~$40-80/miesiąc**

## 🔒 Bezpieczeństwo

### 1. Secrets Management

```bash
# Utworzenie secrets
echo -n "your-secure-password" | gcloud secrets create db-password --data-file=-
echo -n "your-jwt-secret" | gcloud secrets create jwt-secret --data-file=-
```

### 2. IAM

```bash
# Ograniczenie dostępu
gcloud projects add-iam-policy-binding venus-hotel-spa \
  --member="serviceAccount:venus-backend@venus-hotel-spa.iam.gserviceaccount.com" \
  --role="roles/cloudsql.client"
```

## 🚨 Troubleshooting

### Backend nie startuje

```bash
# Sprawdź logs
gcloud logging read "resource.type=cloud_run_revision AND resource.labels.service_name=venus-backend" --limit 10
```

### Frontend nie ładuje się

```bash
# Sprawdź bucket
gsutil ls gs://venus-hotel-spa-frontend/
```

### Baza danych nie łączy się

```bash
# Sprawdź connection
gcloud sql connect venus-postgres --user=strapi
```

## 📞 Support

W przypadku problemów:

1. Sprawdź logs w Google Cloud Console
2. Sprawdź status usług: `gcloud services list`
3. Sprawdź billing: `gcloud billing accounts list`
