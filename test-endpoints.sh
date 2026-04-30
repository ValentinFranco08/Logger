#!/bin/bash

# ============================================
# SCRIPT DE PRUEBAS - ENDPOINTS API
# ============================================
# Ejecutar con: bash test-endpoints.sh
# Asegúrate de que el servidor esté corriendo en http://localhost:3000

BASE_URL="http://localhost:3000"

echo "=========================================="
echo "PRUEBAS DE ENDPOINTS - REST API"
echo "=========================================="
echo ""

# Test 1: GET /status/200
echo "🟢 TEST 1: GET /status/200"
echo "Descripción: Debe retornar 'hola mundo' con status 200"
curl -s -w "\nStatus Code: %{http_code}\n\n" \
  "$BASE_URL/status/200" | jq '.' 2>/dev/null || curl -s -w "\nStatus Code: %{http_code}\n\n" "$BASE_URL/status/200"

# Test 2: GET /status/500
echo "🔴 TEST 2: GET /status/500"
echo "Descripción: Debe retornar 'internal server error' con status 500"
curl -s -w "\nStatus Code: %{http_code}\n\n" \
  "$BASE_URL/status/500" | jq '.' 2>/dev/null || curl -s -w "\nStatus Code: %{http_code}\n\n" "$BASE_URL/status/500"

# Test 3: GET /status/429
echo "🟡 TEST 3: GET /status/429"
echo "Descripción: Debe retornar 'too many requests' con status 429"
curl -s -w "\nStatus Code: %{http_code}\n\n" \
  "$BASE_URL/status/429" | jq '.' 2>/dev/null || curl -s -w "\nStatus Code: %{http_code}\n\n" "$BASE_URL/status/429"

# Test 4: POST /status/save - Registro 1
echo "📝 TEST 4: POST /status/save - Registro 1"
echo "Descripción: Guardar un registro (50% chance de error)"
curl -s -w "\nStatus Code: %{http_code}\n\n" \
  -X POST "$BASE_URL/status/save" \
  -H "Content-Type: application/json" \
  -d '{"nombre": "Juan Pérez", "email": "juan@example.com", "edad": 30}' | jq '.' 2>/dev/null || \
curl -s -w "\nStatus Code: %{http_code}\n\n" \
  -X POST "$BASE_URL/status/save" \
  -H "Content-Type: application/json" \
  -d '{"nombre": "Juan Pérez", "email": "juan@example.com", "edad": 30}'

# Test 5: POST /status/save - Registro 2
echo "📝 TEST 5: POST /status/save - Registro 2"
echo "Descripción: Guardar otro registro"
curl -s -w "\nStatus Code: %{http_code}\n\n" \
  -X POST "$BASE_URL/status/save" \
  -H "Content-Type: application/json" \
  -d '{"nombre": "María García", "email": "maria@example.com", "edad": 25}' | jq '.' 2>/dev/null || \
curl -s -w "\nStatus Code: %{http_code}\n\n" \
  -X POST "$BASE_URL/status/save" \
  -H "Content-Type: application/json" \
  -d '{"nombre": "María García", "email": "maria@example.com", "edad": 25}'

# Test 6: POST /status/save - Registro 3
echo "📝 TEST 6: POST /status/save - Registro 3"
echo "Descripción: Guardar un tercer registro"
curl -s -w "\nStatus Code: %{http_code}\n\n" \
  -X POST "$BASE_URL/status/save" \
  -H "Content-Type: application/json" \
  -d '{"nombre": "Carlos López", "email": "carlos@example.com", "edad": 35}' | jq '.' 2>/dev/null || \
curl -s -w "\nStatus Code: %{http_code}\n\n" \
  -X POST "$BASE_URL/status/save" \
  -H "Content-Type: application/json" \
  -d '{"nombre": "Carlos López", "email": "carlos@example.com", "edad": 35}'

# Test 7: GET /status/save
echo "📊 TEST 7: GET /status/save"
echo "Descripción: Obtener todos los registros guardados"
curl -s -w "\nStatus Code: %{http_code}\n\n" \
  "$BASE_URL/status/save" | jq '.' 2>/dev/null || curl -s -w "\nStatus Code: %{http_code}\n\n" "$BASE_URL/status/save"

# Test 8: POST /status/save - Body vacío (Error 400)
echo "❌ TEST 8: POST /status/save - Body vacío"
echo "Descripción: Debe retornar error 400 (body vacío)"
curl -s -w "\nStatus Code: %{http_code}\n\n" \
  -X POST "$BASE_URL/status/save" \
  -H "Content-Type: application/json" \
  -d '{}' | jq '.' 2>/dev/null || \
curl -s -w "\nStatus Code: %{http_code}\n\n" \
  -X POST "$BASE_URL/status/save" \
  -H "Content-Type: application/json" \
  -d '{}'

# Test 9: GET /ruta-inexistente (Error 404)
echo "❌ TEST 9: GET /ruta-inexistente"
echo "Descripción: Debe retornar error 404 (ruta no encontrada)"
curl -s -w "\nStatus Code: %{http_code}\n\n" \
  "$BASE_URL/ruta-inexistente" | jq '.' 2>/dev/null || curl -s -w "\nStatus Code: %{http_code}\n\n" "$BASE_URL/ruta-inexistente"

# Test 10: DELETE /status/save/:id
echo "🗑️  TEST 10: DELETE /status/save/1"
echo "Descripción: Eliminar el primer registro"
curl -s -w "\nStatus Code: %{http_code}\n\n" \
  -X DELETE "$BASE_URL/status/save/1" | jq '.' 2>/dev/null || curl -s -w "\nStatus Code: %{http_code}\n\n" -X DELETE "$BASE_URL/status/save/1"

# Test 11: GET /status/save después del DELETE
echo "📊 TEST 11: GET /status/save (después de DELETE)"
echo "Descripción: Verificar que el registro fue eliminado"
curl -s -w "\nStatus Code: %{http_code}\n\n" \
  "$BASE_URL/status/save" | jq '.' 2>/dev/null || curl -s -w "\nStatus Code: %{http_code}\n\n" "$BASE_URL/status/save"

# Test 12: POST /status/clear
echo "🧹 TEST 12: POST /status/clear"
echo "Descripción: Limpiar toda la base de datos"
curl -s -w "\nStatus Code: %{http_code}\n\n" \
  -X POST "$BASE_URL/status/clear" | jq '.' 2>/dev/null || curl -s -w "\nStatus Code: %{http_code}\n\n" -X POST "$BASE_URL/status/clear"

# Test 13: GET /status/save después del CLEAR
echo "📊 TEST 13: GET /status/save (después de CLEAR)"
echo "Descripción: Verificar que la base de datos está vacía"
curl -s -w "\nStatus Code: %{http_code}\n\n" \
  "$BASE_URL/status/save" | jq '.' 2>/dev/null || curl -s -w "\nStatus Code: %{http_code}\n\n" "$BASE_URL/status/save"

echo ""
echo "=========================================="
echo "✅ PRUEBAS COMPLETADAS"
echo "=========================================="
echo ""
echo "💡 NOTAS:"
echo "- Si ves 'command not found: jq', instálalo con: sudo apt-get install jq"
echo "- POST /status/save tiene 50% de probabilidad de retornar error 500"
echo "- Revisa la consola del servidor para ver los logs en tiempo real"
