/**
 * Error de Aplicación Personalizado
 * 
 * Extiende la clase Error nativa de JavaScript para proporcionar
 * información estructurada sobre errores específicos de la aplicación.
 * Facilita el manejo consistente de errores y su mapeo a respuestas HTTP.
 * 
 * Características:
 * - Códigos de error estructurados para identificación programática
 * - Mapeo automático a códigos de estado HTTP
 * - Metadatos adicionales para contexto del error
 * - Compatibilidad completa con el sistema de errores de JavaScript
 * - Serialización JSON para logging y APIs
 * 
 * Casos de uso:
 * - Errores de validación de negocio
 * - Errores de autorización y autenticación
 * - Errores de recursos no encontrados
 * - Errores de conflictos de datos
 * - Errores de configuración
 * 
 * @class AppError
 * @extends Error
 * @author Backend Team
 */

export class AppError extends Error {
  
  /**
   * Constructor de AppError
   * 
   * Crea una nueva instancia de error de aplicación con información
   * estructurada que facilita el manejo y la respuesta apropiada.
   * 
   * @param {string} code - Código único del error para identificación programática
   * @param {string} message - Mensaje descriptivo del error para humanos
   * @param {number} [httpCode=400] - Código de estado HTTP correspondiente
   * @param {Object} [meta={}] - Metadatos adicionales del contexto del error
   * 
   * @example
   * // Error de validación básico
   * throw new AppError(
   *   'VALIDATION_ERROR',
   *   'El precio debe ser mayor a 0',
   *   400
   * );
   * 
   * @example
   * // Error con metadatos adicionales
   * throw new AppError(
   *   'PRODUCT_NOT_FOUND',
   *   'No se encontró el producto especificado',
   *   404,
   *   { productId: 'abc-123', requestedBy: 'user@example.com' }
   * );
   */
  constructor(code, message, httpCode = 400, meta = {}) {
    // Llamar al constructor de Error con el mensaje
    super(message);
    
    // === PROPIEDADES BÁSICAS ===
    
    /**
     * Código único del error para identificación programática
     * 
     * Debe seguir convenciones consistentes:
     * - UPPER_SNAKE_CASE
     * - Descriptivo y específico
     * - Único en toda la aplicación
     * 
     * Ejemplos:
     * - VALIDATION_ERROR
     * - PRODUCT_NOT_FOUND
     * - INSUFFICIENT_PERMISSIONS
     * - DUPLICATE_RESOURCE
     * 
     * @type {string}
     * @readonly
     */
    this.code = code;
    
    /**
     * Código de estado HTTP correspondiente al error
     * 
     * Mapeo común:
     * - 400: Bad Request (errores de validación)
     * - 401: Unauthorized (no autenticado)
     * - 403: Forbidden (no autorizado)
     * - 404: Not Found (recurso no existe)
     * - 409: Conflict (conflicto de datos)
     * - 422: Unprocessable Entity (validación de negocio)
     * - 500: Internal Server Error (errores del sistema)
     * 
     * @type {number}
     * @readonly
     */
    this.httpCode = httpCode;
    
    /**
     * Metadatos adicionales del contexto del error
     * 
     * Puede incluir:
     * - IDs de recursos relacionados
     * - Información del usuario
     * - Parámetros de la operación fallida
     * - Timestamps
     * - Información de debugging
     * 
     * @type {Object}
     * @readonly
     */
    this.meta = meta;
    
    // === CONFIGURACIÓN DE LA CLASE ERROR ===
    
    /**
     * Nombre de la clase de error
     * Útil para identificación de tipo y logging
     */
    this.name = this.constructor.name;
    
    /**
     * Capturar stack trace si está disponible
     * Excluye este constructor del stack trace para mayor claridad
     */
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
    
    // === TIMESTAMP DEL ERROR ===
    
    /**
     * Timestamp de cuando ocurrió el error
     * Útil para correlación de logs y debugging
     * 
     * @type {Date}
     * @readonly
     */
    this.timestamp = new Date();
    
    // Hacer el objeto inmutable para prevenir modificaciones accidentales
    Object.freeze(this);
  }
  
  // === MÉTODOS DE UTILIDAD ===
  
  /**
   * Convierte el error a un objeto plano para serialización JSON
   * 
   * Útil para:
   * - Logging estructurado
   * - Respuestas de API
   * - Almacenamiento en bases de datos
   * - Transmisión entre servicios
   * 
   * @returns {Object} Representación JSON del error
   * 
   * @example
   * const error = new AppError('VALIDATION_ERROR', 'Invalid data');
   * console.log(JSON.stringify(error.toJSON()));
   * // {
   * //   "name": "AppError",
   * //   "code": "VALIDATION_ERROR",
   * //   "message": "Invalid data",
   * //   "httpCode": 400,
   * //   "meta": {},
   * //   "timestamp": "2024-01-15T10:30:00.000Z"
   * // }
   */
  toJSON() {
    return {
      name: this.name,
      code: this.code,
      message: this.message,
      httpCode: this.httpCode,
      meta: this.meta,
      timestamp: this.timestamp.toISOString(),
      // Incluir stack trace solo en desarrollo
      ...(process.env.NODE_ENV === 'development' && { stack: this.stack })
    };
  }
  
