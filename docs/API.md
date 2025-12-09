# Documentación de la API REST

## Introducción

Este documento especifica la interfaz de programación (API) REST implementada para el proyecto académico de Sistema de Gestión de Infraestructura IoT. La API está construida con Hono.js sobre Supabase Edge Functions y proporciona 28 endpoints para operaciones CRUD y consultas analíticas (19 GET para lectura y consultas, 9 POST para creación de recursos).

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
Todas las respuestas de la API siguen un formato JSON consistente:

**Respuesta Exitosa (GET)**:
```json
{
  "data": [...],
  "count": 10
}
```

**Respuesta Exitosa (POST)**:
```json
{
  "success": true,
  "data": {...},
  "message": "Recurso creado exitosamente"
}
```

**Respuesta de Error**:
```json
{
  "error": "Descripción del error",
  "code": "CODIGO_ERROR"
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

## Especificación de Endpoints

### Índice de Endpoints

#### Operaciones de Lectura (GET - 19 endpoints)
1. [Estadísticas del Sistema](#estadísticas-del-sistema)
2. [Gestión de Dispositivos](#gestión-de-dispositivos)
3. [Gestión de Sensores](#gestión-de-sensores)
4. [Lecturas de Sensores](#lecturas-de-sensores)
5. [Sistema de Alertas](#sistema-de-alertas)
6. [Gestión de Mantenimiento](#gestión-de-mantenimiento)
7. [Análisis de Proyectos](#análisis-de-proyectos)
8. [Estadísticas por Ubicación](#estadísticas-por-ubicación)
9. [Rendimiento de Técnicos](#rendimiento-de-técnicos)
10. [Análisis de Firmware](#análisis-de-firmware)

#### Operaciones de Creación (POST - 9 endpoints)
11. [Crear Proyecto](#crear-proyecto)
12. [Crear Dispositivo](#crear-dispositivo)
13. [Crear Sensor](#crear-sensor)
14. [Crear Lectura de Sensor](#crear-lectura-de-sensor)
15. [Crear Alerta](#crear-alerta)
16. [Crear Registro de Mantenimiento](#crear-registro-de-mantenimiento)
17. [Crear Usuario](#crear-usuario)
18. [Crear Tipo de Dispositivo](#crear-tipo-de-dispositivo)
19. [Crear Ubicación](#crear-ubicación)

---

## Estadísticas del Sistema

### Obtener Estadísticas Globales

Retorna métricas globales del sistema incluyendo contadores de proyectos, dispositivos, sensores y alertas.

**Endpoint**: `GET /stats`

**Autenticación**: Requerida

**Parámetros**: Ninguno

**Respuesta**:
```json
{
  "projects": 5,
  "devices": 11,
  "sensors": 19,
  "activeAlerts": 5
}
```

**Ejemplo cURL**:
```bash
curl -X GET \
  'https://your-project.supabase.co/functions/v1/make-server-5aa00d2c/stats' \
  -H 'Authorization: Bearer YOUR_ANON_KEY'
