# 🚂 Railway - Szybki Start

## 📋 Checklist przed deployem

- [ ] Backend jest w osobnym repozytorium
- [ ] Masz konto na Railway (przez GitHub)
- [ ] Masz konto na GitHub
- [ ] Backend ma wszystkie pliki konfiguracyjne

## 🚀 Szybki Deploy (5 minut)

### 1. Przygotuj backend

```bash
cd backend
./prepare-railway-deploy.sh
```

### 2. Utwórz repozytorium GitHub

- Nazwa: `venus-strapi-backend`
- Publiczne
- Opis: "Strapi CMS for Venus Hotel & SPA"

### 3. Wypchnij kod

```bash
git remote add origin https://github.com/twoja-nazwa/venus-strapi-backend.git
git branch -M main
git add .
git commit -m "Initial commit for Railway deploy"
git push -u origin main
```

### 4. Railway Setup

1. Przejdź na [railway.app](https://railway.app/)
2. Zaloguj się przez GitHub
3. "New Project" → "Deploy from GitHub repo"
4. Wybierz `venus-strapi-backend`
5. Kliknij "Deploy"

### 5. Dodaj PostgreSQL

1. W projekcie Railway kliknij "New"
2. "Database" → "PostgreSQL"
3. Railway automatycznie połączy z aplikacją

### 6. Skonfiguruj zmienne środowiskowe

W zakładce "Variables" dodaj:

```env
DATABASE_CLIENT=postgres
DATABASE_URL=${DATABASE_URL}
NODE_ENV=production
PORT=${PORT}
HOST=0.0.0.0
ADMIN_PATH=/admin
CORS_ORIGIN=*
```

### 7. Wygeneruj klucze bezpieczeństwa

```bash
./generate-keys.sh
```

Skopiuj wygenerowane klucze do Railway Variables:

- `APP_KEYS=klucz1,klucz2,klucz3,klucz4`
- `API_TOKEN_SALT=twój-salt`
- `ADMIN_JWT_SECRET=twój-admin-secret`
- `JWT_SECRET=twój-jwt-secret`

### 8. Sprawdź deploy

- Zielony status = działa
- URL: `https://twoj-projekt.up.railway.app/admin`

## 🔧 Po deployu

### Stwórz konto admina

1. Otwórz `https://twoj-projekt.up.railway.app/admin`
2. Stwórz konto administratora
3. Dodaj zawartość (pokoje, SPA, atrakcje)

### Test API

```bash
curl https://twoj-projekt.up.railway.app/api/rooms
curl https://twoj-projekt.up.railway.app/api/spa-services
curl https://twoj-projekt.up.railway.app/api/attractions
```

### Aktualizuj frontend

W `frontend/src/config/api.ts`:

```typescript
const API_BASE_URL = import.meta.env.PROD
  ? "https://twoj-projekt.up.railway.app/api"
  : "http://localhost:1337/api";
```

## 💰 Koszty

- **Darmowy tier**: 500h/miesiąc
- **Po przekroczeniu**: $5/miesiąc
- **Baza PostgreSQL**: w cenie

## 🆘 Problemy?

### Build failed

- Sprawdź logi w Railway
- Upewnij się, że `package.json` ma wszystkie zależności

### Database connection failed

- Sprawdź czy PostgreSQL jest dodany
- Sprawdź `DATABASE_URL` w Variables

### Admin panel not accessible

- Sprawdź czy aplikacja się uruchomiła (zielony status)
- Sprawdź logi aplikacji

## 📞 Pomoc

- [Railway Docs](https://docs.railway.app/)
- [Strapi Docs](https://docs.strapi.io/)
- Logi w Railway Dashboard
