# Sistema CRM - Frontend React.js

Frontend desarrollado en React.js con TypeScript para el Sistema CRM de Gestión de Personas.

## 🚀 Características

- **React 18** con TypeScript
- **React Router** para navegación
- **React Bootstrap** para componentes UI
- **Axios** para comunicación con API
- **Font Awesome** para iconos
- **Responsive Design** para móviles y desktop

## 📋 Funcionalidades

### ✅ Gestión de Personas
- **Crear** nuevas personas
- **Editar** personas existentes
- **Eliminar** personas con confirmación
- **Listar** todas las personas

### ✅ Búsqueda y Filtros
- **Búsqueda** por nombre o apellido
- **Filtro** por sexo (Masculino/Femenino)
- **Filtro** por rol (Cliente/Empleado/Proveedor)

### ✅ Estadísticas
- Total de personas
- Personas con email
- Personas con teléfono
- Personas con rol

### ✅ Validaciones
- Campos obligatorios
- Validación de email
- Validación de edad
- Verificación de cédula única

## 🛠️ Tecnologías Utilizadas

- **React 18.2.0**
- **TypeScript 4.7.4**
- **React Router DOM 6.14.1**
- **React Bootstrap 2.8.0**
- **Bootstrap 5.3.0**
- **Axios 1.4.0**
- **Font Awesome 6.0.0**

## 📁 Estructura del Proyecto

```
front-react-js/
├── public/
│   ├── index.html
│   └── manifest.json
├── src/
│   ├── components/
│   │   ├── Navbar.tsx
│   │   ├── Home.tsx
│   │   ├── PersonaList.tsx
│   │   └── PersonaForm.tsx
│   ├── services/
│   │   └── api.ts
│   ├── types/
│   │   └── Persona.ts
│   ├── App.tsx
│   ├── App.css
│   ├── index.tsx
│   └── index.css
├── package.json
├── tsconfig.json
└── README.md
```

## 🚀 Instalación y Ejecución

### Prerrequisitos
- Node.js (versión 14 o superior)
- npm o yarn
- Backend Spring Boot ejecutándose en `http://localhost:8081`

### Instalación

1. **Instalar dependencias:**
   ```bash
   cd front-react-js
   npm install
   ```

2. **Ejecutar en modo desarrollo:**
   ```bash
   npm start
   ```

3. **Abrir en el navegador:**
   ```
   http://localhost:3000
   ```

### Scripts Disponibles

- `npm start` - Ejecuta la aplicación en modo desarrollo
- `npm build` - Construye la aplicación para producción
- `npm test` - Ejecuta las pruebas
- `npm eject` - Expone la configuración de webpack

## 🔧 Configuración

### Proxy API
El proyecto está configurado para hacer proxy a `http://localhost:8081` (backend Spring Boot).

```json
{
  "proxy": "http://localhost:8081"
}
```

### Variables de Entorno
Crear archivo `.env` en la raíz del proyecto:

```env
REACT_APP_API_URL=http://localhost:8081/crm
```

## 📱 Rutas de la Aplicación

- `/` - Página de inicio con estadísticas
- `/personas` - Lista de todas las personas
- `/personas/nueva` - Formulario para crear nueva persona
- `/personas/editar/:id` - Formulario para editar persona

## 🎨 Componentes Principales

### NavigationBar
Barra de navegación con enlaces a las diferentes secciones.

### Home
Página de inicio con estadísticas y características del sistema.

### PersonaList
Lista de personas con búsqueda, filtros y acciones CRUD.

### PersonaForm
Formulario para crear y editar personas con validaciones.

## 🔌 Servicios API

### personaService
Servicio que maneja todas las operaciones con la API:

- `obtenerTodas()` - Obtiene todas las personas
- `obtenerPorId(id)` - Obtiene una persona por ID
- `crear(persona)` - Crea una nueva persona
- `actualizar(id, persona)` - Actualiza una persona
- `eliminar(id)` - Elimina una persona
- `buscar(termino)` - Busca personas por término
- `filtrarPorRol(rol)` - Filtra por rol
- `filtrarPorSexo(sexo)` - Filtra por sexo
- `obtenerEstadisticas()` - Obtiene estadísticas
- `verificarCedula(cedula)` - Verifica si existe cédula
- `limpiarDuplicados()` - Limpia duplicados

## 🎯 Tipos TypeScript

### Persona
```typescript
interface Persona {
  id?: number;
  nombre: string;
  apellido: string;
  cedula: string;
  telefono?: string;
  email?: string;
  edad?: number;
  sexo?: Sexo;
  rol?: string;
}
```

### Sexo
```typescript
enum Sexo {
  M = 'M',
  F = 'F'
}
```

### EstadisticasPersonas
```typescript
interface EstadisticasPersonas {
  totalPersonas: number;
  personasConEmail: number;
  personasConTelefono: number;
  personasConRol: number;
}
```

## 🚀 Despliegue

### Construir para Producción
```bash
npm run build
```

### Servir Archivos Estáticos
```bash
npx serve -s build
```

## 🔍 Características Técnicas

- **TypeScript** para tipado estático
- **React Hooks** para manejo de estado
- **Async/Await** para operaciones asíncronas
- **Error Boundaries** para manejo de errores
- **Responsive Design** con Bootstrap
- **Accessibility** con ARIA labels
- **SEO** optimizado

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para detalles.

## 👨‍💻 Autor

Sistema CRM - Frontend React.js
Desarrollado para gestión de personas y contactos empresariales.
