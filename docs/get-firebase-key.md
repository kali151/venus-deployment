# 🔑 Jak pobrać klucz serwisowy Firebase

## 📋 KROKI:

### 1. Otwórz Firebase Console

```
https://console.firebase.google.com/project/venus-hotel-spa
```

### 2. Przejdź do Ustawień Projektu

- Kliknij ikonę ⚙️ (koło zębate) obok "Project Overview"
- Wybierz "Project settings"

### 3. Przejdź do zakładki "Service accounts"

- Kliknij zakładkę "Service accounts"
- Wybierz "Firebase Admin SDK"

### 4. Wygeneruj nowy klucz prywatny

- Kliknij "Generate new private key"
- Wybierz "JSON" format
- Kliknij "Generate key"

### 5. Zapisz plik

- Pobierz plik JSON
- Zmień nazwę na `firebase-service-account.json`
- Umieść w głównym katalogu projektu (`/venus/`)

## 🔒 BEZPIECZEŃSTWO:

- **NIE commituj** tego pliku do Git
- Dodaj do `.gitignore`
- Ten klucz daje pełny dostęp do Firebase

## ✅ PO POBRANIU:

```bash
# Uruchom migrację
node migrate-strapi-to-firebase.js
```

---

**Po pobraniu klucza, uruchom migrację!** 🚀
