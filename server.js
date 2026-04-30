const express = require('express');
const winston = require('winston');

// ============================================
// CONFIGURACIÓN DE WINSTON (LOGGER)
// ============================================
const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    winston.format.errors({ stack: true }),
    winston.format.printf(({ timestamp, level, message, stack }) => {
      const levelUpper = level.toUpperCase().padEnd(7);
      const logMessage = stack ? `${message}\n${stack}` : message;
      return `[${timestamp}] ${levelUpper} | ${logMessage}`;
    })
  ),
  transports: [
    new winston.transports.Console({
      colorize: true,
      colors: {
        info: 'cyan',
        error: 'red',
        warn: 'yellow',
        debug: 'gray'
      }
    })
  ]
});

// ============================================
// INICIALIZACIÓN DE EXPRESS
// ============================================
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware para parsear JSON
app.use(express.json());

// Base de datos simulada (array en memoria)
let database = [];

// ============================================
// MIDDLEWARE DE LOGGING PARA TODAS LAS REQUESTS
// ============================================
app.use((req, res, next) => {
  const startTime = Date.now();
  
  // Interceptar la función res.send para loguear la respuesta
  const originalSend = res.send;
  res.send = function(data) {
    const duration = Date.now() - startTime;
    logger.info(`${req.method} ${req.path} - Status: ${res.statusCode} - ${duration}ms`);
    return originalSend.call(this, data);
  };
  
  next();
});

// ============================================
// ENDPOINT 1: GET /status/200
// ============================================
app.get('/status/200', (req, res) => {
  try {
    logger.debug('Procesando GET /status/200');
    res.status(200).send({ message: 'hola mundo' });
  } catch (error) {
    logger.error(`Error en GET /status/200: ${error.message}`, { error });
    res.status(500).send({ error: 'Error interno del servidor' });
  }
});

// ============================================
// ENDPOINT 2: GET /status/500
// ============================================
app.get('/status/500', (req, res) => {
  try {
    logger.debug('Procesando GET /status/500');
    res.status(500).send({ message: 'internal server error' });
  } catch (error) {
    logger.error(`Error en GET /status/500: ${error.message}`, { error });
    res.status(500).send({ error: 'Error interno del servidor' });
  }
});

// ============================================
// ENDPOINT 3: GET /status/429
// ============================================
app.get('/status/429', (req, res) => {
  try {
    logger.debug('Procesando GET /status/429');
    res.status(429).send({ message: 'too many requests' });
  } catch (error) {
    logger.error(`Error en GET /status/429: ${error.message}`, { error });
    res.status(500).send({ error: 'Error interno del servidor' });
  }
});

// ============================================
// ENDPOINT 4: POST /status/save
// ============================================
app.post('/status/save', (req, res) => {
  try {
    logger.debug('Procesando POST /status/save');
    
    // Validar que el body no esté vacío
    if (!req.body || Object.keys(req.body).length === 0) {
      logger.warn('POST /status/save: Body vacío recibido');
      return res.status(400).send({ error: 'El body no puede estar vacío' });
    }

    // Simular fallo de base de datos con 50% de probabilidad
    const failureChance = Math.random();
    
    if (failureChance < 0.5) {
      logger.warn('POST /status/save: Simulando error de base de datos (50%)');
      return res.status(500).send({ error: 'Error al guardar en la base de datos' });
    }

    // Guardar el registro en la base de datos simulada
    const record = {
      id: database.length + 1,
      data: req.body,
      timestamp: new Date().toISOString()
    };
    
    database.push(record);
    logger.info(`POST /status/save: Registro guardado exitosamente (ID: ${record.id})`);
    
    res.status(201).send({ 
      message: 'Registro guardado exitosamente', 
      record: record 
    });
  } catch (error) {
    logger.error(`Error en POST /status/save: ${error.message}`, { error });
    res.status(500).send({ error: 'Error interno del servidor' });
  }
});

// ============================================
// ENDPOINT 5: GET /status/save
// ============================================
app.get('/status/save', (req, res) => {
  try {
    logger.debug('Procesando GET /status/save');
    
    if (database.length === 0) {
      logger.info('GET /status/save: No hay registros en la base de datos');
      return res.status(200).send({ 
        message: 'No hay registros', 
        data: [] 
      });
    }

    logger.info(`GET /status/save: Retornando ${database.length} registros`);
    res.status(200).send({ 
      message: 'Registros recuperados exitosamente',
      count: database.length,
      data: database 
    });
  } catch (error) {
    logger.error(`Error en GET /status/save: ${error.message}`, { error });
    res.status(500).send({ error: 'Error interno del servidor' });
  }
});

// ============================================
// ENDPOINT ADICIONAL: DELETE /status/save/:id
// ============================================
app.delete('/status/save/:id', (req, res) => {
  try {
    logger.debug(`Procesando DELETE /status/save/${req.params.id}`);
    
    const id = parseInt(req.params.id);
    const initialLength = database.length;
    database = database.filter(record => record.id !== id);
    
    if (database.length === initialLength) {
      logger.warn(`DELETE /status/save/${id}: Registro no encontrado`);
      return res.status(404).send({ error: 'Registro no encontrado' });
    }

    logger.info(`DELETE /status/save/${id}: Registro eliminado exitosamente`);
    res.status(200).send({ message: 'Registro eliminado exitosamente' });
  } catch (error) {
    logger.error(`Error en DELETE /status/save/${req.params.id}: ${error.message}`, { error });
    res.status(500).send({ error: 'Error interno del servidor' });
  }
});

// ============================================
// ENDPOINT PARA LIMPIAR LA BASE DE DATOS
// ============================================
app.post('/status/clear', (req, res) => {
  try {
    logger.debug('Procesando POST /status/clear');
    const count = database.length;
    database = [];
    logger.info(`POST /status/clear: Base de datos limpiada (${count} registros eliminados)`);
    res.status(200).send({ message: `Base de datos limpiada (${count} registros eliminados)` });
  } catch (error) {
    logger.error(`Error en POST /status/clear: ${error.message}`, { error });
    res.status(500).send({ error: 'Error interno del servidor' });
  }
});

// ============================================
// MANEJO DE RUTAS NO ENCONTRADAS
// ============================================
app.use((req, res) => {
  logger.warn(`Ruta no encontrada: ${req.method} ${req.path}`);
  res.status(404).send({ 
    error: 'Ruta no encontrada',
    path: req.path,
    method: req.method
  });
});

// ============================================
// MANEJO GLOBAL DE ERRORES
// ============================================
app.use((error, req, res, next) => {
  logger.error(`Error global sin manejar: ${error.message}`, { error });
  res.status(500).send({ 
    error: 'Error interno del servidor',
    message: error.message 
  });
});

// ============================================
// INICIAR SERVIDOR
// ============================================
const server = app.listen(PORT, () => {
  logger.info(`═══════════════════════════════════════════════════════════`);
  logger.info(`✓ Servidor iniciado exitosamente`);
  logger.info(`✓ Escuchando en http://localhost:${PORT}`);
  logger.info(`═══════════════════════════════════════════════════════════`);
});

// ============================================
// MANEJO DE EXCEPCIONES NO CAPTURADAS
// ============================================
process.on('uncaughtException', (error) => {
  logger.error('Excepción no capturada en el proceso:', { error });
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  logger.error('Promesa rechazada sin manejar:', { reason });
});

// Manejo graceful shutdown
process.on('SIGTERM', () => {
  logger.info('Señal SIGTERM recibida. Cerrando servidor gracefully...');
  server.close(() => {
    logger.info('Servidor cerrado');
    process.exit(0);
  });
});

module.exports = app;
