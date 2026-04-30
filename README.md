# REST API con Express y Winston

Una aplicación API REST completa con endpoints de estado, sistema de logging profesional con Winston y manejo robusto de excepciones.

## 📋 Requisitos

- Node.js (v14 o superior)
- npm

## 🚀 Instalación y Ejecución

### 1. Instalar dependencias
```bash
npm install
```

### 2. Iniciar el servidor
```bash
npm start
```

Deberías ver un output similar a:
```
[2024-01-15 10:30:45] INFO    | ═══════════════════════════════════════════════════════════
[2024-01-15 10:30:45] INFO    | ✓ Servidor iniciado exitosamente
[2024-01-15 10:30:45] INFO    | ✓ Escuchando en http://localhost:3000
[2024-01-15 10:30:45] INFO    | ═══════════════════════════════════════════════════════════
```

## 📡 Endpoints Disponibles

### 1. GET /status/200
Retorna un mensaje de éxito con status 200.

```bash
curl http://localhost:3000/status/200
```

**Respuesta:**
```json
{
  "message": "hola mundo"
}
```

---

### 2. GET /status/500
Retorna un error interno del servidor con status 500.

```bash
curl http://localhost:3000/status/500
```

**Respuesta:**
```json
{
  "message": "internal server error"
}
```

---

### 3. GET /status/429
Retorna un error de límite de solicitudes con status 429.

```bash
curl http://localhost:3000/status/429
```

**Respuesta:**
```json
{
  "message": "too many requests"
}
```

---

### 4. POST /status/save
Guarda un registro en la base de datos simulada (array en memoria).

⚠️ **Importante:** Tiene una probabilidad del 50% de simular un error de base de datos.

```bash
curl -X POST http://localhost:3000/status/save \
  -H "Content-Type: application/json" \
  -d '{"nombre": "Juan", "edad": 30, "ciudad": "Buenos Aires"}'
```

**Respuesta (Éxito - 201):**
```json
{
  "message": "Registro guardado exitosamente",
  "record": {
    "id": 1,
    "data": {
      "nombre": "Juan",
      "edad": 30,
      "ciudad": "Buenos Aires"
    },
    "timestamp": "2024-01-15T10:35:20.123Z"
  }
}
```

**Respuesta (Error - 500):**
```json
{
  "error": "Error al guardar en la base de datos"
}
```

---

### 5. GET /status/save
Obtiene todos los registros guardados en la base de datos simulada.

```bash
curl http://localhost:3000/status/save
```

**Respuesta:**
```json
{
  "message": "Registros recuperados exitosamente",
  "count": 2,
  "data": [
    {
      "id": 1,
      "data": {
        "nombre": "Juan",
        "edad": 30
      },
      "timestamp": "2024-01-15T10:35:20.123Z"
    },
    {
      "id": 2,
      "data": {
        "nombre": "María",
        "edad": 25
      },
      "timestamp": "2024-01-15T10:36:45.456Z"
    }
  ]
}
```

---

### 6. DELETE /status/save/:id (BONUS)
Elimina un registro específico por ID.

```bash
curl -X DELETE http://localhost:3000/status/save/1
```

**Respuesta (Éxito - 200):**
```json
{
  "message": "Registro eliminado exitosamente"
}
```

---

### 7. POST /status/clear (BONUS)
Limpia toda la base de datos simulada.

```bash
curl -X POST http://localhost:3000/status/clear
```

**Respuesta:**
```json
{
  "message": "Base de datos limpiada (2 registros eliminados)"
}
```

---

## 📊 Sistema de Logging con Winston

El servidor implementa un sistema completo de logging con las siguientes características:

### Niveles de Log
- **ERROR**: Errores graves y excepciones
- **WARN**: Advertencias y eventos sospechosos
- **INFO**: Información general del servidor
- **DEBUG**: Información detallada para debugging

### Formato de Log
```
[TIMESTAMP] LEVEL | MENSAJE
[2024-01-15 10:30:45] INFO    | GET /status/200 - Status: 200 - 5ms
[2024-01-15 10:30:46] ERROR   | Error en POST /status/save: TypeError: Cannot read property...
```

### Características
- ✅ Timestamps en formato legible
- ✅ Colores en la consola (ERROR=Rojo, WARN=Amarillo, INFO=Cyan, DEBUG=Gris)
- ✅ Stack traces para excepciones
- ✅ Logging de inicio y cierre de servidor
- ✅ Logging de todas las requests y responses
- ✅ Logging de errores en cada endpoint

## 🛡️ Manejo de Excepciones

La aplicación implementa múltiples niveles de manejo de errores:

1. **Try-Catch en cada endpoint**: Cada ruta está protegida con try-catch
2. **Middleware de error global**: Captura errores no manejados
3. **Validación de datos**: Valida los datos de entrada
4. **Manejo de procesos**: 
   - `uncaughtException`: Excepciones no capturadas
   - `unhandledRejection`: Promesas rechazadas sin manejar
   - `SIGTERM`: Cierre graceful del servidor

## 📝 Ejemplos de Uso Completo

### Crear varios registros
```bash
curl -X POST http://localhost:3000/status/save \
  -H "Content-Type: application/json" \
  -d '{"usuario": "alice", "rol": "admin"}'

curl -X POST http://localhost:3000/status/save \
  -H "Content-Type: application/json" \
  -d '{"usuario": "bob", "rol": "user"}'

curl -X POST http://localhost:3000/status/save \
  -H "Content-Type: application/json" \
  -d '{"usuario": "charlie", "rol": "user"}'
```

### Recuperar todos los registros
```bash
curl http://localhost:3000/status/save | json_pp
```

### Eliminar un registro específico
```bash
curl -X DELETE http://localhost:3000/status/save/2
```

### Limpiar todo
```bash
curl -X POST http://localhost:3000/status/clear
```

## 🧪 Probar Manejo de Errores

### Error 400 - Body vacío
```bash
curl -X POST http://localhost:3000/status/save \
  -H "Content-Type: application/json" \
  -d '{}'
```

### Error 404 - Ruta no encontrada
```bash
curl http://localhost:3000/ruta-inexistente
```

## 🎯 Características Implementadas

✅ Endpoints solicitados (GET /status/200, 500, 429)
✅ POST /status/save con base de datos simulada
✅ GET /status/save para recuperar registros
✅ Logging con Winston en consola
✅ Formato legible con fecha, nivel y mensaje
✅ Manejo de excepciones en todos los endpoints
✅ Validación de datos
✅ Middleware global de error
✅ Manejo de excepciones del proceso
✅ Endpoints bonus (DELETE, Clear)
✅ Timestamps en registros
✅ Logging de duración de requests

## 📦 Dependencias

- **express**: Framework web minimalista
- **winston**: Logger profesional para Node.js

## 🔧 Personalización

Puedes cambiar el puerto editando la variable `PORT` en `server.js`:

```javascript
const PORT = process.env.PORT || 3000; // Cambiar 3000 por otro puerto
```

## 📄 Licencia

ISC
