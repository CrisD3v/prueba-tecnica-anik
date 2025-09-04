/**
 * Manejadores de Errores Globales
 * 
 * Proporciona utilidades para el manejo consistente de errores en toda la aplicación.
 * Implementa patrones de manejo de errores que garantizan respuestas uniformes
 * y logging apropiado para debugging y monitoreo.
 * 
 * Características:
 * - Captura automática de errores en rutas async/await
 * - Formateo consistente de respuestas de error
 * - Mapeo de errores internos a códigos HTTP apropiados
 * - Logging de errores para debugging y monitoreo
 * - Prevención de exposición de información sensible
 * 
 * @module ErrorHandler
 * @author Backend Team
 */

/**
 * Wrapper para manejo automático de errores en rutas asíncronas
 * 
 * Express no maneja automáticamente los errores en funciones async/await.
 * Este wrapper captura cualquier excepción no manejada y la pasa al
 * middleware de manejo de errores global.
 * 
 * Beneficios:
 * - Elimina la necesidad de try/catch en cada ruta
 * - Garantiza que todos los errores sean manejados consistentemente
 * - Simplifica el código de los controladores
 * - Previene que la aplicación se cuelgue por errores no capturados
 * 
 * @param {Function} fn - Función de ruta asíncrona a envolver
 * @returns {Function} Función de middleware de Express
 * 
 * @example
 * // Sin errorAsync (manejo manual)
 * router.get('/products', async (req, res, next) => {
 *   try {
 *     const result = await productService.getAll();
 *     res.json(result);
 *   } catch (error) {
 *     next(error);
 *   }
 * });
 * 
 * // Con errorAsync (manejo automático)
 * router.get('/products', errorAsync(async (req, res) => {
 *   const result = await productService.getAll();
 *   res.json(result);
 * }));
 */
export const errorAsync = (fn) => (req, res, next) => {
  // Envolver la función en Promise.resolve para manejar tanto
  // funciones síncronas como asíncronas
  Promise.resolve(fn(req, res, next))
    .catch(next); // Pasar cualquier error al middleware global
};

/**
 * Middleware global de manejo de errores
 * 
 * Captura todos los errores no manejados en la aplicación y los formatea
 * en respuestas HTTP consistentes. Debe ser el último middleware registrado
 * en Express para capturar errores de todos los middlewares anteriores.
 * 
 * Funcionalidades:
 * - Mapeo de errores internos a códigos HTTP apropiados
 * - Formateo consistente de respuestas de error
 * - Logging de errores para debugging
 * - Prevención de exposición de stack traces en producción
 * - Manejo especial para diferentes tipos de errores
 * 
 * @param {Error} err - Error capturado
 * @param {Request} _req - Objeto de request de Express (no usado)
 * @param {Response} res - Objeto de response de Express
 * @param {Function} _next - Función next de Express (no usado)
 * 
 * @example
 * // Registro del middleware (debe ser el último)
 * app.use('/api', routes);
 * app.use(globalErrorHandler);
 */
export function globalErrorHandler(err, _req, res, _next) {
  
  // === LOGGING DE ERRORES ===
  
  // En desarrollo, mostrar stack trace completo
  if (process.env.NODE_ENV === 'development') {
    console.error('🚨 Error capturado por el manejador global:');
    console.error('Mensaje:', err.message);
    console.error('Stack:', err.stack);
    console.error('Código HTTP:', err.httpCode);
    console.error('Código de error:', err.code);
  } else {
    // En producción, logging más conciso
    console.error(`Error: ${err.code || 'UNKNOWN'} - ${err.message}`);
    
    // TODO: Integrar con servicio de logging (Winston, Bunyan, etc.)
    // TODO: Enviar errores críticos a servicio de monitoreo (Sentry, etc.)
  }
  
  // === DETERMINACIÓN DEL CÓDIGO DE ESTADO HTTP ===
  
  let statusCode = 500; // Default: Internal Server Error
  
  // Usar código HTTP específico si está disponible
  if (err.httpCode && typeof err.httpCode === 'number') {
    statusCode = err.httpCode;
  } 
  // Mapear tipos de errores comunes a códigos HTTP
  else if (err.name) {
    switch (err.name) {
      case 'ValidationError':
        statusCode = 400; // Bad Request
        break;
      case 'UnauthorizedError':
        statusCode = 401; // Unauthorized
        break;
      case 'ForbiddenError':
        statusCode = 403; // Forbidden
        break;
      case 'NotFoundError':
        statusCode = 404; // Not Found
        break;
      case 'ConflictError':
        statusCode = 409; // Conflict
        break;
      case 'SequelizeUniqueConstraintError':
        statusCode = 409; // Conflict
        break;
      case 'SequelizeValidationError':
        statusCode = 400; // Bad Request
        break;
      case 'SequelizeDatabaseError':
        statusCode = 500; // Internal Server Error
        break;
      default:
        statusCode = 500;
    }
  }
  
  // === DETERMINACIÓN DEL CÓDIGO DE ERROR ===
  
  let errorCode = 'INTERNAL_ERROR';
  
  if (err.code && typeof err.code === 'string') {
    errorCode = err.code;
  } else if (err.name) {
    // Convertir nombre de error a código consistente
    errorCode = err.name.replace(/Error$/, '').toUpperCase();
  }
  
  // === DETERMINACIÓN DEL MENSAJE DE ERROR ===
  
  let errorMessage = 'Error interno del servidor';
  
  if (err.message) {
    // En producción, filtrar mensajes que puedan exponer información sensible
    if (process.env.NODE_ENV === 'production') {
      // Lista de patrones que no deben exponerse en producción
      const sensitivePatterns = [
        /password/i,
        /token/i,
        /secret/i,
        /key/i,
        /connection/i,
        /database/i
      ];
      
      const isSensitive = sensitivePatterns.some(pattern => 
        pattern.test(err.message)
      );
      
      if (isSensitive) {
        errorMessage = 'Error interno del servidor';
      } else {
        errorMessage = err.message;
      }
    } else {
      // En desarrollo, mostrar mensaje completo
      errorMessage = err.message;
    }
  }
  
  // === CONSTRUCCIÓN DE LA RESPUESTA ===
  
  const errorResponse = {
    code: errorCode,
    message: errorMessage
  };
  
  // En desarrollo, agregar información adicional para debugging
  if (process.env.NODE_ENV === 'development') {
    errorResponse.stack = err.stack;
    errorResponse.timestamp = new Date().toISOString();
    
    // Agregar información del error original si existe
    if (err.original) {
      errorResponse.originalError = {
        message: err.original.message,
        code: err.original.code
      };
    }
  }
  
  // === ENVÍO DE LA RESPUESTA ===
  
  // Verificar que la respuesta no haya sido enviada ya
  if (!res.headersSent) {
    res.status(statusCode).json(errorResponse);
  } else {
    // Si ya se enviaron headers, solo logear el error
    console.error('Error después de enviar headers:', err.message);
  }
  
  // === MÉTRICAS Y MONITOREO ===
  
  // TODO: Incrementar contadores de errores por tipo
  // TODO: Enviar métricas a servicio de monitoreo
  // TODO: Alertar en caso de errores críticos o alta frecuencia
}
