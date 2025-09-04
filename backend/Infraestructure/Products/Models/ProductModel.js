/**
 * Modelo de Datos: ProductModel
 * 
 * Define la estructura de la tabla 'products' en PostgreSQL usando Sequelize ORM.
 * Este modelo actúa como un adaptador entre la representación de dominio
 * y la persistencia en base de datos.
 * 
 * Responsabilidades:
 * - Mapear entidades de dominio a registros de base de datos
 * - Definir esquema, tipos de datos y restricciones
 * - Configurar índices y relaciones (futuro)
 * - Manejar validaciones a nivel de base de datos
 * 
 * Consideraciones de Diseño:
 * - Usa UUID para IDs para mejor escalabilidad y seguridad
 * - Incluye timestamps automáticos para auditoría
 * - Tipos de datos optimizados para PostgreSQL
 * - Preparado para futuras migraciones
 * 
 * @module ProductModel
 * @author Backend Team
 */

import { DataTypes } from "sequelize";

/**
 * Construye y configura el modelo de Product para Sequelize
 * 
 * Función factory que crea el modelo asociado a una instancia específica
 * de Sequelize. Esto permite reutilizar la definición del modelo con
 * diferentes conexiones de base de datos (testing, desarrollo, producción).
 * 
 * @param {Sequelize} sequelize - Instancia de Sequelize configurada
 * @returns {Model} Modelo de Sequelize para la entidad Product
 * 
 * @example
 * const ProductModel = buildProductModel(sequelize);
 * 
 * // Crear un nuevo producto
 * const product = await ProductModel.create({
 *   name: "Laptop Gaming",
 *   price: 1299.99,
 *   stock: 15
 * });
 */
export function buildProductModel(sequelize) {
  
  /**
   * Definición del modelo Product con Sequelize
   * 
   * Mapea la entidad de dominio Product a la tabla 'products' en PostgreSQL.
   * Cada campo incluye validaciones y restricciones apropiadas.
   */
  const ProductModel = sequelize.define('Product', {
    
    /**
     * Identificador único del producto
     * 
     * Usa UUID v4 para garantizar unicidad global y evitar
     * problemas de seguridad con IDs secuenciales.
     * 
     * @type {UUID}
     * @primary
     * @generated
     */
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      comment: 'Identificador único del producto (UUID v4)'
    },
    
    /**
     * Nombre del producto
     * 
     * Campo único para evitar duplicados. Indexado para
     * búsquedas rápidas por nombre.
     * 
     * @type {string}
     * @maxLength 255
     * @unique
     * @indexed
     */
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
      unique: {
        name: 'products_name_unique',
        msg: 'Ya existe un producto con este nombre'
      },
      validate: {
        notEmpty: {
          msg: 'El nombre del producto no puede estar vacío'
        },
        len: {
          args: [1, 255],
          msg: 'El nombre debe tener entre 1 y 255 caracteres'
        }
      },
      comment: 'Nombre único del producto'
    },
    
    /**
     * Precio del producto
     * 
     * Usa DECIMAL para precisión exacta en cálculos monetarios.
     * Evita problemas de redondeo con números flotantes.
     * 
     * @type {decimal}
     * @precision 10,2
     * @min 0.01
     */
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      validate: {
        min: {
          args: [0.01],
          msg: 'El precio debe ser mayor a 0'
        },
        isDecimal: {
          msg: 'El precio debe ser un número decimal válido'
        }
      },
      comment: 'Precio del producto en la moneda base del sistema'
    },
    
    /**
     * Cantidad en inventario
     * 
     * Número entero que representa las unidades disponibles.
     * Permite cero para productos temporalmente agotados.
     * 
     * @type {integer}
     * @min 0
     */
    stock: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        min: {
          args: [0],
          msg: 'El stock no puede ser negativo'
        },
        isInt: {
          msg: 'El stock debe ser un número entero'
        }
      },
      comment: 'Cantidad disponible en inventario'
    },
    
  }, {
    
    // === CONFIGURACIÓN DE LA TABLA ===
    
    /**
     * Nombre explícito de la tabla en la base de datos
     * Evita problemas con pluralización automática de Sequelize
     */
    tableName: 'products',
    
    /**
     * Habilita timestamps automáticos (createdAt, updatedAt)
     * Útil para auditoría y tracking de cambios
     */
    timestamps: true,
    
    /**
     * Configuración de índices para optimizar consultas
     */
    indexes: [
      {
        // Índice único en el nombre para búsquedas rápidas
        unique: true,
        fields: ['name'],
        name: 'products_name_idx'
      },
      {
        // Índice en precio para consultas de rango
        fields: ['price'],
        name: 'products_price_idx'
      },
      {
        // Índice en stock para filtrar productos disponibles
        fields: ['stock'],
        name: 'products_stock_idx'
      }
    ],
    
    /**
     * Configuración de paranoid para soft deletes (futuro)
     * Permite "eliminar" registros sin borrarlos físicamente
     */
    paranoid: false, // Cambiar a true cuando se implemente soft delete
    
    /**
     * Comentario de la tabla para documentación en la BD
     */
    comment: 'Tabla de productos del sistema de inventario',
    
    /**
     * Configuración del motor de base de datos (PostgreSQL)
     */
    engine: 'InnoDB', // Para MySQL, no aplica en PostgreSQL
    charset: 'utf8mb4', // Para MySQL, no aplica en PostgreSQL
    
  });

  // === HOOKS DE SEQUELIZE ===
  
  /**
   * Hook que se ejecuta antes de crear un producto
   * Útil para validaciones adicionales o transformaciones
   */
  ProductModel.beforeCreate((product, options) => {
    // Normalizar el nombre (trim y capitalización)
    if (product.name) {
      product.name = product.name.trim();
    }
    
    // Redondear precio a 2 decimales
    if (product.price) {
      product.price = Number(product.price).toFixed(2);
    }
  });
  
  /**
   * Hook que se ejecuta antes de actualizar un producto
   */
  ProductModel.beforeUpdate((product, options) => {
    // Aplicar las mismas normalizaciones que en create
    if (product.name) {
      product.name = product.name.trim();
    }
    
    if (product.price) {
      product.price = Number(product.price).toFixed(2);
    }
  });

  // === MÉTODOS DE CLASE (ESTÁTICOS) ===
  
  /**
   * Busca productos por rango de precio
   * 
   * @param {number} minPrice - Precio mínimo
   * @param {number} maxPrice - Precio máximo
   * @returns {Promise<Product[]>} Productos en el rango de precio
   * 
   * @static
   * @example
   * const products = await ProductModel.findByPriceRange(100, 500);
   */
  ProductModel.findByPriceRange = function(minPrice, maxPrice) {
    return this.findAll({
      where: {
        price: {
          [sequelize.Sequelize.Op.between]: [minPrice, maxPrice]
        }
      },
      order: [['price', 'ASC']]
    });
  };
  
  /**
   * Busca productos con stock bajo
   * 
   * @param {number} threshold - Umbral de stock bajo (default: 10)
   * @returns {Promise<Product[]>} Productos con stock bajo
   * 
   * @static
   */
  ProductModel.findLowStock = function(threshold = 10) {
    return this.findAll({
      where: {
        stock: {
          [sequelize.Sequelize.Op.lte]: threshold
        }
      },
      order: [['stock', 'ASC']]
    });
  };

  return ProductModel;
} 