```

**Consulta SQL Implementada**:
```sql
SELECT COUNT(*) FROM iot_projects WHERE status = 'active';
SELECT COUNT(*) FROM devices;
SELECT COUNT(*) FROM sensors WHERE is_active = true;
SELECT COUNT(*) FROM alerts WHERE status = 'active';
```

---

### Obtener Métricas de Dashboard

Retorna métricas completas del dashboard con desglose detallado.

**Endpoint**: `GET /dashboard/metrics`

**Autenticación**: Requerida

**Respuesta**:
```json
{
  "projects": {
    "total": 5,
    "active": 5,
    "inactive": 0,
    "completed": 0
  },
  "devices": {
    "total": 11,
    "online": 7,
    "offline": 1,
    "maintenance": 1,
    "error": 2
  },
  "sensors": {
    "total": 19,
    "active": 19
  },
  "alerts": {
    "total": 8,
    "active": 5,
    "critical": 3,
    "high": 2,
    "medium": 2,
    "low": 1
  },
  "readings": {
    "last24h": 850
  },
  "maintenance": {
    "total": 8,
    "scheduled": 2,
    "inProgress": 1,
    "completed": 5
  },
  "locations": {
    "total": 6
  }
}
```

---

## Gestión de Dispositivos

### Listar Todos los Dispositivos

Retorna lista de dispositivos IoT con información relacionada.

**Endpoint**: `GET /devices`

**Autenticación**: Requerida

**Parámetros de Query**:
| Parámetro | Tipo | Requerido | Descripción |
|-----------|------|----------|-------------|
| status | string | No | Filtrar por estado (online, offline, maintenance, error) |
| project_id | number | No | Filtrar por ID de proyecto |

**Respuesta**:
```json
[
  {
    "id": 1,
    "name": "Gateway-DC-01",
    "mac_address": "00:1B:44:11:3A:B7",
    "ip_address": "192.168.1.101",
    "status": "online",
    "firmware_version": "2.1.0",
    "last_seen": "2024-12-09T10:30:00Z",
    "created_at": "2024-01-15T08:00:00Z",
    "device_types": {
      "name": "Sensor Gateway IoT",
      "manufacturer": "TechIoT Inc"
    },
    "iot_projects": {
      "name": "Monitoreo Climatización"
    },
    "locations": {
      "name": "Data Center Norte",
      "city": "Madrid"
    }
  }
]
```

**Consulta SQL Implementada**:
```sql
SELECT 
  d.*,
  dt.name as device_type_name,
  dt.manufacturer,
  p.name as project_name,
  l.name as location_name,
  l.city
FROM devices d
INNER JOIN device_types dt ON d.device_type_id = dt.id
INNER JOIN iot_projects p ON d.project_id = p.id
LEFT JOIN locations l ON d.location_id = l.id
WHERE d.status = 'online'
ORDER BY d.last_seen DESC;
```

---

### Obtener Dispositivo por ID

Retorna información detallada de un dispositivo específico.

**Endpoint**: `GET /devices/:id`

**Autenticación**: Requerida

**Parámetros de Ruta**:
| Parámetro | Tipo | Requerido | Descripción |
|-----------|------|----------|-------------|
| id | number | Sí | ID del dispositivo |

**Respuesta**:
```json
{
  "id": 1,
  "name": "Gateway-DC-01",
  "mac_address": "00:1B:44:11:3A:B7",
  "ip_address": "192.168.1.101",
  "status": "online",
  "firmware_version": "2.1.0",
  "last_seen": "2024-12-09T10:30:00Z",
  "device_types": {
    "name": "Sensor Gateway IoT"
  },
  "sensors": [
    {
      "id": 1,
      "name": "Temperatura Ambiente",
      "sensor_type": "temperature",
      "unit": "°C"
    }
  ]
}
```

---

## Gestión de Sensores

### Listar Todos los Sensores

Retorna lista de sensores con información del dispositivo.

**Endpoint**: `GET /sensors`

**Autenticación**: Requerida

**Parámetros de Query**:
| Parámetro | Tipo | Requerido | Descripción |
|-----------|------|----------|-------------|
| device_id | number | No | Filtrar por ID de dispositivo |
| sensor_type | string | No | Filtrar por tipo de sensor |
| is_active | boolean | No | Filtrar por estado activo |

**Respuesta**:
```json
[
  {
    "id": 1,
    "name": "Temperatura Ambiente",
    "sensor_type": "temperature",
    "unit": "°C",
    "min_value": -10,
    "max_value": 50,
    "is_active": true,
    "calibration_date": "2024-10-01",
    "devices": {
      "name": "TempCtrl-DC-01",
      "status": "online"
    }
  }
]
```

---

### Obtener Análisis de Sensores

Retorna análisis estadístico para todos los sensores.

**Endpoint**: `GET /sensors/analytics`

**Autenticación**: Requerida

**Respuesta**:
```json
[
  {
    "id": 1,
    "name": "Temperatura Ambiente",
    "sensor_type": "temperature",
    "unit": "°C",
    "devices": {
      "name": "TempCtrl-DC-01",
      "iot_projects": {
        "name": "Monitoreo Climatización"
      },
      "locations": {
        "name": "Data Center Norte",
        "city": "Madrid"
      }
    },
    "stats": {
      "totalReadings": 48,
      "avgValue": "22.45",
      "minValue": "19.50",
      "maxValue": "25.80",
      "avgQuality": "0.965",
      "readingsLast24h": 48,
      "lastReading": {
        "value": 23.2,
        "timestamp": "2024-12-09T10:30:00Z",
        "quality_score": 0.98
      }
    }
  }
]
```

**Consulta SQL Implementada**:
```sql
SELECT 
  s.*,
  COUNT(sr.id) as total_readings,
  AVG(sr.value) as avg_value,
  MIN(sr.value) as min_value,
  MAX(sr.value) as max_value,
  AVG(sr.quality_score) as avg_quality
