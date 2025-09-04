/**
 * Repositorio de Productos - Implementación con Sequelize
 * 
 * Implementa el patrón Repository para abstraer el acceso a datos de productos.
 * Actúa como un adaptador entre la capa de dominio y la infraestructura de
 * persistencia (PostgreSQL + Sequelize).
 * 
 * Responsabilidades:
 * - Traducir entre entidades de dominio y modelos de Sequelize
 * - Encapsular consultas SQL complejas
 * - Manejar transacciones de base de datos
 * - Proporcionar una interfaz limpia para operaciones CRUD
 * - Mantener la independencia del dominio respecto a la infraestructura
 * 
 * Beneficios del patrón Repository:
 * - Facilita el testing con repositorios mock
 * - Permite cambiar la implementación de persistencia sin afectar el dominio
 * - Centraliza la lógica de acceso a datos
 * - Mejora la mantenibilidad y legibilidad del código
 * 
 * @class SequelizeProductRepository
 * @implements {ProductRepository}
 * @author Backend Team
 */

import { Product } from "../../../Domain/Products/Entities/Product.js";

export class SequelizeProductRepository {

  /**
   * Constructor del repositorio
   * 
   * @param {Model} ProductModel - Modelo de Sequelize para la entidad Product
   */
  constructor(ProductModel) {
    /**
     * Modelo de Sequelize para operaciones de base de datos
     * @type {Model}
     * @private
     */
    this.ProductModel = ProductModel;
  }

  /**
   * Convierte un registro de base de datos a entidad de dominio
   * 
   * Método privado que maneja la transformación entre la representación
   * de datos de Sequelize y las entidades de dominio. Esto mantiene
   * el dominio independiente de los detalles de persistencia.
   * 
   * @param {Object|null} row - Registro de Sequelize o null
   * @returns {Product|null} Entidad de dominio o null si no existe
   * 
   * @private
   * @example
   * const domainEntity = this.#toDomain(sequelizeRow);
   */
  #toDomain(row) {
    // Manejar caso donde no se encuentra el registro
    if (!row) return null;

    try {
      // Crear entidad de dominio con validaciones automáticas
      return new Product({
        id: row.id,
        name: row.name,
        price: parseFloat(row.price), // Convertir DECIMAL a number
        stock: row.stock,
      });
    } catch (error) {
      // Log del error para debugging (en producción usar logger apropiado)
      console.error('Error convirtiendo registro a entidad de dominio:', error);
      throw new Error(`Error de mapeo de datos: ${error.message}`);
    }
  }

  /**
   * Crea un nuevo producto en la base de datos
   * 
   * Persiste una entidad de dominio Product en la base de datos,
   * manejando la conversión entre representaciones y garantizando
   * la integridad transaccional.
   * 
   * @param {Product} productEntity - Entidad de dominio a persistir
   * @param {Transaction} transaction - Transacción de Sequelize para consistencia ACID
   * @returns {Promise<Product>} Entidad persistida con ID asignado
   * 
   * @throws {Error} Si falla la operación de persistencia
   * 
   * @example
   * const product = new Product({ name: "Laptop", price: 999.99, stock: 10 });
   * const saved = await repository.create(product, transaction);
   * console.log(`Producto creado con ID: ${saved.id}`);
   */
  async create(productEntity, transaction) {
    try {
      // Crear registro en base de datos usando el modelo de Sequelize
      const row = await this.ProductModel.create({
        name: productEntity.name,
        price: productEntity.price,
        stock: productEntity.stock,
      }, {
        transaction, // Usar la transacción proporcionada
        returning: true, // Asegurar que PostgreSQL retorne el registro creado
      });

      // Convertir el registro creado de vuelta a entidad de dominio
      return this.#toDomain(row);

    } catch (error) {
      // Manejar errores específicos de base de datos
      if (error.name === 'SequelizeUniqueConstraintError') {
        throw new Error(`Ya existe un producto con el nombre "${productEntity.name}"`);
      }

      if (error.name === 'SequelizeValidationError') {
        const messages = error.errors.map(err => err.message).join(', ');
        throw new Error(`Errores de validación: ${messages}`);
      }

      // Re-lanzar otros errores con contexto adicional
      throw new Error(`Error creando producto: ${error.message}`);
    }
  }

  /**
   * Obtiene todos los productos de la base de datos
   * 
   * Recupera la lista completa de productos, convirtiéndolos a entidades
   * de dominio. Optimizado para consultas frecuentes con índices apropiados.
   * 
   * @param {Transaction} transaction - Transacción de Sequelize
   * @returns {Promise<Product[]>} Array de entidades de dominio
   * 
   * @example
   * const products = await repository.getAll(transaction);
   * console.log(`Encontrados ${products.length} productos`);
   */
  async getAll(transaction) {
    try {
      // Consultar todos los productos con ordenamiento por nombre
      const rows = await this.ProductModel.findAll({
        transaction,
        order: [['name', 'ASC']], // Ordenar alfabéticamente
        // TODO: Implementar paginación para listas grandes
        // limit: 100, // Limitar resultados en producción
      });

      // Convertir todos los registros a entidades de dominio
      return rows.map(row => this.#toDomain(row));

    } catch (error) {
      throw new Error(`Error obteniendo productos: ${error.message}`);
    }
  }

  /**
   * Busca un producto por su nombre
   * 
   * Realiza una búsqueda exacta por nombre de producto. Útil para
   * validar unicidad antes de crear nuevos productos.
   * 
   * @param {string} name - Nombre exacto del producto a buscar
   * @param {Transaction} transaction - Transacción de Sequelize
   * @returns {Promise<Product|null>} Entidad encontrada o null
   * 
   * @example
   * const existing = await repository.findByName("Laptop Gaming", transaction);
   * if (existing) {
   *   console.log("El producto ya existe");
   * }
   */
  async findByName(name, transaction) {
    try {
      // Buscar producto por nombre exacto (case-sensitive)
      const row = await this.ProductModel.findOne({
        where: {
          name: name.trim() // Normalizar espacios
        },
        transaction,
      });

      return this.#toDomain(row);

    } catch (error) {
      throw new Error(`Error buscando producto por nombre: ${error.message}`);
    }
  }
}