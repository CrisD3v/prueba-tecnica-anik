# Proyecto Full Stack - PRUEBA TÉCNICA ANIK

Aplicación web completa desarrollada con React + TypeScript en el frontend y Node.js + Express + PostgreSQL en el backend, siguiendo arquitectura hexagonal y principios de Atomic Design.

## 📋 Descripción del Proyecto

Este proyecto implementa una aplicación moderna de gestión de productos que permite crear, listar, buscar y filtrar productos a través de una API REST robusta y una interfaz web intuitiva con funcionalidades avanzadas de filtrado.

### Tecnologías Utilizadas

**Backend:**
- Node.js 18+ con Express 5
- PostgreSQL con Sequelize ORM
- Arquitectura hexagonal con DDD
- Inyección de dependencias con Awilix
- Patrón Repository y Unit of Work
- Manejo de errores con Result Pattern

**Frontend:**
- React 19 con TypeScript
- Vite como bundler y dev server
- TailwindCSS 4 para estilos
- TanStack Query para estado del servidor
- Atomic Design para arquitectura de componentes
- shadcn/ui para componentes base
- Lucide React para iconografía

## 🚀 Instalación y Configuración

### Prerrequisitos

- Node.js (versión 18 o superior)
- PostgreSQL (versión 12 o superior)
- pnpm (recomendado) o npm

### 1. Clonar el repositorio

```bash
git clone https://github.com/CrisD3v/prueba-anik.git
cd prueba-anik
```

### 2. Configurar el Backend

#### Instalar dependencias
```bash
cd backend
pnpm install
```

#### Configurar variables de entorno
Copia el archivo de ejemplo y configura las variables:

```bash
cp .env.example .env
```

Edita el archivo `.env` con tus configuraciones:
```env
NODE_ENV=development
PORT=3000

# Database Configuration
DB_NAME=api_prueba
DB_USER=tu_usuario
DB_PASS=tu_contraseña
DB_HOST=localhost

# CORS Configuration
CORS_ALLOWED_ORIGINS=http://localhost:5173,http://127.0.0.1:5173
CORS_CREDENTIALS=true

# Security
SALT_ROUNDS=10
```

#### Configurar PostgreSQL
```sql
CREATE DATABASE api_prueba;
CREATE USER tu_usuario WITH PASSWORD 'tu_contraseña';
GRANT ALL PRIVILEGES ON DATABASE api_prueba TO tu_usuario;
```

#### Inicializar la base de datos
```bash
pnpm run init-db
```

### 3. Configurar el Frontend

```bash
cd ../frontend
pnpm install
```

## 🏃‍♂️ Ejecutar el Proyecto

### Opción 1: Ejecutar ambos servicios por separado

#### Terminal 1 - Backend
```bash
cd backend
pnpm run dev
```
El backend se ejecutará en `http://localhost:3000`

#### Terminal 2 - Frontend
```bash
cd frontend
pnpm run dev
```
El frontend se ejecutará en `http://localhost:5173`

### Opción 2: Scripts desde la raíz (recomendado)

Puedes agregar estos scripts al package.json raíz para mayor comodidad:

```json
{
  "scripts": {
    "dev": "concurrently \"cd backend && pnpm run dev\" \"cd frontend && pnpm run dev\"",
    "dev:backend": "cd backend && pnpm run dev",
    "dev:frontend": "cd frontend && pnpm run dev",
    "install:all": "cd backend && pnpm install && cd ../frontend && pnpm install",
    "build": "cd backend && pnpm run build && cd ../frontend && pnpm run build",
    "init-db": "cd backend && pnpm run init-db"
  }
}
```

### Funcionalidades Disponibles

Una vez ejecutado el proyecto, tendrás acceso a:

