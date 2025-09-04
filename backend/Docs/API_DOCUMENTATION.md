# Documentación de la API

## Información General

- **Base URL**: `http://localhost:3000/api`
- **Formato de datos**: JSON
- **Autenticación**: No implementada (pendiente)
- **Versionado**: No implementado (pendiente)

## Códigos de Estado HTTP

| Código | Descripción |
|--------|-------------|
| 200 | Operación exitosa |
| 201 | Recurso creado exitosamente |
| 400 | Error de validación o solicitud incorrecta |
| 404 | Recurso no encontrado |
| 500 | Error interno del servidor |

## Formato de Respuestas

### Respuesta Exitosa
```json
{
  "id": "uuid",
  "name": "string",
  "price": "decimal",
  "stock": "integer",
  "createdAt": "datetime",
  "updatedAt": "datetime"
}
```

### Respuesta de Error
```json
{
  "code": "ERROR_CODE",
  "message": "Descripción del error"
}
```

## Endpoints

### Productos

#### Crear Producto

**POST** `/products`

Crea un nuevo producto en el sistema.

**Parámetros del Body:**
| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| name | string | Sí | Nombre del producto (único) |
| price | decimal | Sí | Precio del producto (mayor a 0) |
| stock | integer | Sí | Cantidad en inventario (mayor o igual a 0) |

**Ejemplo de Request:**
```json
{
  "name": "Laptop Gaming ROG",
  "price": 1299.99,
  "stock": 15
}
```

**Ejemplo de Response (201):**
```json
{
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "name": "Laptop Gaming ROG",
  "price": 1299.99,
  "stock": 15,
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T10:30:00.000Z"
}
```

**Posibles Errores:**
- `400 PRODUCT_ALREADY_EXISTS`: El producto ya existe
- `400 VALIDATION_ERROR`: Datos de entrada inválidos

#### Obtener Todos los Productos

**GET** `/products`

Obtiene la lista completa de productos disponibles.

**Parámetros:** Ninguno

**Ejemplo de Response (200):**
```json
[
  {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "name": "Laptop Gaming ROG",
    "price": 1299.99,
    "stock": 15,
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  },
  {
    "id": "550e8400-e29b-41d4-a716-446655440001",
    "name": "Mouse Inalámbrico",
    "price": 29.99,
    "stock": 100,
    "createdAt": "2024-01-15T11:00:00.000Z",
    "updatedAt": "2024-01-15T11:00:00.000Z"
  }
]
```

**Posibles Errores:**
- `400 PRODUCT_NOT_FOUND`: No se encontraron productos

## Ejemplos de Uso Completos

### Flujo Típico de Uso

1. **Crear varios productos**
2. **Consultar la lista de productos**
3. **Verificar que los productos se crearon correctamente**

### Ejemplo con cURL

```bash
# 1. Crear primer producto
curl -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "iPhone 15 Pro",
    "price": 999.99,
    "stock": 50
  }'

# 2. Crear segundo producto
curl -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "AirPods Pro",
    "price": 249.99,
    "stock": 75
  }'

# 3. Obtener todos los productos
curl -X GET http://localhost:3000/api/products \
  -H "Content-Type: application/json"
```

### Ejemplo con JavaScript (Fetch API)

```javascript
// Crear producto
const createProduct = async (productData) => {
  try {
    const response = await fetch('http://localhost:3000/api/products', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(productData)
    });
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(`${error.code}: ${error.message}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error creando producto:', error);
    throw error;
  }
};

// Obtener productos
const getProducts = async () => {
  try {
    const response = await fetch('http://localhost:3000/api/products');
    
    if (!response.ok) {
      const error = await response.json();
      throw new Error(`${error.code}: ${error.message}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error obteniendo productos:', error);
    throw error;
  }
};

// Uso
(async () => {
  // Crear producto
  const newProduct = await createProduct({
    name: "MacBook Pro M3",
    price: 1999.99,
    stock: 25
  });
  console.log('Producto creado:', newProduct);
  
  // Obtener todos los productos
  const products = await getProducts();
  console.log('Lista de productos:', products);
})();
```

## Validaciones

### Reglas de Negocio

1. **Nombre del producto**:
   - Debe ser único en el sistema
   - No puede estar vacío
   - Longitud máxima: 255 caracteres

2. **Precio**:
   - Debe ser mayor a 0
   - Formato decimal con hasta 2 decimales

3. **Stock**:
   - Debe ser mayor o igual a 0
   - Número entero

### Códigos de Error Específicos

| Código | Descripción | Solución |
|--------|-------------|----------|
| `PRODUCT_ALREADY_EXISTS` | Ya existe un producto con ese nombre | Usar un nombre diferente |
| `PRODUCT_NOT_CREATED` | Error al crear el producto | Verificar datos y conexión a BD |
| `PRODUCT_NOT_FOUND` | No se encontraron productos | Crear productos primero |
| `VALIDATION_ERROR` | Datos de entrada inválidos | Verificar formato de los datos |
| `INTERNAL_ERROR` | Error interno del servidor | Contactar al administrador |

## Consideraciones de Rendimiento

- **Paginación**: No implementada (recomendada para listas grandes)
- **Filtros**: No implementados (recomendados para búsquedas específicas)
- **Caché**: No implementado (recomendado para consultas frecuentes)
- **Rate Limiting**: No implementado (recomendado para producción)