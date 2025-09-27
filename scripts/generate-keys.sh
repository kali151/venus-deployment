#!/bin/bash

echo "🔐 Generowanie bezpiecznych kluczy dla Strapi na Railway"
echo "=================================================="
echo ""

echo "📝 APP_KEYS (4 klucze, oddzielone przecinkami):"
echo "----------------------------------------"
for i in {1..4}; do
  key=$(openssl rand -base64 32)
  echo "Klucz $i: $key"
done
echo ""

echo "🔑 API_TOKEN_SALT:"
echo "------------------"
openssl rand -base64 32
echo ""

echo "🔐 ADMIN_JWT_SECRET:"
echo "-------------------"
openssl rand -base64 32
echo ""

echo "🔑 JWT_SECRET:"
echo "-------------"
openssl rand -base64 32
echo ""

echo "✅ Skopiuj te klucze do zmiennych środowiskowych w Railway!"
echo "💡 Pamiętaj: każdy klucz musi być unikalny!" 