#!/bin/bash

echo "🔧 Naprawianie wszystkich hardcoded API URLs..."

# Lista plików do naprawienia
files=(
  "frontend/src/pages/AttractionDetailPage.tsx"
  "frontend/src/pages/Contact.tsx"
  "frontend/src/pages/Room.tsx"
  "frontend/src/pages/Attractions.tsx"
  "frontend/src/pages/SpaDetailPage.tsx"
  "frontend/src/pages/SpaListPage.tsx"
  "frontend/src/pages/About.tsx"
)

for file in "${files[@]}"; do
  if [ -f "$file" ]; then
    echo "📝 Naprawiam: $file"
    
    # Dodaj import API config jeśli go nie ma
    if ! grep -q "apiCall, API_ENDPOINTS, API_BASE_URL" "$file"; then
      # Znajdź pierwszą linię z importem i dodaj nasz import po niej
      sed -i '' '1i\
import { apiCall, API_ENDPOINTS, API_BASE_URL } from "../config/api";
' "$file"
    fi
    
    # Zamień wszystkie fetch calls
    sed -i '' 's|fetch("http://localhost:1337/api/|apiCall(API_ENDPOINTS.|g' "$file"
    sed -i '' 's|fetch(`http://localhost:1337/api/|apiCall(`${API_ENDPOINTS.|g' "$file"
    
    # Zamień image URLs
    sed -i '' 's|`http://localhost:1337${|`${API_BASE_URL}${|g' "$file"
    sed -i '' 's|"http://localhost:1337${|"${API_BASE_URL}${|g' "$file"
    
  else
    echo "⚠️  Plik nie istnieje: $file"
  fi
done

echo "✅ Zakończono naprawianie API URLs!"