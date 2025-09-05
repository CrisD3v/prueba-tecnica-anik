## 🎯 Preguntas Técnicas SQL - Respuestas Detalladas

### 1. Normalización de Base de Datos

**¿Por qué es importante la normalización y cómo se aplica?**

La normalización **reduce la redundancia y evita anomalías**, mejorando la integridad y consistencia de los datos.

#### Primera Forma Normal (1NF) - Columnas Atómicas
**Problema**: Almacenar múltiples valores en una sola columna
```sql
-- ❌ Incorrecto - Viola 1NF
customers(id, name, products) 
-- products: "Labial,gloss,Pestañina"

-- ✅ Correcto - Cumple 1NF
customers(id, name)
customer_products(customer_id, product_id)
products(id, name)
```

#### Segunda Forma Normal (2NF) - Sin Dependencias Parciales
**Problema**: Atributos que dependen solo de parte de la clave primaria
```sql
-- ❌ Incorrecto - Viola 2NF
order_items(order_id, product_id, quantity, product_name, product_price)
-- product_name y product_price solo dependen de product_id

-- ✅ Correcto - Cumple 2NF
order_items(order_id, product_id, quantity)
products(id, name, price)
```

#### Tercera Forma Normal (3NF) - Sin Dependencias Transitivas
**Problema**: Atributos que dependen de otros atributos no clave
```sql
-- ❌ Incorrecto - Viola 3NF
customers(id, name, city_id, city_name, country_name)
-- city_name y country_name dependen de city_id, no del customer_id

-- ✅ Correcto - Cumple 3NF
customers(id, name, city_id)
cities(id, name, country_id)
countries(id, name)
```

### 2. Consulta con JOIN

**Obtener todos los clientes con el número de órdenes que han realizado:**

```sql
SELECT 
    c.name AS customer_name,
    c.email,
    COUNT(o.id) AS order_count
FROM customers c
LEFT JOIN orders o ON o.customer_id = c.id
GROUP BY c.id, c.name, c.email
ORDER BY customer_name;
```

**¿Por qué LEFT JOIN?** Porque queremos **todos los clientes**, incluso los que no han hecho órdenes (aparecerán con `order_count = 0`).

**¿Por qué GROUP BY incluye c.id?** Porque en PostgreSQL, cuando usas `GROUP BY`, debes incluir todas las columnas no agregadas que aparecen en el SELECT.

### 3. Consulta de Top N con Ordenamiento

**Obtener los 3 productos más caros:**

```sql
SELECT id, name, price
FROM products
ORDER BY price DESC
LIMIT 3;
```

**Explicación**:
- `ORDER BY price DESC`: Ordena de mayor a menor precio
- `LIMIT 3`: Toma solo los primeros 3 resultados
- Simple y eficiente para obtener los "top N"

### 4. Prevención de SQL Injection

**¿Cómo prevenir ataques de SQL Injection en Node.js?**

La clave está en **nunca concatenar directamente** valores del usuario en las consultas SQL. Siempre usar **consultas parametrizadas**.

#### ✅ Método 1: Consultas Parametrizadas con pg (PostgreSQL)

```javascript
const { Pool } = require('pg');
const pool = new Pool();

const getUser = async (email, status) => {
    // ✅ SEGURO - Usa parámetros ($1, $2)
    const query = 'SELECT id, email FROM users WHERE email = $1 AND status = $2';
    const { rows } = await pool.query(query, [email, status]);
    return rows;
};

// ❌ PELIGROSO - Nunca hagas esto
const unsafeQuery = `SELECT * FROM users WHERE email = '${email}'`;
// Vulnerable a: email = "'; DROP TABLE users; --"
```

#### ✅ Método 2: ORM con Sequelize

```javascript
// ✅ SEGURO - Sequelize escapa automáticamente
const users = await User.findAll({
    where: {
        email: email,
        status: status
    }
});

// ✅ También seguro con consultas raw
await sequelize.query(
    'SELECT id, email FROM users WHERE email = :email AND status = :status',
    { 
        replacements: { email, status }, 
        type: sequelize.QueryTypes.SELECT 
    }
);
```

**¿Por qué funciona?** Los parámetros se envían **separadamente** de la consulta SQL, por lo que el motor de base de datos los trata como **datos**, no como **código SQL**.