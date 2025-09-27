# 🚂 Deploy Strapi na Railway (Darmowy)

## 📋 **KROKI DEPLOYU:**

### **1. Przygotuj Strapi do deployu**

```bash
cd backend
```

### **2. Utwórz konto na Railway**

- Wejdź na: https://railway.app/
- Zaloguj się przez GitHub
- Kliknij "New Project"

### **3. Połącz z GitHub**

- Wybierz "Deploy from GitHub repo"
- Wybierz repozytorium Venus
- Wybierz folder `backend`

### **4. Skonfiguruj zmienne środowiskowe**

W Railway Dashboard → Variables:

```env
NODE_ENV=production
DATABASE_CLIENT=postgres
DATABASE_HOST=your-railway-postgres-host
DATABASE_PORT=5432
DATABASE_NAME=railway
DATABASE_USERNAME=postgres
DATABASE_PASSWORD=your-password
JWT_SECRET=your-jwt-secret
ADMIN_JWT_SECRET=your-admin-jwt-secret
APP_KEYS=your-app-keys
API_TOKEN_SALT=your-api-token-salt
TRANSFER_TOKEN_SALT=your-transfer-token-salt
```

### **5. Deploy**

- Railway automatycznie zbuduje i wdroży Strapi
- URL będzie: `https://your-app-name.railway.app`

### **6. Skonfiguruj domenę**

- W Railway → Settings → Domains
- Dodaj custom domain (opcjonalnie)

---

## 🔧 **KONFIGURACJA STRAPI**

### **Aktualizuj config/database.js**

```javascript
module.exports = ({ env }) => ({
  connection: {
    client: "postgres",
    connection: {
      host: env("DATABASE_HOST"),
      port: env.int("DATABASE_PORT"),
      database: env("DATABASE_NAME"),
      user: env("DATABASE_USERNAME"),
      password: env("DATABASE_PASSWORD"),
      ssl: env.bool("DATABASE_SSL", false),
    },
  },
});
```

### **Aktualizuj config/server.js**

```javascript
module.exports = ({ env }) => ({
  host: env("HOST", "0.0.0.0"),
  port: env.int("PORT", 1337),
  url: env("PUBLIC_URL", "https://your-app-name.railway.app"),
});
```

---

## 🌐 **PO DEPLOYU:**

### **Strapi Admin Panel:**

```
https://your-app-name.railway.app/admin
```

### **Strapi API:**

```
https://your-app-name.railway.app/api
```

### **Dostęp:**

- **Admin**: Strapi panel online
- **Frontend**: Firebase API (produkcja)
- **Dane**: Synchronizowane między Strapi ↔ Firebase

---

## 💰 **KOSZTY:**

- **Railway**: $0-5/miesiąc (darmowy tier)
- **Firebase**: $0-10/miesiąc (darmowy tier)
- **Łącznie**: $0-15/miesiąc

---

## ✅ **ZALETY:**

- ✅ Strapi admin dostępny online
- ✅ Firebase dla produkcji (szybki)
- ✅ Darmowe przez długi czas
- ✅ Łatwa synchronizacja danych
- ✅ Backup w dwóch miejscach

**🎯 Po deployu będziesz mieć pełny dostęp do admina online!**
