# Documentación de la API REST

## Introducción

Este documento especifica la interfaz de programación (API) REST implementada para el proyecto académico de Sistema de Gestión de Infraestructura IoT. La API está construida con Hono.js sobre Supabase Edge Functions y proporciona **42 endpoints** para operaciones CRUD completas y consultas analíticas.

### URL Base
```
https://{PROJECT_ID}.supabase.co/functions/v1/make-server-5aa00d2c
```

### Autenticación
Todas las peticiones requieren un header de autorización con el token público de Supabase:
```
Authorization: Bearer {SUPABASE_ANON_KEY}
```

### Formato de Respuesta
Todas las respuestas de la API siguen un formato JSON consistente.

**Respuesta Exitosa**:
```json
[
  {
    "id": 1,
    "name": "Recurso ejemplo",
    ...
  }
]
```

**Respuesta de Error**:
```json
{
  "error": "Descripción del error"
}
```

### Códigos de Estado HTTP

| Código | Descripción |
|--------|-------------|
| 200 | OK - Petición exitosa |
| 201 | Created - Recurso creado exitosamente |
| 400 | Bad Request - Input inválido |
| 401 | Unauthorized - Autenticación faltante o inválida |
| 404 | Not Found - Recurso no encontrado |
| 500 | Internal Server Error - Error del servidor |

---

## Resumen por Método HTTP

| Método | Cantidad | Propósito |
|--------|----------|-----------|
| GET | 21 | Lectura y consultas |
| POST | 7 | Creación de recursos |
| PUT | 7 | Actualización de recursos |
| DELETE | 7 | Eliminación de recursos |
| **TOTAL** | **42** | **Operaciones CRUD completas** |

---

## Endpoints GET (21 endpoints)

### Sistema y Dashboard
1. `GET /health` - Health check del servidor
2. `GET /stats` - Estadísticas globales del sistema

### Proyectos
3. `GET /projects` - Listar todos los proyectos
4. `GET /projects/summary` - Resumen de proyectos con estadísticas
5. `GET /projects/:id/cascade-count` - Análisis de impacto de eliminación

### Ubicaciones
6. `GET /locations` - Listar todas las ubicaciones
7. `GET /locations/stats` - Estadísticas por ubicación
8. `GET /locations/:id/cascade-count` - Análisis de impacto de eliminación

### Dispositivos
9. `GET /devices` - Listar todos los dispositivos
10. `GET /devices/:id/cascade-count` - Análisis de impacto de eliminación

### Sensores
11. `GET /sensors` - Listar todos los sensores
12. `GET /sensors/analytics` - Análisis estadístico de sensores
13. `GET /sensors/:id/cascade-count` - Análisis de impacto de eliminación

### Lecturas
14. `GET /readings` - Obtener lecturas de sensores (últimas 100)

### Alertas
15. `GET /alerts` - Listar todas las alertas

### Mantenimiento
16. `GET /maintenance` - Listar registros de mantenimiento

### Tipos de Dispositivos
17. `GET /device-types` - Listar tipos de dispositivos
18. `GET /device-types/:id/cascade-count` - Verificar restricciones antes de eliminar

### Usuarios
19. `GET /users` - Listar todos los usuarios
20. `GET /users/:id/cascade-count` - Verificar restricciones antes de eliminar

### Firmware
21. `GET /firmware` - Listar versiones de firmware

---

## Endpoints POST (7 endpoints)

1. `POST /projects` - Crear nuevo proyecto
2. `POST /locations` - Crear nueva ubicación
3. `POST /devices` - Crear nuevo dispositivo
4. `POST /sensors` - Crear nuevo sensor
5. `POST /readings` - Crear nueva lectura de sensor
6. `POST /alerts` - Crear nueva alerta
7. `POST /maintenance` - Crear registro de mantenimiento

---

## Endpoints PUT (7 endpoints)

1. `PUT /projects/:id` - Actualizar proyecto
2. `PUT /locations/:id` - Actualizar ubicación
3. `PUT /devices/:id` - Actualizar dispositivo
4. `PUT /sensors/:id` - Actualizar sensor
5. `PUT /readings/:id` - Actualizar lectura
6. `PUT /alerts/:id` - Actualizar alerta
7. `PUT /maintenance/:id` - Actualizar registro de mantenimiento

