# Proyecto Full Stack - PRUEBA TÉCNICA ANIK

Aplicación web completa desarrollada con React + TypeScript en el frontend y Node.js + Express + PostgreSQL en el backend, siguiendo arquitectura hexagonal.

## 📋 Descripción del Proyecto

Este proyecto consiste en una aplicación de gestión de productos que permite crear y listar productos a través de una API REST y una interfaz web moderna.

### Tecnologías Utilizadas

**Backend:**
- Node.js con Express
- PostgreSQL con Sequelize ORM
- Arquitectura hexagonal
- Inyección de dependencias con Awilix
- Variables de entorno con dotenv

**Frontend:**
- React 19 con TypeScript
- Vite como bundler
- TailwindCSS para estilos
- TanStack Query para manejo de estado del servidor
- ESLint para linting

## 🚀 Instalación y Configuración

### Prerrequisitos

- Node.js (versión 18 o superior)
- PostgreSQL (versión 12 o superior)
- pnpm (recomendado) o npm

### 1. Clonar el repositorio

```bash
git clone <https://github.com/CrisD3v/prueba-anik.git>
cd prueba-anik
```

### 2. Configurar el Backend

#### Instalar dependencias
```bash
cd backend
pnpm install
```

#### Configurar variables de entorno
Copia y edita el archivo `.env`:

```bash
cp .env .env.local
```

Configura las variables en `.env`:
```env
NODE_ENV=development
PORT=3000

# Database Configuration
DB_NAME=tu_base_de_datos
DB_USER=tu_usuario
DB_PASS=tu_contraseña
DB_HOST=localhost

# Security
SALT_ROUNDS=10
```

#### Configurar PostgreSQL
```sql
CREATE DATABASE api_prueba;
CREATE USER tu_usuario WITH PASSWORD 'tu_contraseña';
GRANT ALL PRIVILEGES ON DATABASE tu_base_de_datos TO tu_usuario;
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
    "install:all": "cd backend && pnpm install && cd ../frontend && pnpm install"
  }
}
```

## 🛠️ Scripts Disponibles

### Backend
```bash
cd backend
pnpm run dev      # Modo desarrollo con auto-reload
pnpm start        # Modo producción
pnpm test         # Ejecutar tests
```

### Frontend
```bash
cd frontend
pnpm run dev      # Servidor de desarrollo
pnpm run build    # Build para producción
pnpm run preview  # Preview del build
pnpm run lint     # Linting con ESLint
```

## 🔧 Troubleshooting

### Problemas comunes

#### Error de conexión a la base de datos
1. Verifica que PostgreSQL esté ejecutándose
2. Confirma las credenciales en `.env`
3. Asegúrate de que la base de datos existe

#### Puerto en uso
- Backend: Cambia `PORT` en `.env`
- Frontend: Vite asignará automáticamente otro puerto

#### Problemas con CORS
El backend debe estar configurado para permitir requests desde `http://localhost:5173`

#### Problemas con pnpm
```bash
# Usar npm como alternativa
rm pnpm-lock.yaml
npm install
```

## 📝 Desarrollo

### Flujo de trabajo recomendado

1. Iniciar el backend primero
2. Verificar que la API responde correctamente
3. Iniciar el frontend
4. Desarrollar features incrementalmente
5. Probar la integración entre frontend y backend

### Buenas prácticas

- Usar TypeScript en el frontend para type safety
- Seguir la arquitectura hexagonal en el backend
- Implementar manejo de errores consistente
- Usar TanStack Query para cache y sincronización
- Aplicar principios de diseño responsive

## 🚨 Manejo de Errores

### Backend
```json
{
  "code": "VALIDATION_ERROR",
  "message": "Descripción del error"
}
```

### Frontend
- Manejo de errores con TanStack Query
- Fallbacks para estados de carga y error
- Notificaciones de usuario amigables

## 📄 Licencia

ISC