/**
 * Router de Productos - Controladores HTTP
 * 
 * Define los endpoints HTTP para operaciones relacionadas con productos.
 * Actúa como la capa de presentación en la arquitectura hexagonal,
 * traduciendo entre el protocolo HTTP y la lógica de aplicación.
 * 
 * Responsabilidades:
 * - Manejar requests y responses HTTP
 * - Validar y extraer parámetros de entrada
 * - Invocar servicios de aplicación apropiados
 * - Formatear respuestas según estándares REST
 * - Manejar códigos de estado HTTP correctos
 * - Proporcionar documentación implícita de la API
 * 
 * Principios seguidos:
 * - RESTful API design
 * - Separación de responsabilidades
 * - Manejo consistente de errores
 * - Respuestas tipadas y predecibles
 * 
 * @module ProductRoutes
 * @author Backend Team
 */

import express from 'express';
import { errorAsync } from '../Shared/errorHandler.js';

/**
 * Construye el router de productos con dependencias inyectadas
 * 
 * Función factory que crea un router de Express configurado con todos
 * los endpoints de productos. Recibe las dependencias necesarias a través
 * de inyección, permitiendo testing fácil y desacoplamiento.
 * 
 * @param {Object} dependencies - Dependencias inyectadas
 * @param {ProductService} dependencies.productService - Servicio de productos
 * @returns {Router} Router de Express configurado
 * 
 * @example
 * const router = buildProductRouter({ productService });
 * app.use('/api/products', router);
 */
export const buildProductRouter = ({ productService }) => {
  
  // Crear instancia de router de Express
  const router = express.Router();

  // === ENDPOINT: CREAR PRODUCTO ===
  
  /**
   * POST /products
   * 
   * Crea un nuevo producto en el sistema
   * 
   * Request Body:
   * {
   *   "name": "string",     // Nombre único del producto
   *   "price": "number",    // Precio mayor a 0
   *   "stock": "number"     // Cantidad en inventario >= 0
   * }
   * 
   * Responses:
   * - 201: Producto creado exitosamente
   * - 400: Datos inválidos o producto ya existe
   * - 500: Error interno del servidor
   */
  router.post('/', errorAsync(async (req, res) => {
    
    // === EXTRACCIÓN Y VALIDACIÓN DE PARÁMETROS ===
    
    const { name, price, stock } = req.body;
    
    // Validación básica de presencia de campos
    // Las validaciones de negocio se manejan en la capa de dominio
    if (!name || price === undefined || stock === undefined) {
      return res.status(400).json({
        code: 'MISSING_FIELDS',
        message: 'Los campos name, price y stock son requeridos'
      });
    }
    
    // === INVOCACIÓN DEL SERVICIO DE APLICACIÓN ===
    
    // Delegar la lógica de negocio al servicio
    // El servicio maneja validaciones, reglas de negocio y persistencia
    const result = await productService.create({ name, price, stock });

    // === MANEJO DE RESPUESTA ===
    
    if (result.isFailure) {
      // Mapear errores de aplicación a códigos HTTP apropiados
      const statusCode = result.error.httpCode ?? 400;
      
      return res.status(statusCode).json({
        code: result.error.code,
        message: result.error.message
      });
    }
    
    // Respuesta exitosa con el producto creado
    // Status 201 indica que un recurso fue creado
    return res.status(201).json(result.value);
  }));

  // === ENDPOINT: OBTENER TODOS LOS PRODUCTOS ===
  
  /**
   * GET /products
   * 
   * Obtiene la lista completa de productos disponibles
   * 
   * 
   * Responses:
   * - 200: Lista de productos obtenida exitosamente
   * - 404: No se encontraron productos
   * - 500: Error interno del servidor
   */
  router.get('/', errorAsync(async (req, res) => {
    // === INVOCACIÓN DEL SERVICIO ===
    
    const result = await productService.getAll();

    // === MANEJO DE RESPUESTA ===
    
    if (result.isFailure) {
      // Mapear error específico de "no encontrado" a 404
      const statusCode = result.error.code === 'PRODUCT_NOT_FOUND' ? 404 : 
                        (result.error.httpCode ?? 500);
      
      return res.status(statusCode).json({
        code: result.error.code,
        message: result.error.message
      });
    }
    
    // Respuesta exitosa con la lista de productos
    // Status 200 indica operación exitosa
    return res.status(200).json(result.value);
  }));

  return router;
};
