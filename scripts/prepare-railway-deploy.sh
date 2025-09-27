#!/bin/bash

echo "🚂 Przygotowanie Strapi do deployu na Railway"
echo "============================================="
echo ""

# Sprawdź czy backend istnieje
if [ ! -d "backend" ] || [ ! -f "backend/package.json" ] || [ ! -f "backend/config/database.ts" ]; then
  echo "❌ Błąd: Katalog backend nie istnieje lub nie zawiera Strapi!"
  echo "   Upewnij się, że masz katalog backend z plikami Strapi"
  exit 1
fi

echo "✅ Znaleziono Strapi w katalogu backend"
echo ""

# Sprawdź czy git jest zainicjalizowany w backend
if [ ! -d "backend/.git" ]; then
  echo "📁 Inicjalizacja git w backend..."
  cd backend
  git init
  cd ..
  echo "✅ Git zainicjalizowany w backend"
else
  echo "✅ Git już zainicjalizowany w backend"
fi

# Sprawdź czy .gitignore zawiera .env
if grep -q "\.env" backend/.gitignore; then
  echo "✅ .env jest w .gitignore"
else
  echo "⚠️  Dodaj .env do backend/.gitignore jeśli nie ma"
fi

echo ""
echo "📋 Następne kroki:"
echo "=================="
echo ""
echo "1. 🗂️  Utwórz nowe repozytorium na GitHub:"
echo "   - Nazwa: venus-strapi-backend"
echo "   - Opis: Strapi CMS for Venus Hotel & SPA"
echo "   - Publiczne"
echo ""
echo "2. 🔗 Połącz z GitHub:"
echo "   cd backend"
echo "   git remote add origin https://github.com/twoja-nazwa/venus-strapi-backend.git"
echo "   git branch -M main"
echo "   git add ."
echo "   git commit -m 'Initial commit for Railway deploy'"
echo "   git push -u origin main"
echo "   cd .."
echo ""
echo "3. 🚂 Przejdź do Railway:"
echo "   - https://railway.app/"
echo "   - Zaloguj się przez GitHub"
echo "   - New Project → Deploy from GitHub repo"
echo "   - Wybierz venus-strapi-backend"
echo ""
echo "4. 🔐 Wygeneruj klucze bezpieczeństwa:"
echo "   ./generate-keys.sh"
echo ""
echo "5. ⚙️  Skonfiguruj zmienne środowiskowe w Railway"
echo ""
echo "✅ Gotowe do deployu!" 