FROM sensors s
LEFT JOIN sensor_readings sr ON s.id = sr.sensor_id
GROUP BY s.id;
```

---

## Lecturas de Sensores

### Obtener Lecturas de Sensores

Retorna datos de series temporales de sensores.

**Endpoint**: `GET /readings`

**Autenticación**: Requerida

**Parámetros de Query**:
| Parámetro | Tipo | Requerido | Descripción |
|-----------|------|----------|-------------|
| sensor_id | number | No | Filtrar por ID de sensor |
| limit | number | No | Número de registros (default: 50, max: 1000) |
| from | string | No | Timestamp de inicio (ISO 8601) |
| to | string | No | Timestamp de fin (ISO 8601) |

**Respuesta**:
```json
[
  {
    "id": 1,
    "value": 23.5,
    "timestamp": "2024-12-09T10:30:00Z",
    "quality_score": 0.98,
    "metadata": {},
    "sensors": {
      "name": "Temperatura Ambiente",
      "unit": "°C",
      "sensor_type": "temperature",
      "devices": {
        "name": "TempCtrl-DC-01"
      }
    }
  }
]
```

**Consulta SQL Implementada**:
```sql
SELECT 
  sr.*,
  s.name as sensor_name,
  s.unit,
  s.sensor_type,
  d.name as device_name
