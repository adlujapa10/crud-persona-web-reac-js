#!/bin/bash
echo "🔧 Limpiando y reinstalando dependencias de React..."
echo

echo "1. Deteniendo servidor de desarrollo (si está corriendo)..."
pkill -f "react-scripts" 2>/dev/null || true

echo
echo "2. Limpiando cache de npm..."
npm cache clean --force

echo
echo "3. Eliminando node_modules..."
rm -rf node_modules

echo
echo "4. Eliminando package-lock.json..."
rm -f package-lock.json

echo
echo "5. Reinstalando dependencias..."
npm install

echo
echo "6. Verificando instalación..."
npm list --depth=0

echo
echo "✅ ¡Dependencias reinstaladas!"
echo "🚀 Para ejecutar: npm start"
echo
