# 🚀 Migration Guide: Local Strapi → Railway Strapi

## Przegląd

Ten przewodnik pomoże Ci przenieść dane z lokalnego Strapi (SQLite) do Railway Strapi (PostgreSQL).

## 📋 Wymagania

### 1. Uruchomiony lokalny Strapi

```bash
cd backend
npm run develop
```

Lokalny Strapi powinien być dostępny na: http://localhost:1337

### 2. Działający Railway Strapi

URL: https://venus-strapi-backend-production.up.railway.app
Admin: https://venus-strapi-backend-production.up.railway.app/admin

## 🔑 Krok 1: Utwórz API Tokens

### A. Token dla lokalnego Strapi

1. Otwórz: http://localhost:1337/admin
2. Idź do: **Settings → API Tokens**
3. Kliknij: **Create new token**
4. Ustaw:
   - **Name:** Migration Token
   - **Token Type:** Full access
   - **Duration:** Unlimited
5. **Skopiuj token i zachowaj!**

### B. Token dla Railway Strapi

1. Otwórz: https://venus-strapi-backend-production.up.railway.app/admin
2. Idź do: **Settings → API Tokens**
3. Kliknij: **Create new token**
4. Ustaw:
   - **Name:** Migration Token
   - **Token Type:** Full access
   - **Duration:** Unlimited
5. **Skopiuj token i zachowaj!**

## ⚙️ Krok 2: Skonfiguruj skrypt migracji

Edytuj plik `migrate-to-railway.js`:

```javascript
// Znajdź te linie i wstaw swoje tokeny:
const LOCAL_TOKEN = "twoj-lokalny-token-tutaj";
const RAILWAY_TOKEN = "twoj-railway-token-tutaj";
```

## 🚀 Krok 3: Uruchom migrację

```bash
# Opcja 1: Bezpośrednio
node migrate-to-railway.js

# Opcja 2: Przez npm script
npm run migrate:railway
```

## 📊 Co zostanie zmigrowane

- ✅ **Pokoje** (rooms)
- ✅ **Usługi SPA** (spa-services)
- ✅ **Atrakcje** (attractions)
- ✅ **Galerie** (galleries)
- ✅ **Strony kontaktowe** (contact-pages)
- ✅ **Strony** (pages)

## 🔍 Weryfikacja

Po migracji sprawdź:

1. **Railway Strapi Admin:**
   https://venus-strapi-backend-production.up.railway.app/admin

2. **API Endpoints:**

   ```bash
   curl https://venus-strapi-backend-production.up.railway.app/api/rooms
   curl https://venus-strapi-backend-production.up.railway.app/api/attractions
   curl https://venus-strapi-backend-production.up.railway.app/api/spa-services
   ```

3. **Frontend:**
   Zaktualizuj `frontend/src/config/api.ts` aby używał Railway URL zamiast localhost

## ⚠️ Rozwiązywanie problemów

### Problem: "Local Strapi is not running"

**Rozwiązanie:**

```bash
cd backend
npm run develop
```

### Problem: "Please set your API tokens"

**Rozwiązanie:** Upewnij się, że zastąpiłeś placeholder tokeny prawdziwymi tokenami z obu Strapi

### Problem: "HTTP error! status: 401"

**Rozwiązanie:**

- Sprawdź czy tokeny są poprawne
- Upewnij się, że tokeny mają "Full access"

### Problem: "HTTP error! status: 403"

**Rozwiązanie:**

- W Railway Strapi Admin: Settings → Roles → Authenticated → włącz uprawnienia dla wszystkich content types

## 🎯 Po migracji

1. **Zaktualizuj frontend** aby używał Railway API
2. **Skonfiguruj uprawnienia** w Railway Strapi (Settings → Roles → Public)
3. **Przetestuj wszystkie funkcjonalności**

## 📞 Wsparcie

Jeśli masz problemy:

1. Sprawdź logi w Railway Dashboard
2. Upewnij się, że oba Strapi działają
3. Zweryfikuj API tokeny