FROM sensor_readings sr
INNER JOIN sensors s ON sr.sensor_id = s.id
INNER JOIN devices d ON s.device_id = d.id
WHERE sr.sensor_id = $1
ORDER BY sr.timestamp DESC
LIMIT $2;
```

---

## Sistema de Alertas

### Listar Alertas

Retorna alertas generadas por el sistema.

**Endpoint**: `GET /alerts`

**Autenticación**: Requerida

**Parámetros de Query**:
| Parámetro | Tipo | Requerido | Descripción |
|-----------|------|----------|-------------|
| status | string | No | Filtrar por estado (active, acknowledged, resolved, dismissed) |
| severity | string | No | Filtrar por severidad (low, medium, high, critical) |
| device_id | number | No | Filtrar por ID de dispositivo |

**Respuesta**:
```json
[
  {
    "id": 1,
    "severity": "high",
    "message": "Temperatura por encima del umbral recomendado (26.5°C)",
    "alert_type": "threshold_exceeded",
    "status": "active",
    "created_at": "2024-12-09T07:30:00Z",
    "resolved_at": null,
    "resolved_by": null,
    "devices": {
      "name": "TempCtrl-DC-01",
      "status": "online"
    }
  }
]
```

---

### Obtener Alertas Detalladas

Retorna alertas con información contextual completa.

**Endpoint**: `GET /alerts/detailed`

**Autenticación**: Requerida

**Parámetros de Query**:
| Parámetro | Tipo | Requerido | Descripción |
|-----------|------|----------|-------------|
| status | string | No | Filtrar por estado (default: 'active') |

**Respuesta**:
```json
[
  {
    "id": 1,
    "severity": "critical",
    "message": "Dispositivo sin comunicación desde hace 2 horas",
    "alert_type": "connection_lost",
    "status": "active",
    "created_at": "2024-12-09T08:30:00Z",
    "devices": {
      "name": "AirQ-LAB-01",
      "mac_address": "00:1B:44:11:3A:D0",
      "status": "maintenance",
      "device_types": {
        "name": "Air Quality Sensor"
      },
      "iot_projects": {
        "name": "Calidad Aire Oficinas",
        "description": "Sensores de calidad de aire en espacios de trabajo"
      },
      "locations": {
        "name": "Laboratorio Central",
        "address": "Av. Investigación 890",
        "city": "Valencia"
      }
    },
    "users": null
  }
]
```

---

### Actualizar Alerta

Actualiza el estado de una alerta.

**Endpoint**: `PUT /alerts/:id`

**Autenticación**: Requerida

**Parámetros de Ruta**:
| Parámetro | Tipo | Requerido | Descripción |
|-----------|------|----------|-------------|
| id | number | Sí | ID de la alerta |

**Cuerpo de la Petición**:
```json
{
  "status": "resolved"
}
```

**Respuesta**:
```json
{
  "id": 1,
  "status": "resolved",
  "resolved_at": "2024-12-09T10:45:00Z",
  "resolved_by": 1
}
```

---

## Gestión de Mantenimiento

### Listar Registros de Mantenimiento

Retorna registros de mantenimiento con información de dispositivo y técnico.

**Endpoint**: `GET /maintenance`

**Autenticación**: Requerida

**Parámetros de Query**:
| Parámetro | Tipo | Requerido | Descripción |
|-----------|------|----------|-------------|
| status | string | No | Filtrar por estado |
| maintenance_type | string | No | Filtrar por tipo |
| device_id | number | No | Filtrar por ID de dispositivo |
| technician_id | number | No | Filtrar por ID de técnico |

**Respuesta**:
```json
[
  {
    "id": 1,
    "maintenance_type": "preventive",
    "description": "Calibración trimestral de sensores y actualización de firmware",
    "status": "completed",
    "scheduled_date": "2024-12-04T08:00:00Z",
    "completed_date": "2024-12-04T10:00:00Z",
    "cost": 150.00,
    "parts_replaced": [],
    "notes": null,
    "devices": {
      "name": "TempCtrl-DC-01"
    },
    "users": {
      "name": "Luis García",
      "role": "technician"
    }
  }
]
```

---

## Análisis de Proyectos

### Listar Proyectos

Retorna todos los proyectos IoT.

**Endpoint**: `GET /projects`

**Autenticación**: Requerida

**Respuesta**:
```json
[
  {
    "id": 1,
    "name": "Monitoreo Climatización",
    "description": "Sistema de monitoreo de temperatura y humedad en data centers",
    "status": "active",
    "start_date": "2024-01-15",
    "budget": 50000.00
  }
]
```

---

### Obtener Resumen de Proyectos

Retorna resumen detallado de proyectos con estadísticas agregadas.

**Endpoint**: `GET /projects/summary`

**Autenticación**: Requerida

**Respuesta**:
```json
[
  {
    "id": 1,
    "name": "Monitoreo Climatización",
    "description": "Sistema de monitoreo de temperatura y humedad en data centers",
    "status": "active",
    "budget": 50000.00,
    "start_date": "2024-01-15",
    "devices": [
      {
        "id": 1,
        "name": "Gateway-DC-01",
        "status": "online",
        "device_types": {
          "name": "Sensor Gateway IoT"
        },
        "sensors": [...]
      }
    ],
    "stats": {
      "totalDevices": 3,
      "totalSensors": 4,
      "onlineDevices": 3,
      "offlineDevices": 0,
      "activeAlerts": 1,
      "maintenanceRecords": 2,
      "deviceTypes": ["Sensor Gateway IoT", "Smart Temperature Controller"]
    }
  }
]
```

**Consulta SQL Implementada**:
```sql
SELECT 
  p.*,
  COUNT(DISTINCT d.id) as total_devices,
  COUNT(DISTINCT s.id) as total_sensors,
  COUNT(DISTINCT CASE WHEN d.status = 'online' THEN d.id END) as online_devices
