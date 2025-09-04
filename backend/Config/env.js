/**
 * Configuración de Variables de Entorno
 * 
 * Este módulo centraliza toda la configuración de la aplicación basada en
 * variables de entorno, proporcionando valores por defecto seguros y
 * validación de tipos.
 * 
 * Beneficios:
 * - Configuración centralizada y tipada
 * - Valores por defecto para desarrollo
 * - Separación clara entre configuración y código
 * - Facilita el despliegue en diferentes ambientes
 * 
 * Variables requeridas:
 * - DB_NAME: Nombre de la base de datos PostgreSQL
 * - DB_USER: Usuario de la base de datos
 * - DB_PASS: Contraseña de la base de datos
 * - DB_HOST: Host de la base de datos
 * 
 * Variables opcionales:
 * - NODE_ENV: Ambiente de ejecución (development|production|test)
 * - PORT: Puerto del servidor HTTP
 * - SALT_ROUNDS: Rounds para hashing de contraseñas
 * 
 * @module Environment
 * @author Backend Team
 */

// Carga automática de variables desde archivo .env
import 'dotenv/config';

/**
 * Objeto de configuración tipado y validado
 * 
 * Todas las variables de entorno se procesan y validan aquí,
 * proporcionando una interfaz consistente para el resto de la aplicación.
 * 
 * @constant {Object} env
 */
export const env = {
  
  /**
   * Ambiente de ejecución de la aplicación
   * Determina el comportamiento de logging, validaciones y optimizaciones
   * 
   * @type {string}
   * @default 'development'
   */
  NODE_ENV: process.env.NODE_ENV ?? 'development',
  
  /**
   * Puerto HTTP donde se ejecutará el servidor
   * Se convierte a número para evitar errores de tipo
   * 
   * @type {number}
   * @default 3000
   */
  PORT: +(process.env.PORT ?? 3000),
  
  /**
   * Configuración de la base de datos PostgreSQL
   * Agrupa todas las variables relacionadas con la persistencia
   */
  DB: {
    /**
     * Nombre de la base de datos
     * @type {string}
     * @required
     */
    DATABASE: process.env.DB_NAME,
    
    /**
     * Usuario para conexión a la base de datos
     * @type {string}
     * @required
     */
    USER: process.env.DB_USER,
    
    /**
     * Contraseña para conexión a la base de datos
     * @type {string}
     * @required
     */
    PASS: process.env.DB_PASS,
    
    /**
     * Host donde se encuentra la base de datos
     * @type {string}
     * @required
     */
    HOST: process.env.DB_HOST,
    
    /**
     * Dialecto de la base de datos para Sequelize
     * Fijo en PostgreSQL para esta aplicación
     * 
     * @type {string}
     * @readonly
     */
    DIALECT: 'postgres',
    
    /**
     * Habilita/deshabilita logging de consultas SQL
     * Deshabilitado por defecto para mejor rendimiento
     * 
     * @type {boolean}
     * @default false
     */
    LOGGING: process.env.NODE_ENV === 'development',
  },
  
  /**
   * Configuración de seguridad
   * Agrupa parámetros relacionados con autenticación y autorización
   */
  SECURITY: {
    /**
     * Número de rounds para el algoritmo bcrypt
     * Mayor número = más seguro pero más lento
     * 
     * @type {number}
     * @default 10
     * @range 4-31
     */
    SALT_ROUNDS: +(process.env.SALT_ROUNDS ?? 10),
  },
};
