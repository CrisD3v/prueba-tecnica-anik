/**
 * Entidad de Dominio: Product
 * 
 * Representa un producto en el sistema siguiendo los principios de Domain-Driven Design.
 * Esta entidad encapsula las reglas de negocio fundamentales y mantiene la integridad
 * de los datos del producto.
 * 
 * Características:
 * - Inmutable: Una vez creado, no puede modificarse (patrón Value Object)
 * - Auto-validante: Valida sus propios datos en el constructor
 * - Rica en comportamiento: Contiene lógica de negocio, no solo datos
 * - Independiente de infraestructura: No conoce sobre bases de datos o frameworks
 * 
 * Reglas de Negocio:
 * - El nombre es obligatorio y debe ser único
 * - El precio debe ser mayor a 0
 * - El stock debe ser mayor o igual a 0
 * - El ID es opcional (se asigna en persistencia)
 * 
 * @class Product
 * @author Backend Team
 */
export class Product {
  
  /**
   * Constructor de la entidad Product
   * 
   * Crea una nueva instancia de producto validando todas las reglas de negocio.
   * La instancia resultante es inmutable para garantizar la integridad de los datos.
   * 
   * @param {Object} productData - Datos del producto
   * @param {string|null} productData.id - Identificador único (UUID)
   * @param {string} productData.name - Nombre del producto (requerido)
   * @param {number} productData.price - Precio del producto (requerido, > 0)
   * @param {number} productData.stock - Cantidad en inventario (requerido, >= 0)
   * 
   * @throws {Error} Si algún dato requerido está ausente o es inválido
   * 
   * @example
   * const product = new Product({
   *   name: "Laptop Gaming",
   *   price: 1299.99,
   *   stock: 15
   * });
   */
  constructor({ id = null, name, price, stock }) {
    
    // === VALIDACIONES DE REGLAS DE NEGOCIO ===
    
    // Validar datos requeridos
    if (!name || !price || stock === undefined || stock === null) {
      throw new Error('Product: Todos los campos son requeridos (name, price, stock)');
    }
    
    // Validar tipos de datos
    if (typeof name !== 'string') {
      throw new Error('Product: El nombre debe ser una cadena de texto');
    }
    
    if (typeof price !== 'number' || price <= 0) {
      throw new Error('Product: El precio debe ser un número mayor a 0');
    }
    
    if (typeof stock !== 'number' || stock < 0 || !Number.isInteger(stock)) {
      throw new Error('Product: El stock debe ser un número entero mayor o igual a 0');
    }
    
    // Validar longitud del nombre
    if (name.trim().length === 0) {
      throw new Error('Product: El nombre no puede estar vacío');
    }
    
    if (name.length > 255) {
      throw new Error('Product: El nombre no puede exceder 255 caracteres');
    }
    
    // === ASIGNACIÓN DE PROPIEDADES ===
    
    /**
     * Identificador único del producto
     * @type {string|null}
     * @readonly
     */
    this.id = id;
    
    /**
     * Nombre del producto
     * @type {string}
     * @readonly
     */
    this.name = name.trim();
    
    /**
     * Precio del producto en la moneda base del sistema
     * @type {number}
     * @readonly
     */
    this.price = Number(price.toFixed(2)); // Redondear a 2 decimales
    
    /**
     * Cantidad disponible en inventario
     * @type {number}
     * @readonly
     */
    this.stock = stock;
    
    // === INMUTABILIDAD ===
    // Congela el objeto para prevenir modificaciones accidentales
    // Esto garantiza que la entidad mantenga su estado consistente
    Object.freeze(this);
  }
  
  /**
   * Verifica si el producto está disponible en inventario
   * 
   * @returns {boolean} true si hay stock disponible, false en caso contrario
   */
  isAvailable() {
    return this.stock > 0;
  }
  
  /**
   * Verifica si el producto está agotado
   * 
   * @returns {boolean} true si no hay stock, false en caso contrario
   */
  isOutOfStock() {
    return this.stock === 0;
  }
  
  /**
   * Obtiene una representación en string del producto
   * Útil para logging y debugging
   * 
   * @returns {string} Representación textual del producto
   */
  toString() {
    return `Product(id=${this.id}, name="${this.name}", price=${this.price}, stock=${this.stock})`;
  }
  
  /**
   * Convierte la entidad a un objeto plano para serialización
   * 
   * @returns {Object} Objeto plano con las propiedades del producto
   */
  toJSON() {
    return {
      id: this.id,
      name: this.name,
      price: this.price,
      stock: this.stock
    };
  }
}