FROM iot_projects p
LEFT JOIN devices d ON p.id = d.project_id
LEFT JOIN sensors s ON d.id = s.device_id
GROUP BY p.id;
```

---

## Estadísticas por Ubicación

### Obtener Estadísticas de Ubicaciones

Retorna estadísticas basadas en ubicación con conteo de dispositivos y alertas.

**Endpoint**: `GET /locations/stats`

**Autenticación**: Requerida

**Respuesta**:
```json
[
  {
    "id": 1,
    "name": "Data Center Norte",
    "address": "Av. Tecnológica 1234",
    "city": "Madrid",
    "country": "España",
    "devices": [
      {
        "id": 1,
        "name": "Gateway-DC-01",
        "status": "online",
        "device_types": {
          "name": "Sensor Gateway IoT"
        },
        "iot_projects": {
          "name": "Monitoreo Climatización"
        }
      }
    ],
    "stats": {
      "totalDevices": 4,
      "onlineDevices": 4,
      "offlineDevices": 0,
      "maintenanceDevices": 0,
      "errorDevices": 0,
      "activeAlerts": 2,
      "projects": ["Monitoreo Climatización", "Gestión Energética"]
    }
  }
]
```

---

## Rendimiento de Técnicos

### Obtener Rendimiento de Técnicos

Retorna métricas de rendimiento para técnicos.

**Endpoint**: `GET /technicians/performance`

**Autenticación**: Requerida

**Respuesta**:
```json
[
  {
    "id": 3,
    "name": "Luis García",
    "email": "luis.garcia@iot.com",
    "role": "technician",
    "stats": {
      "totalTasks": 5,
      "completedTasks": 4,
      "inProgressTasks": 1,
      "scheduledTasks": 0,
      "totalCost": "1100.00",
      "avgResolutionTimeHours": "2.75",
      "maintenanceByType": {
        "preventive": 2,
        "corrective": 2,
        "emergency": 1,
        "upgrade": 0
      }
    },
    "recentTasks": [...]
  }
]
```

**Consulta SQL Implementada**:
```sql
SELECT 
  u.*,
  COUNT(m.id) as total_tasks,
  COUNT(CASE WHEN m.status = 'completed' THEN 1 END) as completed,
  SUM(m.cost) as total_cost,
  AVG(EXTRACT(EPOCH FROM (m.completed_date - m.created_at))/3600) as avg_hours
FROM users u
LEFT JOIN maintenance_logs m ON u.id = m.technician_id
WHERE u.role IN ('technician', 'engineer')
GROUP BY u.id;
```

---

## Análisis de Firmware

### Obtener Versiones de Firmware con Dispositivos

Retorna versiones de firmware y dispositivos que las utilizan.

**Endpoint**: `GET /firmware/devices`

**Autenticación**: Requerida

**Respuesta**:
```json
[
  {
    "id": 1,
    "version": "2.1.0",
    "release_date": "2024-10-15",
    "release_notes": "Mejoras de estabilidad y soporte MQTT 5.0",
    "is_stable": true,
    "device_types": {
      "id": 1,
      "name": "Sensor Gateway IoT",
      "manufacturer": "TechIoT Inc"
    },
    "devicesCount": 1,
    "onlineDevices": 1,
    "devices": [
      {
        "id": 1,
        "name": "Gateway-DC-01",
        "status": "online",
        "firmware_version": "2.1.0",
        "iot_projects": {
          "name": "Monitoreo Climatización"
        },
        "locations": {
          "name": "Data Center Norte",
          "city": "Madrid"
        }
      }
    ]
  }
]
```

---

## Operaciones de Creación

### Crear Proyecto

Crea un nuevo proyecto IoT.

**Endpoint**: `POST /projects`

**Autenticación**: Requerida

**Cuerpo de la Petición**:
```json
{
  "name": "Monitoreo Climatización",
  "description": "Sistema de monitoreo de temperatura y humedad en data centers",
  "status": "active",
  "start_date": "2024-01-15",
  "budget": 50000.00
}
```

**Respuesta**:
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Monitoreo Climatización",
    "description": "Sistema de monitoreo de temperatura y humedad en data centers",
    "status": "active",
    "start_date": "2024-01-15",
    "budget": 50000.00
  },
  "message": "Proyecto creado exitosamente"
}
```

