# 🚀 Instrucciones Rápidas - Frontend React.js

## ✅ Estado Actual
- **Backend Spring Boot:** ✅ Ejecutándose en http://localhost:8081/crm
- **Frontend React:** ⏳ Listo para ejecutar

## 🎯 Pasos para Ejecutar el Frontend

### Opción 1: Script Automático (Recomendado)

#### En Windows:
```bash
cd front-react-js
instalar-y-ejecutar.bat
```

#### En macOS/Linux:
```bash
cd front-react-js
chmod +x instalar-y-ejecutar.sh
./instalar-y-ejecutar.sh
```

### Opción 2: Comandos Manuales

```bash
# 1. Navegar al directorio
cd front-react-js

# 2. Instalar dependencias
npm install

# 3. Ejecutar aplicación
npm start
```

## 🌐 URLs de Acceso

- **Frontend React:** http://localhost:3000
- **Backend Spring:** http://localhost:8081/crm

## 🔧 Configuración

El proyecto está configurado para:
- **Proxy API:** http://localhost:8081 (configurado en package.json)
- **Base URL:** /crm (configurado en api.ts)
- **Puerto:** 3000 (React por defecto)

## 📱 Funcionalidades Disponibles

### ✅ Página de Inicio
- Estadísticas en tiempo real
- Accesos rápidos
- Información del sistema

### ✅ Gestión de Personas
- **Listar** todas las personas
- **Crear** nueva persona
- **Editar** persona existente
- **Eliminar** con confirmación

### ✅ Búsqueda y Filtros
- Búsqueda por nombre/apellido
- Filtro por sexo
- Filtro por rol

### ✅ Validaciones
- Campos obligatorios
- Validación de email
- Validación de edad
- Verificación de cédula única

## 🛠️ Solución de Problemas

### Error: "Module not found"
```bash
npm install
```

### Error: "Cannot connect to backend"
- Verifica que el backend esté ejecutándose en http://localhost:8081/crm
- Revisa la consola del navegador para errores de CORS

### Error: "Port 3000 already in use"
```bash
# En Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# En macOS/Linux
lsof -ti:3000 | xargs kill -9
```

## 📞 Soporte

Si encuentras problemas:
1. Verifica que Node.js esté instalado: `node --version`
2. Verifica que el backend esté ejecutándose
3. Revisa la consola del navegador (F12)
4. Revisa la terminal para errores de npm

¡El frontend React está listo para usar! 🎉
