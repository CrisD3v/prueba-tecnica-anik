# Arquitectura del Proyecto - Atomic Design

Este proyecto ha sido refactorizado siguiendo los principios de **Atomic Design**, **Component Pattern**, **Clean Code** y **mejores prácticas** de React.

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

### 2. **Reutilización**
- Componentes atómicos reutilizables en diferentes contextos
- Molecules que pueden combinarse de diferentes formas
- Hooks personalizados que encapsulan lógica compleja

### 3. **Escalabilidad**
- Estructura clara para agregar nuevos componentes
- Fácil extensión de funcionalidades existentes
- Patrones consistentes en toda la aplicación

### 4. **Testabilidad**
- Componentes aislados fáciles de testear
- Lógica separada en utils y hooks
- Props bien definidas y tipadas

### 5. **Legibilidad**
- Código autodocumentado con nombres descriptivos
- Comentarios JSDoc en todos los componentes
- Estructura de carpetas intuitiva

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

- **Nombres**: PascalCase para componentes, camelCase para funciones
- **Archivos**: Cada componente en su propia carpeta con `index.ts`
- **Props**: Interfaces tipadas con JSDoc
- **Comentarios**: JSDoc para todos los componentes públicos
- **Exports**: Exportaciones centralizadas en `index.ts`