---

### Crear Dispositivo

Crea un nuevo dispositivo IoT.

**Endpoint**: `POST /devices`

**Autenticación**: Requerida

**Cuerpo de la Petición**:
```json
{
  "name": "Gateway-DC-01",
  "mac_address": "00:1B:44:11:3A:B7",
  "ip_address": "192.168.1.101",
  "status": "online",
  "firmware_version": "2.1.0",
  "last_seen": "2024-12-09T10:30:00Z",
  "created_at": "2024-01-15T08:00:00Z",
  "device_type_id": 1,
  "project_id": 1,
  "location_id": 1
}
```

**Respuesta**:
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Gateway-DC-01",
    "mac_address": "00:1B:44:11:3A:B7",
    "ip_address": "192.168.1.101",
    "status": "online",
    "firmware_version": "2.1.0",
    "last_seen": "2024-12-09T10:30:00Z",
    "created_at": "2024-01-15T08:00:00Z",
    "device_type_id": 1,
    "project_id": 1,
    "location_id": 1
  },
  "message": "Dispositivo creado exitosamente"
}
```

---

### Crear Sensor

Crea un nuevo sensor.

**Endpoint**: `POST /sensors`

**Autenticación**: Requerida

**Cuerpo de la Petición**:
```json
{
  "name": "Temperatura Ambiente",
  "sensor_type": "temperature",
  "unit": "°C",
  "min_value": -10,
  "max_value": 50,
  "is_active": true,
  "calibration_date": "2024-10-01",
  "device_id": 1
}
```

**Respuesta**:
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Temperatura Ambiente",
    "sensor_type": "temperature",
    "unit": "°C",
    "min_value": -10,
    "max_value": 50,
    "is_active": true,
    "calibration_date": "2024-10-01",
    "device_id": 1
  },
  "message": "Sensor creado exitosamente"
}
```

---

### Crear Lectura de Sensor

Crea una nueva lectura de sensor.

**Endpoint**: `POST /readings`

**Autenticación**: Requerida

**Cuerpo de la Petición**:
```json
{
  "value": 23.5,
  "timestamp": "2024-12-09T10:30:00Z",
  "quality_score": 0.98,
  "metadata": {},
  "sensor_id": 1
}
```

**Respuesta**:
```json
{
  "success": true,
  "data": {
    "id": 1,
    "value": 23.5,
    "timestamp": "2024-12-09T10:30:00Z",
    "quality_score": 0.98,
    "metadata": {},
    "sensor_id": 1
  },
  "message": "Lectura de sensor creada exitosamente"
}
```

---

### Crear Alerta

Crea una nueva alerta.

**Endpoint**: `POST /alerts`

**Autenticación**: Requerida

**Cuerpo de la Petición**:
```json
{
  "severity": "high",
  "message": "Temperatura por encima del umbral recomendado (26.5°C)",
  "alert_type": "threshold_exceeded",
  "status": "active",
  "created_at": "2024-12-09T07:30:00Z",
  "resolved_at": null,
  "resolved_by": null,
  "device_id": 1
}
```