---

## Endpoints DELETE (7 endpoints)

1. `DELETE /projects/:id` - Eliminar proyecto (CASCADE)
2. `DELETE /locations/:id` - Eliminar ubicación (CASCADE)
3. `DELETE /devices/:id` - Eliminar dispositivo (CASCADE)
4. `DELETE /sensors/:id` - Eliminar sensor (CASCADE)
5. `DELETE /readings/:id` - Eliminar lectura
6. `DELETE /alerts/:id` - Eliminar alerta
7. `DELETE /maintenance/:id` - Eliminar registro de mantenimiento

---

## Entidades con CRUD Completo (7 entidades)

Las siguientes entidades tienen las 4 operaciones CRUD implementadas:

| Entidad | GET | POST | PUT | DELETE |
|---------|-----|------|-----|--------|
| Proyectos | ✓ | ✓ | ✓ | ✓ |
| Ubicaciones | ✓ | ✓ | ✓ | ✓ |
| Dispositivos | ✓ | ✓ | ✓ | ✓ |
| Sensores | ✓ | ✓ | ✓ | ✓ |
| Lecturas | ✓ | ✓ | ✓ | ✓ |
| Alertas | ✓ | ✓ | ✓ | ✓ |
| Mantenimiento | ✓ | ✓ | ✓ | ✓ |

---

## Entidades con CRUD Parcial (3 entidades)

| Entidad | GET | POST | PUT | DELETE | Operaciones |
|---------|-----|------|-----|--------|-------------|
| Lecturas | ✓ | ✓ | - | ✓ | CRD (sin Update) |
| Tipos de Dispositivos | ✓ | ✓ | - | ✓ | CRD (sin Update) |
| Firmware | ✓ | - | - | - | R (solo lectura) |

---

## Endpoints Especiales

### Análisis de Impacto (CASCADE-COUNT)
Estos endpoints permiten analizar el impacto de eliminar un recurso antes de ejecutar la operación:

- `GET /projects/:id/cascade-count`
- `GET /locations/:id/cascade-count`
- `GET /devices/:id/cascade-count`
- `GET /sensors/:id/cascade-count`

### Endpoints de Análisis y Estadísticas
- `GET /stats` - Dashboard global
- `GET /projects/summary` - Análisis por proyecto
- `GET /locations/stats` - Estadísticas por ubicación
- `GET /sensors/analytics` - Análisis de sensores con lecturas

---

## Ejemplos de Uso

### 1. Obtener Estadísticas del Dashboard
```http
GET /make-server-5aa00d2c/stats
Authorization: Bearer {SUPABASE_ANON_KEY}
```

**Respuesta**:
```json
{
  "projects": 5,
  "devices": 24,
  "sensors": 48,
  "activeAlerts": 3
}
```

### 2. Listar Dispositivos con Relaciones
```http
GET /make-server-5aa00d2c/devices
Authorization: Bearer {SUPABASE_ANON_KEY}
```

**Respuesta**:
```json
[
  {
    "id": 1,
    "name": "ENV-CTRL-001",
    "status": "online",
    "ip_address": "192.168.1.101",
    "device_types": {
      "id": 1,
      "name": "Controlador Ambiental"
    },
    "iot_projects": {
      "id": 1,
      "name": "Smart Building Central"
    },
    "locations": {
      "id": 1,
      "name": "Edificio Principal - Piso 3",
      "city": "Huancayo"
    }
  }
]
```

### 3. Crear Nuevo Sensor
```http
POST /make-server-5aa00d2c/sensors
Authorization: Bearer {SUPABASE_ANON_KEY}
Content-Type: application/json

{
  "device_id": 1,
  "name": "Sensor Temperatura Sala A",
  "sensor_type": "temperature",
  "unit": "°C",
  "min_value": -10.0,
  "max_value": 50.0,
  "is_active": true,
  "calibration_date": "2024-12-01"
}
```

### 4. Análisis de Sensores con Estadísticas
```http
GET /make-server-5aa00d2c/sensors/analytics
Authorization: Bearer {SUPABASE_ANON_KEY}
```