  /**
   * Representación en string del error
   * 
   * @returns {string} Representación textual del error
   * 
   * @example
   * const error = new AppError('VALIDATION_ERROR', 'Invalid data');
   * console.log(error.toString());
   * // "AppError [VALIDATION_ERROR]: Invalid data"
   */
  toString() {
    return `${this.name} [${this.code}]: ${this.message}`;
  }
  
  /**
   * Verifica si este error es de un tipo específico
   * 
   * @param {string} code - Código de error a verificar
   * @returns {boolean} true si coincide el código
   * 
   * @example
   * const error = new AppError('VALIDATION_ERROR', 'Invalid data');
   * console.log(error.is('VALIDATION_ERROR')); // true
   * console.log(error.is('NOT_FOUND')); // false
   */
  is(code) {
    return this.code === code;
  }
  
  /**
   * Verifica si este error corresponde a un código HTTP específico
   * 
   * @param {number} httpCode - Código HTTP a verificar
   * @returns {boolean} true si coincide el código HTTP
   * 
   * @example
   * const error = new AppError('NOT_FOUND', 'Resource not found', 404);
   * console.log(error.hasHttpCode(404)); // true
   * console.log(error.hasHttpCode(400)); // false
   */
  hasHttpCode(httpCode) {
    return this.httpCode === httpCode;
  }
  
  // === MÉTODOS ESTÁTICOS PARA ERRORES COMUNES ===
  
  /**
   * Crea un error de validación estándar
   * 
   * @param {string} message - Mensaje del error de validación
   * @param {Object} [meta={}] - Metadatos adicionales
   * @returns {AppError} Error de validación
   * 
   * @static
   * @example
   * throw AppError.validation('El email no es válido', { field: 'email' });
   */
  static validation(message, meta = {}) {
    return new AppError('VALIDATION_ERROR', message, 400, meta);
  }
  
  /**
   * Crea un error de recurso no encontrado
   * 
   * @param {string} resource - Nombre del recurso no encontrado
   * @param {Object} [meta={}] - Metadatos adicionales
   * @returns {AppError} Error de recurso no encontrado
   * 
   * @static
   * @example
   * throw AppError.notFound('Product', { id: 'abc-123' });
   */
  static notFound(resource, meta = {}) {
    return new AppError(
      'RESOURCE_NOT_FOUND',
      `${resource} no encontrado`,
      404,
      meta
    );
  }
  
  /**
   * Crea un error de conflicto de datos
   * 
   * @param {string} message - Mensaje del conflicto
   * @param {Object} [meta={}] - Metadatos adicionales
   * @returns {AppError} Error de conflicto
   * 
   * @static
   * @example
   * throw AppError.conflict('El producto ya existe', { name: 'Laptop' });
   */
  static conflict(message, meta = {}) {
    return new AppError('CONFLICT_ERROR', message, 409, meta);
  }
  
  /**
   * Crea un error de autorización
   * 
   * @param {string} [message='No autorizado'] - Mensaje del error
   * @param {Object} [meta={}] - Metadatos adicionales
   * @returns {AppError} Error de autorización
   * 
   * @static
   * @example
   * throw AppError.unauthorized('Token inválido');
   */
  static unauthorized(message = 'No autorizado', meta = {}) {
    return new AppError('UNAUTHORIZED', message, 401, meta);
  }
  
  /**
   * Crea un error de permisos insuficientes
   * 
   * @param {string} [message='Permisos insuficientes'] - Mensaje del error
   * @param {Object} [meta={}] - Metadatos adicionales
   * @returns {AppError} Error de permisos
   * 
   * @static
   * @example
   * throw AppError.forbidden('No puede eliminar este recurso');
   */
  static forbidden(message = 'Permisos insuficientes', meta = {}) {
    return new AppError('FORBIDDEN', message, 403, meta);
  }
  
  /**
   * Crea un error interno del servidor
   * 
   * @param {string} [message='Error interno del servidor'] - Mensaje del error
   * @param {Object} [meta={}] - Metadatos adicionales
   * @returns {AppError} Error interno
   * 
   * @static
   * @example
   * throw AppError.internal('Error de conexión a la base de datos');
   */
  static internal(message = 'Error interno del servidor', meta = {}) {
    return new AppError('INTERNAL_ERROR', message, 500, meta);
  }
}