@echo off
echo ========================================
echo EJECUTANDO FRONTEND REACT.JS
echo ========================================
echo.

echo Verificando si Node.js está instalado...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ERROR: Node.js no está instalado.
    echo Por favor instala Node.js desde: https://nodejs.org/
    pause
    exit /b 1
)

echo Node.js encontrado.
echo.

echo Verificando si el backend Spring Boot está ejecutándose...
echo URL: http://localhost:8081/crm
echo.
echo IMPORTANTE: Asegúrate de que el backend Spring Boot esté ejecutándose
echo en http://localhost:8081 antes de continuar.
echo.

set /p continuar="¿El backend está ejecutándose? (s/n): "
if /i not "%continuar%"=="s" (
    echo.
    echo Por favor ejecuta primero el backend Spring Boot.
    pause
    exit /b 1
)

echo.
echo Instalando dependencias...
call npm install

if %errorlevel% neq 0 (
    echo ERROR: Error al instalar dependencias.
    pause
    exit /b 1
)

echo.
echo Dependencias instaladas correctamente.
echo.
echo Iniciando aplicación React...
echo URL: http://localhost:3000
echo.
echo Presiona Ctrl+C para detener la aplicación.
echo.

call npm start

pause