**Frontend (http://localhost:5173):**
- ✅ Catálogo de productos con grid responsivo
- ✅ Búsqueda en tiempo real por nombre (con normalización de texto)
- ✅ Filtro por rango de precios con slider interactivo
- ✅ Ordenamiento ascendente/descendente por precio
- ✅ Estadísticas de filtros aplicados
- ✅ Estado vacío cuando no hay resultados
- ✅ Interfaz moderna con TailwindCSS y componentes shadcn/ui
- ✅ Fallback automático a datos mock si la API no está disponible

**Backend (http://localhost:3000):**
- ✅ API REST con endpoints GET y POST para productos
- ✅ Arquitectura hexagonal con separación de capas
- ✅ Validaciones de dominio y manejo de errores robusto
- ✅ Base de datos PostgreSQL con Sequelize ORM
- ✅ CORS configurado para desarrollo y producción

## 📚 API Endpoints

### Base URL
```
http://localhost:3000/api
```

### Productos

#### Crear un producto
- **POST** `/products`
- **Content-Type:** `application/json`

**Body:**
```json
{
  "name": "Producto de ejemplo",
  "price": 29.99,
  "stock": 100
}
```

**Respuesta exitosa (201):**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "name": "Producto de ejemplo",
  "price": 29.99,
  "stock": 100,
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T10:30:00.000Z"
}
```

#### Obtener todos los productos
- **GET** `/products`

**Respuesta exitosa (200):**
```json
[
  {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "Producto de ejemplo",
    "price": 29.99,
    "stock": 100,
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
]
```

**Documentación completa:** Ver `backend/Docs/API_DOCUMENTATION.md`

## 🧪 Pruebas de la API

### Con cURL

#### Crear un producto
```bash
curl -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Laptop Gaming",
    "price": 1299.99,
    "stock": 15
  }'
```

#### Obtener todos los productos
```bash
curl -X GET http://localhost:3000/api/products
```

## 🏗️ Estructura del Proyecto

```
proyecto-fullstack/
├── backend/                    # API REST con Node.js
│   ├── Application/           # Capa de aplicación
│   │   └── Products/
│   │       ├── Services/      # Servicios de aplicación
│   │       └── UseCases/      # Casos de uso
│   ├── Domain/               # Capa de dominio
│   │   └── Products/
│   │       └── Entities/     # Entidades de negocio
│   ├── Infrastructure/       # Capa de infraestructura
│   │   ├── Products/
│   │   │   ├── Models/       # Modelos Sequelize
│   │   │   └── Repositories/ # Implementaciones de repositorios
│   │   └── UoW/             # Unit of Work
│   ├── Routes/              # Controladores HTTP
│   ├── Config/              # Configuración e IoC
│   ├── Shared/              # Utilidades compartidas
│   ├── Docs/                # Documentación técnica
│   ├── scripts/             # Scripts de utilidad
│   └── index.js             # Punto de entrada
├── frontend/                  # Aplicación React
│   ├── src/
│   │   ├── components/       # Componentes (Atomic Design)
│   │   │   ├── ui/          # Átomos (shadcn/ui)
│   │   │   ├── molecules/   # Moléculas
│   │   │   ├── organisms/   # Organismos
│   │   │   └── templates/   # Templates
│   │   ├── pages/           # Páginas completas
│   │   ├── hooks/           # Custom hooks
│   │   ├── lib/             # Configuración de librerías
│   │   ├── types/           # Tipos TypeScript
│   │   ├── utils/           # Utilidades
│   │   └── constants/       # Constantes
│   ├── docs/                # Documentación de arquitectura
│   └── public/              # Archivos estáticos
├── README.md                 # Este archivo
└── SQL.md                   # Documentación de base de datos
```

**Documentación detallada:**
- Backend: `backend/Docs/TECHNICAL_DOCUMENTATION.md`
- Frontend: `frontend/docs/ARCHITECTURE.md`

## 🛠️ Scripts Disponibles

### Backend
```bash
cd backend
pnpm run dev      # Modo desarrollo con auto-reload (--watch)
pnpm start        # Modo producción
pnpm run init-db  # Inicializar base de datos
pnpm test         # Ejecutar tests (pendiente)
```

### Frontend
```bash
cd frontend
pnpm run dev      # Servidor de desarrollo con HMR
pnpm run build    # Build para producción (TypeScript + Vite)
pnpm run preview  # Preview del build de producción
pnpm run lint     # Linting con ESLint
```

## 🔧 Troubleshooting

### Problemas comunes

#### Error de conexión a la base de datos
1. Verifica que PostgreSQL esté ejecutándose
2. Confirma las credenciales en `.env`
3. Asegúrate de que la base de datos existe
4. Ejecuta `pnpm run init-db` para inicializar

#### Puerto en uso
- Backend: Cambia `PORT` en `.env`
- Frontend: Vite asignará automáticamente otro puerto disponible

#### Problemas con CORS
- Verifica `CORS_ALLOWED_ORIGINS` en `.env`
- Por defecto permite `localhost:5173` y `127.0.0.1:5173`

#### Frontend funciona sin backend
- El frontend tiene fallback automático a datos mock
- TanStack Query maneja la reconexión automática

#### Problemas con pnpm
```bash
# Limpiar cache y reinstalar
rm -rf node_modules pnpm-lock.yaml
pnpm install

# Usar npm como alternativa
npm install
```

#### Errores de TypeScript en frontend
```bash
cd frontend
pnpm run build  # Verificar errores de compilación
```

## 📝 Desarrollo

### Flujo de trabajo recomendado

1. **Configurar base de datos** - PostgreSQL y ejecutar `init-db`
2. **Iniciar backend** - Verificar que la API responde correctamente
3. **Iniciar frontend** - Probar integración con la API
4. **Desarrollar features** - Seguir patrones establecidos
5. **Documentar cambios** - Actualizar documentación relevante

### Arquitecturas implementadas

**Backend - Arquitectura Hexagonal:**
- **Domain**: Entidades y reglas de negocio
- **Application**: Casos de uso y servicios
- **Infrastructure**: Repositorios y acceso a datos
- **Presentation**: Controladores HTTP

**Frontend - Atomic Design:**
- **Atoms**: Componentes UI básicos (shadcn/ui)
- **Molecules**: Combinaciones funcionales
- **Organisms**: Secciones complejas
- **Templates**: Layouts de página
- **Pages**: Páginas con lógica de estado

### Buenas prácticas implementadas

- ✅ TypeScript estricto en frontend
- ✅ Arquitectura hexagonal en backend
- ✅ Patrón Repository y Unit of Work
- ✅ Result Pattern para manejo de errores
- ✅ Inyección de dependencias con Awilix
- ✅ TanStack Query para estado del servidor
- ✅ Componentes reutilizables y tipados
- ✅ Normalización de texto para búsquedas
- ✅ Fallback automático a datos mock

## 🚨 Manejo de Errores

### Backend - Result Pattern
```json
{
  "code": "PRODUCT_ALREADY_EXISTS",
  "message": "Ya existe un producto con ese nombre"
}
```

**Códigos de error implementados:**
- `PRODUCT_ALREADY_EXISTS` - Producto duplicado
- `PRODUCT_NOT_FOUND` - Producto no encontrado
- `VALIDATION_ERROR` - Datos inválidos
- `MISSING_FIELDS` - Campos requeridos faltantes

### Frontend - Manejo Robusto
- ✅ TanStack Query para retry automático
- ✅ Fallback a datos mock si API no disponible
- ✅ Estados de carga y error bien definidos
- ✅ Notificaciones con Sonner (toast)
- ✅ Validación de tipos con TypeScript

## 🎯 Decisiones Tomadas

### Arquitectura y Patrones
- **Arquitectura Hexagonal en Backend**: Elegida para garantizar separación de responsabilidades, facilitar testing y permitir evolución independiente de cada capa
- **Atomic Design en Frontend**: Implementado para crear una jerarquía clara de componentes reutilizables y escalables
- **Result Pattern**: Adoptado para manejo explícito de errores sin excepciones, mejorando la legibilidad y robustez del código

### Tecnologías Específicas
- **TanStack Query**: Seleccionado sobre Redux por su especialización en estado del servidor, caché automático y manejo de sincronización
- **shadcn/ui**: Elegido sobre otras librerías UI por su accesibilidad nativa, customización con TailwindCSS y componentes headless

## ⚠️ Limitaciones Conocidas

### Consideraciones Técnicas
- **Testing**: No implementado aún (unitario, integración y E2E pendientes)
- **Validación de Esquemas**: Validaciones básicas implementadas, falta validación robusta con Joi/Zod
- **Logging**: Sin sistema de logging estructurado para producción

### Escalabilidad
- **Caché**: Sin implementación de caché (Redis) para consultas frecuentes
- **Rate Limiting**: No implementado, vulnerable a abuso en producción
- **Monitoreo**: Sin métricas ni health checks para observabilidad

## 📄 Licencia

ISC