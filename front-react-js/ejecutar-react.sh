#!/bin/bash

echo "========================================"
echo "EJECUTANDO FRONTEND REACT.JS"
echo "========================================"
echo

echo "Verificando si Node.js está instalado..."
if ! command -v node &> /dev/null; then
    echo "ERROR: Node.js no está instalado."
    echo "Por favor instala Node.js desde: https://nodejs.org/"
    exit 1
fi

echo "Node.js encontrado: $(node --version)"
echo

echo "Verificando si el backend Spring Boot está ejecutándose..."
echo "URL: http://localhost:8081/crm"
echo
echo "IMPORTANTE: Asegúrate de que el backend Spring Boot esté ejecutándose"
echo "en http://localhost:8081 antes de continuar."
echo

read -p "¿El backend está ejecutándose? (s/n): " continuar
if [[ ! $continuar =~ ^[Ss]$ ]]; then
    echo
    echo "Por favor ejecuta primero el backend Spring Boot."
    exit 1
fi

echo
echo "Instalando dependencias..."
npm install

if [ $? -ne 0 ]; then
    echo "ERROR: Error al instalar dependencias."
    exit 1
fi

echo
echo "Dependencias instaladas correctamente."
echo
echo "Iniciando aplicación React..."
echo "URL: http://localhost:3000"
echo
echo "Presiona Ctrl+C para detener la aplicación."
echo

npm start
