@echo off
echo 🔧 Limpiando y reinstalando dependencias de React...
echo.

echo 1. Deteniendo servidor de desarrollo (si está corriendo)...
taskkill /f /im node.exe 2>nul

echo.
echo 2. Limpiando cache de npm...
call npm cache clean --force

echo.
echo 3. Eliminando node_modules...
if exist node_modules rmdir /s /q node_modules

echo.
echo 4. Eliminando package-lock.json...
if exist package-lock.json del package-lock.json

echo.
echo 5. Reinstalando dependencias...
call npm install

echo.
echo 6. Verificando instalación...
call npm list --depth=0

echo.
echo ✅ ¡Dependencias reinstaladas!
echo 🚀 Para ejecutar: npm start
echo.

pause
