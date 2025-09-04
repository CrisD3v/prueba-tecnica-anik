# Arquitectura del Proyecto - Atomic Design

Este proyecto implementa una arquitectura moderna siguiendo los principios de **Atomic Design**, **Clean Architecture**, **Component Pattern** y **mejores prácticas** de React 19 con TypeScript.

## 🎯 Principios Arquitectónicos

### 1. Atomic Design
Organización jerárquica de componentes desde elementos básicos hasta páginas completas.

### 2. Separación de Responsabilidades
- **Presentación**: Componentes UI puros
- **Lógica**: Custom hooks y utilidades
- **Estado**: TanStack Query para servidor, useState para local
- **Tipos**: Interfaces TypeScript bien definidas

### 3. Composición sobre Herencia
Componentes pequeños y composables que se combinan para crear funcionalidades complejas.

### 4. Inmutabilidad y Funcional
Uso de patrones funcionales, hooks y estado inmutable.

## 📁 Estructura del Proyecto

```
src/
├── components/           # Componentes organizados por Atomic Design
│   ├── ui/              # Componentes base (atoms) - mantienen su ubicación original
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── card.tsx
│   │   └── ...
│   ├── molecules/       # Combinaciones de átomos
│   │   ├── SearchBar/
│   │   ├── PriceRangeFilter/
│   │   ├── SortToggle/
│   │   ├── FilterStats/
│   │   ├── ProductCard/
│   │   └── EmptyState/
│   ├── organisms/       # Secciones complejas
│   │   ├── Header/
│   │   ├── FilterSidebar/
│   │   └── ProductGrid/
│   └── templates/       # Layouts de página
│       └── ProductCatalogTemplate/
├── pages/               # Páginas completas
│   └── ProductCatalogPage/
├── hooks/               # Custom hooks
│   └── useProductFilters.ts
├── types/               # Definiciones de tipos TypeScript
│   ├── product.ts
│   └── index.ts
├── utils/               # Utilidades y helpers
│   ├── textUtils.ts
│   ├── productUtils.ts
│   └── index.ts
└── constants/           # Constantes de la aplicación
    └── filters.ts
```

## 🏗️ Atomic Design - Niveles de Componentes

### Atoms (Átomos) - `/components/ui/`
Elementos básicos e indivisibles de la interfaz:
- `Button` - Botones reutilizables
- `Input` - Campos de entrada
- `Card` - Contenedores básicos
- `Switch` - Interruptores
- `Slider` - Controles deslizantes
- `Popover` - Elementos emergentes
- `Label` - Etiquetas

### Molecules (Moléculas) - `/components/molecules/`
Combinaciones de átomos que forman componentes funcionales:

#### `SearchBar`
- **Propósito**: Barra de búsqueda con icono integrado
- **Composición**: `Input` + `MagnifyingGlassIcon`
- **Props**: `value`, `onChange`, `placeholder`, `className`

#### `PriceRangeFilter`
- **Propósito**: Filtro de rango de precios
- **Composición**: `Slider` + labels + display de valores
- **Props**: `value`, `onChange`, `min`, `max`, `step`

#### `SortToggle`
- **Propósito**: Control para ordenamiento de productos
- **Composición**: `Switch` + `Label` (ascendente/descendente)
- **Props**: `isAscending`, `onChange`

#### `FilterStats`
- **Propósito**: Estadísticas de filtros aplicados
- **Composición**: Información de productos filtrados y búsqueda
- **Props**: `filteredCount`, `totalCount`, `searchTerm`

#### `ProductCard`
- **Propósito**: Tarjeta individual de producto
- **Composición**: `Card` + imagen + información + `Button`
- **Props**: `product`, `searchTerm`, `onAddToCart`

#### `EmptyState`
- **Propósito**: Estado vacío cuando no hay resultados
- **Composición**: Icono + mensaje + tips
- **Props**: `searchTerm`, `title`, `description`

### Organisms (Organismos) - `/components/organisms/`
Secciones complejas que combinan múltiples molecules:

#### `Header`
- **Propósito**: Encabezado de la aplicación
- **Composición**: Título + `SearchBar` + `Popover`
- **Props**: `title`, `searchValue`, `onSearchChange`

#### `FilterSidebar`
- **Propósito**: Barra lateral con todos los filtros
- **Composición**: `PriceRangeFilter` + `SortToggle` + `FilterStats` + botón limpiar
- **Props**: Múltiples props para manejo de estado de filtros

#### `ProductGrid`
- **Propósito**: Grid de productos con manejo de estado vacío
- **Composición**: Array de `ProductCard` o `EmptyState`
- **Props**: `products`, `searchTerm`, `onAddToCart`

### Templates - `/components/templates/`
Layouts que definen la estructura de las páginas:

#### `ProductCatalogTemplate`
- **Propósito**: Template principal del catálogo
- **Composición**: `Header` + layout con `FilterSidebar` + `ProductGrid`
- **Props**: Todas las props necesarias para los organisms

