# Frontend - Prueba Técnica ANIK

Aplicación React moderna desarrollada con TypeScript, Vite y TailwindCSS, siguiendo principios de Atomic Design y Clean Architecture.

## 🚀 Tecnologías Utilizadas

- **React 19** - Biblioteca de UI con las últimas características
- **TypeScript** - Tipado estático para mayor robustez
- **Vite** - Build tool moderno con HMR ultra-rápido
- **TailwindCSS 4** - Framework de CSS utility-first
- **TanStack Query** - Manejo de estado del servidor y caché
- **shadcn/ui** - Componentes UI modernos y accesibles
- **Lucide React** - Iconografía consistente y escalable

## 📁 Arquitectura - Atomic Design

El proyecto sigue los principios de **Atomic Design** para una arquitectura de componentes escalable:

```
src/
├── components/
│   ├── ui/              # Átomos - Componentes básicos (shadcn/ui)
│   ├── molecules/       # Moléculas - Combinaciones funcionales
│   ├── organisms/       # Organismos - Secciones complejas
│   └── templates/       # Templates - Layouts de página
├── pages/               # Páginas completas con lógica de estado
├── hooks/               # Custom hooks reutilizables
├── lib/                 # Configuración de librerías externas
├── types/               # Definiciones de tipos TypeScript
├── utils/               # Funciones utilitarias
└── constants/           # Constantes de la aplicación
```

## ✨ Funcionalidades Implementadas

### 🔍 Búsqueda y Filtros Avanzados
- ✅ Búsqueda en tiempo real por nombre de producto
- ✅ Normalización de texto (maneja acentos y caracteres especiales)
- ✅ Filtro por rango de precios con slider interactivo
- ✅ Ordenamiento ascendente/descendente por precio
- ✅ Estadísticas de filtros aplicados en tiempo real

### 🎨 Interfaz de Usuario Moderna
- ✅ Diseño responsivo con TailwindCSS
- ✅ Componentes reutilizables con shadcn/ui
- ✅ Estados de carga y error bien definidos
- ✅ Animaciones suaves y transiciones
- ✅ Accesibilidad (a11y) considerada en todos los componentes

### 🔄 Gestión de Estado Robusta
- ✅ TanStack Query para estado del servidor
- ✅ Caché inteligente con invalidación automática
- ✅ Fallback automático a datos mock si API no disponible
- ✅ Retry automático en caso de errores de red
- ✅ Optimistic updates para mejor UX

### 🛠️ Desarrollo y Calidad
- ✅ TypeScript estricto con tipos bien definidos
- ✅ ESLint configurado para React y TypeScript
- ✅ Componentes documentados con JSDoc
- ✅ Estructura de carpetas clara y escalable
- ✅ Separación de responsabilidades

## 🏃‍♂️ Scripts Disponibles

```bash
# Desarrollo
pnpm run dev      # Servidor de desarrollo con HMR
pnpm run build    # Build para producción
pnpm run preview  # Preview del build de producción
pnpm run lint     # Linting con ESLint

# Utilidades
pnpm install      # Instalar dependencias
```

## 🔧 Configuración del Proyecto

### Vite Configuration
El proyecto utiliza Vite con las siguientes optimizaciones:
- **SWC** para Fast Refresh ultra-rápido
- **TailwindCSS Plugin** integrado
- **TypeScript** con configuración estricta
- **Path aliases** para imports limpios

### ESLint Configuration
Configuración robusta que incluye:
- Reglas específicas para React 19
- TypeScript strict mode
- React Hooks rules
- Accessibility rules (a11y)

### TailwindCSS 4
Utiliza la última versión con:
- CSS-in-JS nativo
- Mejor performance
- Nuevas utilidades
- Configuración simplificada

## 📚 Documentación Detallada

- **Arquitectura**: `docs/ARCHITECTURE.md`
- **Guía de Componentes**: `docs/COMPONENT_GUIDE.md`

## 🎯 Patrones Implementados

### Custom Hooks
- `useProducts()` - Obtener productos con fallback
- `useCreateProduct()` - Crear productos con optimistic updates
- `useProductFilters()` - Lógica completa de filtros

### Utilidades
- `textUtils` - Normalización y highlighting de texto
- `productUtils` - Filtrado y ordenamiento optimizado
- `api` - Cliente HTTP con manejo de errores

### Tipos TypeScript
- Interfaces bien definidas para todos los datos
- Tipos de utilidad para mejor DX
- Exportaciones centralizadas

## 🚀 Próximas Mejoras

### Funcionalidades
- [ ] Paginación de productos
- [ ] Filtros adicionales (categorías, stock)
- [ ] Carrito de compras
- [ ] Wishlist de productos

### Técnicas
- [ ] Testing con Vitest y Testing Library
- [ ] Storybook para documentación de componentes
- [ ] PWA capabilities
- [ ] Internacionalización (i18n)

## 🤝 Contribución

Para contribuir al proyecto:
1. Seguir la estructura de Atomic Design
2. Documentar componentes con JSDoc
3. Mantener tipado estricto con TypeScript
4. Usar convenciones de naming consistentes
5. Actualizar documentación cuando sea necesario
