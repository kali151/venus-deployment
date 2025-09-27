# 🚂 Deploy Strapi na Railway

## Krok 1: Przygotowanie repozytorium

1. **Upewnij się, że backend jest w osobnym repozytorium**

   ```bash
   # Jeśli backend jest w podkatalogu, przenieś go do osobnego repo
   cd backend
   git init
   git add .
   git commit -m "Initial commit for Railway deploy"
   ```

2. **Utwórz nowe repozytorium na GitHub**

   - Nazwa: `venus-strapi-backend`
   - Opis: "Strapi CMS for Venus Hotel & SPA"
   - Publiczne (Railway może łatwiej się połączyć)

3. **Wypchnij kod do GitHub**
   ```bash
   git remote add origin https://github.com/twoja-nazwa/venus-strapi-backend.git
   git branch -M main
   git push -u origin main
   ```

## Krok 2: Setup Railway

1. **Załóż konto na [Railway](https://railway.app/)**

   - Możesz użyć GitHub OAuth

2. **Utwórz nowy projekt**

   - Kliknij "New Project"
   - Wybierz "Deploy from GitHub repo"
   - Wybierz repozytorium `venus-strapi-backend`

3. **Railway automatycznie wykryje Strapi**
   - Pokaże się "Strapi" jako typ aplikacji
   - Kliknij "Deploy"

## Krok 3: Konfiguracja bazy danych

1. **Dodaj PostgreSQL**

   - W projekcie Railway kliknij "New"
   - Wybierz "Database" → "PostgreSQL"
   - Railway automatycznie połączy bazę z aplikacją

2. **Sprawdź zmienne środowiskowe**
   - Railway automatycznie ustawi `DATABASE_URL`
   - Sprawdź w zakładce "Variables"

## Krok 4: Konfiguracja zmiennych środowiskowych

1. **W zakładce "Variables" dodaj:**

   ```env
   # Database (Railway ustawi automatycznie)
   DATABASE_CLIENT=postgres
   DATABASE_URL=${DATABASE_URL}

   # App
   NODE_ENV=production
   PORT=${PORT}
   HOST=0.0.0.0

   # Security (wygeneruj bezpieczne klucze)
   APP_KEYS=key1,key2,key3,key4
   API_TOKEN_SALT=your-api-token-salt
   ADMIN_JWT_SECRET=your-admin-jwt-secret
   JWT_SECRET=your-jwt-secret

   # Admin
   ADMIN_PATH=/admin

   # CORS
   CORS_ORIGIN=*
   ```

2. **Wygeneruj bezpieczne klucze:**

   ```bash
   # APP_KEYS (4 klucze)
   openssl rand -base64 32
   openssl rand -base64 32
   openssl rand -base64 32
   openssl rand -base64 32

   # API_TOKEN_SALT
   openssl rand -base64 32

   # ADMIN_JWT_SECRET
   openssl rand -base64 32

   # JWT_SECRET
   openssl rand -base64 32
   ```

## Krok 5: Deploy

1. **Railway automatycznie zbuduje i wdroży aplikację**

   - Możesz śledzić logi w czasie rzeczywistym
   - Pierwszy build może potrwać 5-10 minut

2. **Sprawdź status deployu**
   - Zielony status = aplikacja działa
   - Czerwony = sprawdź logi

## Krok 6: Pierwsze uruchomienie

1. **Otwórz panel admina**

   - URL: `https://twoj-projekt.up.railway.app/admin`
   - Stwórz konto administratora

2. **Skonfiguruj zawartość**
   - Dodaj pokoje, SPA, atrakcje
   - Prześlij zdjęcia

## Krok 7: Test API

1. **Sprawdź endpointy:**

   ```bash
   # Lista pokoi
   curl https://twoj-projekt.up.railway.app/api/rooms

   # Lista SPA
   curl https://twoj-projekt.up.railway.app/api/spa-services

   # Lista atrakcji
   curl https://twoj-projekt.up.railway.app/api/attractions
   ```

## Krok 8: Aktualizacja frontend

1. **Zaktualizuj URL API w frontend:**
   ```typescript
   // frontend/src/config/api.ts
   const API_BASE_URL = import.meta.env.PROD
     ? "https://twoj-projekt.up.railway.app/api"
     : "http://localhost:1337/api";
   ```

## 🔧 Troubleshooting

### Problem: "Build failed"

- Sprawdź logi w Railway
- Upewnij się, że `package.json` ma wszystkie zależności
- Sprawdź czy Node.js wersja jest kompatybilna

### Problem: "Database connection failed"

- Sprawdź czy PostgreSQL jest dodany do projektu
- Sprawdź zmienną `DATABASE_URL`
- Upewnij się, że `DATABASE_CLIENT=postgres`

### Problem: "Admin panel not accessible"

- Sprawdź czy aplikacja się uruchomiła (zielony status)
- Sprawdź logi aplikacji
- Upewnij się, że `ADMIN_PATH=/admin`

## 📊 Monitoring

1. **Railway Dashboard**

   - Status aplikacji
   - Użycie zasobów
   - Logi w czasie rzeczywistym

2. **Custom Domain (opcjonalnie)**
   - Możesz dodać własną domenę
   - Railway automatycznie skonfiguruje SSL

## 💰 Koszty

- **Darmowy tier**: 500 godzin/miesiąc
- **Po przekroczeniu**: $5/miesiąc
- **Baza PostgreSQL**: w cenie

## 🔄 Aktualizacje

1. **Automatyczne deployy**

   - Każdy push do `main` automatycznie wdraża zmiany
   - Możesz wyłączyć w ustawieniach

2. **Manualne deployy**
   - W Railway Dashboard kliknij "Deploy"
   - Możesz wybrać konkretny commit

## 🚀 Następne kroki

1. **Skonfiguruj Firebase Functions** (API proxy)
2. **Zaktualizuj frontend** (nowe URL API)
3. **Dodaj custom domain**
4. **Skonfiguruj monitoring**
5. **Dodaj backup bazy danych**