### Pages - `/pages/`
Páginas completas que manejan la lógica de estado:

#### `ProductCatalogPage`
- **Propósito**: Página principal con lógica de filtros
- **Composición**: `ProductCatalogTemplate` + `useProductFilters` hook
- **Props**: `products`, `title`

## 🔧 Utilidades y Helpers

### `/utils/textUtils.ts`
- `normalizeText()` - Normaliza texto removiendo acentos
- `highlightSearchTerm()` - Resalta términos de búsqueda

### `/utils/productUtils.ts`
- `filterProducts()` - Filtra productos por criterios
- `sortProductsByPrice()` - Ordena productos por precio
- `filterAndSortProducts()` - Operación combinada optimizada

### `/hooks/useProductFilters.ts`
Hook personalizado que encapsula toda la lógica de filtros:
- Estado de filtros (búsqueda, precio, orden)
- Productos filtrados memoizados
- Funciones para actualizar filtros
- Detección de filtros activos

## 📋 Tipos TypeScript

### `/types/product.ts`
```typescript
interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
}

interface ProductFilters {
  searchTerm: string;
  priceRange: [number, number];
  isAscending: boolean;
}
```

## 🎯 Beneficios de esta Arquitectura

### 1. **Mantenibilidad**
- Componentes pequeños y enfocados en una sola responsabilidad
- Fácil localización y modificación de funcionalidades específicas
- Separación clara entre lógica y presentación
- TypeScript previene errores en tiempo de compilación

### 2. **Reutilización**
- Componentes atómicos reutilizables en diferentes contextos
- Molecules que pueden combinarse de diferentes formas
- Hooks personalizados que encapsulan lógica compleja
- Utilidades compartidas entre componentes

### 3. **Escalabilidad**
- Estructura clara para agregar nuevos componentes
- Fácil extensión de funcionalidades existentes
- Patrones consistentes en toda la aplicación
- Arquitectura preparada para crecimiento

### 4. **Testabilidad**
- Componentes aislados fáciles de testear
- Lógica separada en utils y hooks
- Props bien definidas y tipadas
- Mocking simplificado con inyección de dependencias

### 5. **Performance**
- Componentes optimizados con useMemo y useCallback
- TanStack Query maneja caché inteligente
- Lazy loading preparado para implementar
- Bundle splitting automático con Vite

### 6. **Developer Experience**
- TypeScript con autocompletado inteligente
- Hot Module Replacement ultra-rápido con Vite
- ESLint configurado para mejores prácticas
- Documentación JSDoc integrada

### 7. **Accesibilidad**
- Componentes shadcn/ui con a11y built-in
- Estructura semántica correcta
- Navegación por teclado considerada
- ARIA labels apropiados

## 🚀 Cómo Usar

### Agregar un nuevo componente molecule:
1. Crear carpeta en `/components/molecules/NuevoComponente/`
2. Crear `NuevoComponente.tsx` con JSDoc
3. Crear `index.ts` para exportación
4. Agregar export en `/components/molecules/index.ts`

### Agregar nueva funcionalidad:
1. Definir tipos en `/types/`
2. Crear utilidades en `/utils/`
3. Crear hook si es necesario en `/hooks/`
4. Implementar componentes siguiendo Atomic Design
5. Integrar en página correspondiente

## 📝 Convenciones de Código

### Naming Conventions
- **Componentes**: PascalCase (`ProductCard`, `SearchBar`)
- **Funciones**: camelCase (`filterProducts`, `normalizeText`)
- **Hooks**: camelCase con prefijo `use` (`useProductFilters`)
- **Tipos**: PascalCase (`Product`, `ProductFilters`)
- **Constantes**: UPPER_SNAKE_CASE (`PRICE_RANGE`, `SORT_OPTIONS`)

### File Structure
- **Componentes**: Cada uno en su carpeta con `index.ts` para exportación
- **Hooks**: Un hook por archivo en `/hooks/`
- **Tipos**: Agrupados por dominio en `/types/`
- **Utilidades**: Funciones relacionadas agrupadas

### TypeScript Standards
- Interfaces para props y tipos de datos
- Tipos de utilidad cuando sea apropiado (`Partial<T>`, `Pick<T>`)
- Evitar `any`, usar `unknown` cuando sea necesario
- Exportar tipos para reutilización

### Documentation Standards
- JSDoc para todos los componentes públicos
- Comentarios inline para lógica compleja
- README actualizado con cambios arquitectónicos
- Ejemplos de uso en documentación

### Import/Export Standards
```typescript
// Exportaciones nombradas preferidas
export const ProductCard = () => { ... };

// Exportaciones centralizadas
export { ProductCard } from './ProductCard';
export { SearchBar } from './SearchBar';

// Imports organizados
import React from 'react';
import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { useProductFilters } from '@/hooks';
import type { Product } from '@/types';
```