**Respuesta**:
```json
{
  "success": true,
  "data": {
    "id": 1,
    "severity": "high",
    "message": "Temperatura por encima del umbral recomendado (26.5°C)",
    "alert_type": "threshold_exceeded",
    "status": "active",
    "created_at": "2024-12-09T07:30:00Z",
    "resolved_at": null,
    "resolved_by": null,
    "device_id": 1
  },
  "message": "Alerta creada exitosamente"
}
```

---

### Crear Registro de Mantenimiento

Crea un nuevo registro de mantenimiento.

**Endpoint**: `POST /maintenance`

**Autenticación**: Requerida

**Cuerpo de la Petición**:
```json
{
  "maintenance_type": "preventive",
  "description": "Calibración trimestral de sensores y actualización de firmware",
  "status": "completed",
  "scheduled_date": "2024-12-04T08:00:00Z",
  "completed_date": "2024-12-04T10:00:00Z",
  "cost": 150.00,
  "parts_replaced": [],
  "notes": null,
  "device_id": 1,
  "technician_id": 1
}
```

**Respuesta**:
```json
{
  "success": true,
  "data": {
    "id": 1,
    "maintenance_type": "preventive",
    "description": "Calibración trimestral de sensores y actualización de firmware",
    "status": "completed",
    "scheduled_date": "2024-12-04T08:00:00Z",
    "completed_date": "2024-12-04T10:00:00Z",
    "cost": 150.00,
    "parts_replaced": [],
    "notes": null,
    "device_id": 1,
    "technician_id": 1
  },
  "message": "Registro de mantenimiento creado exitosamente"
}
```

---

### Crear Usuario

Crea un nuevo usuario.

**Endpoint**: `POST /users`

**Autenticación**: Requerida

**Cuerpo de la Petición**:
```json
{
  "name": "Luis García",
  "email": "luis.garcia@iot.com",
  "role": "technician"
}
```

**Respuesta**:
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Luis García",
    "email": "luis.garcia@iot.com",
    "role": "technician"
  },
  "message": "Usuario creado exitosamente"
}
```

---

### Crear Tipo de Dispositivo

Crea un nuevo tipo de dispositivo.

**Endpoint**: `POST /device_types`

**Autenticación**: Requerida

**Cuerpo de la Petición**:
```json
{
  "name": "Sensor Gateway IoT",
  "manufacturer": "TechIoT Inc"
}
```

**Respuesta**:
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Sensor Gateway IoT",
    "manufacturer": "TechIoT Inc"
  },
  "message": "Tipo de dispositivo creado exitosamente"
}
```

---

### Crear Ubicación

Crea una nueva ubicación.

**Endpoint**: `POST /locations`

**Autenticación**: Requerida

**Cuerpo de la Petición**:
```json
{
  "name": "Data Center Norte",
  "address": "Av. Tecnológica 1234",
  "city": "Madrid",
  "country": "España"
}
```

**Respuesta**:
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Data Center Norte",
    "address": "Av. Tecnológica 1234",
    "city": "Madrid",
    "country": "España"
  },
  "message": "Ubicación creada exitosamente"
}
```

---

## Manejo de Errores

### Respuestas de Error Comunes

**401 Unauthorized**:
```json
{
  "error": "Unauthorized - Token de autenticación inválido o faltante"
}
```

**404 Not Found**:
```json
{
  "error": "Recurso no encontrado con id: 999"
}
```

**500 Internal Server Error**:
```json
{
  "error": "Error interno del servidor: Fallo en conexión a base de datos"
}
```

## Versionamiento

Versión actual: 1.0. Futuras versiones de la API se indicarán en la URL:
```
/v2/make-server-5aa00d2c/...
```

## Conclusión

Esta API proporciona acceso completo a todas las funcionalidades del sistema de gestión IoT, implementando principios RESTful y proporcionando respuestas consistentes y bien estructuradas.

---

**Última Actualización**: Diciembre 2024  
**Versión de API**: 1.0.0