**Respuesta**:
```json
[
  {
    "id": 1,
    "name": "Sensor Temperatura Sala A",
    "sensor_type": "temperature",
    "unit": "°C",
    "is_active": true,
    "devices": {
      "name": "ENV-CTRL-001",
      "status": "online",
      "locations": {
        "name": "Edificio Principal - Piso 3",
        "city": "Huancayo"
      }
    },
    "stats": {
      "totalReadings": 1256,
      "avgValue": 22.45,
      "minValue": 18.20,
      "maxValue": 26.80,
      "avgQuality": 0.95,
      "readingsLast24h": 48,
      "lastReading": {
        "value": "23.5",
        "timestamp": "2024-12-10T14:30:00Z",
        "quality_score": 0.98
      }
    }
  }
]
```

### 5. Actualizar Estado de Dispositivo
```http
PUT /make-server-5aa00d2c/devices/1
Authorization: Bearer {SUPABASE_ANON_KEY}
Content-Type: application/json

{
  "status": "online",
  "last_seen": "2024-12-10T15:00:00Z"
}
```

### 6. Verificar Impacto Antes de Eliminar
```http
GET /make-server-5aa00d2c/projects/1/cascade-count
Authorization: Bearer {SUPABASE_ANON_KEY}
```

**Respuesta**:
```json
{
  "devices": 12,
  "sensors": 28,
  "alerts": 5,
  "maintenance": 8,
  "sensor_readings": 1256
}
```

### 7. Resolver Alerta
```http
PUT /make-server-5aa00d2c/alerts/5/resolve
Authorization: Bearer {SUPABASE_ANON_KEY}
```

**Respuesta**:
```json
{
  "id": 5,
  "status": "resolved",
  "resolved_at": "2024-12-10T15:30:00Z",
  ...
}
```

---

## Consultas SQL Complejas Implementadas

### 1. Análisis Multi-tabla con Agregaciones
**Endpoint**: `GET /projects/summary`
- **JOIN de 5 tablas**: projects → devices → sensors, alerts, maintenance_logs
- **Operaciones**: COUNT, filtros condicionales, agrupamiento
- **Propósito**: Obtener estadísticas completas por proyecto

### 2. Estadísticas por Ubicación
**Endpoint**: `GET /locations/stats`
- **JOIN de 6 tablas**: locations → devices → sensors, device_types, projects, alerts, maintenance
- **Operaciones**: COUNT, filtros por status, agregaciones
- **Propósito**: Análisis detallado de dispositivos por ubicación

### 3. Análisis de Sensores con Lecturas
**Endpoint**: `GET /sensors/analytics`
- **JOIN de 4 tablas**: sensors → devices → projects, locations, sensor_readings
- **Operaciones**: AVG, MIN, MAX, COUNT, filtros por timestamp
- **Propósito**: Estadísticas completas de sensores con análisis de lecturas

### 4. Análisis de Impacto en Cascada
**Endpoints**: `GET /:resource/:id/cascade-count`
- **Consultas anidadas**: Múltiples niveles de dependencias
- **Operaciones**: COUNT condicional en múltiples tablas
- **Propósito**: Calcular registros que serán afectados por eliminación CASCADE

---

## Notas Técnicas

### Paginación
- `GET /readings` - Limitado a 100 registros más recientes

### Ordenamiento
- La mayoría de endpoints GET ordenan por `created_at DESC`
- `GET /device-types` ordena por `name ASC`

### JOINs
- Uso extensivo de Supabase's `.select()` con nested relations
- Todos los endpoints GET incluyen datos relacionados cuando es relevante

### Restricciones de Integridad
- **CASCADE**: projects, locations, devices, sensors
- **RESTRICT**: device_types, users (cuando tienen registros relacionados)

### Validación
- El servidor valida integridad referencial antes de operaciones DELETE
- Los endpoints `cascade-count` permiten preview de impacto

### Timestamps
- Todos los recursos incluyen `created_at` automático
- Timestamps en formato ISO 8601

---

**Última Actualización**: Diciembre 2025  
**Total de Endpoints**: 42 (21 GET + 7 POST + 7 PUT + 7 DELETE)  
**Versión de la API**: 1.0  
**Proyecto Académico**: Diseño de Base de Datos - FIS UNCP
