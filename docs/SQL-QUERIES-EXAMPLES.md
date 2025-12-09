# Ejemplos de Consultas SQL para Práctica

Esta guía contiene **45+ ejemplos de consultas SQL** organizadas por nivel de dificultad, perfectas para práctica de bases de datos y preparación de exámenes.

---

## NIVEL BÁSICO - Consultas SELECT Simples

### 1. Seleccionar todos los dispositivos
```sql
SELECT * FROM devices;
```

### 2. Listar solo dispositivos en línea
```sql
SELECT name, mac_address, status 
FROM devices 
WHERE status = 'online';
```

### 3. Contar total de sensores
```sql
SELECT COUNT(*) AS total_sensores 
FROM sensors;
```

### 4. Dispositivos ordenados por fecha de creación
```sql
SELECT name, created_at 
FROM devices 
ORDER BY created_at DESC;
```

### 5. Proyectos con presupuesto mayor a $40,000
```sql
SELECT name, budget, status 
FROM iot_projects 
WHERE budget > 40000;
```

---

## NIVEL INTERMEDIO - JOINs y Relaciones

### 6. Dispositivos con su tipo (INNER JOIN)
```sql
SELECT 
    d.name AS dispositivo,
    dt.name AS tipo_dispositivo,
    dt.manufacturer AS fabricante
FROM devices d
INNER JOIN device_types dt ON d.device_type_id = dt.id;
```

### 7. Dispositivos con ubicación (LEFT JOIN)
```sql
SELECT 
    d.name AS dispositivo,
    d.status,
    l.name AS ubicacion,
    l.city AS ciudad
FROM devices d
LEFT JOIN locations l ON d.location_id = l.id
ORDER BY l.city;
```

### 8. Sensores con información del dispositivo
```sql
SELECT 
    s.name AS sensor,
    s.unit AS unidad,
    d.name AS dispositivo,
    d.status AS estado_dispositivo
FROM sensors s
INNER JOIN devices d ON s.device_id = d.id
WHERE s.is_active = true;
```

### 9. Alertas con detalles de dispositivo y proyecto
```sql
SELECT 
    a.message AS alerta,
    a.severity AS severidad,
    a.status AS estado,
    d.name AS dispositivo,
    p.name AS proyecto
FROM alerts a
INNER JOIN devices d ON a.device_id = d.id
INNER JOIN iot_projects p ON d.project_id = p.id
WHERE a.status = 'active'
ORDER BY a.severity DESC;
```

### 10. Mantenimiento con técnico y dispositivo (3 tablas)
```sql
SELECT 
    m.description AS trabajo,
    m.maintenance_type AS tipo,
    m.cost AS costo,
    d.name AS dispositivo,
    u.name AS tecnico
FROM maintenance_logs m
INNER JOIN devices d ON m.device_id = d.id
INNER JOIN users u ON m.technician_id = u.id
ORDER BY m.created_at DESC;
```

---

## NIVEL AVANZADO - Agregaciones y GROUP BY

### 11. Contar dispositivos por estado
```sql
SELECT 
    status AS estado,
    COUNT(*) AS cantidad
FROM devices
GROUP BY status
ORDER BY cantidad DESC;
```

### 12. Total de dispositivos por ubicación
```sql
SELECT 
    l.name AS ubicacion,
    l.city AS ciudad,
    COUNT(d.id) AS total_dispositivos
FROM locations l
LEFT JOIN devices d ON l.id = d.location_id
GROUP BY l.id, l.name, l.city
ORDER BY total_dispositivos DESC;
```

### 13. Costo total de mantenimiento por tipo
```sql
SELECT 
    maintenance_type AS tipo_mantenimiento,
    COUNT(*) AS total_tareas,
    SUM(cost) AS costo_total,
    AVG(cost) AS costo_promedio
FROM maintenance_logs
WHERE cost IS NOT NULL
GROUP BY maintenance_type
ORDER BY costo_total DESC;
```

### 14. Alertas por severidad y estado
```sql
SELECT 
    severity AS severidad,
    status AS estado,
    COUNT(*) AS cantidad
FROM alerts
GROUP BY severity, status
ORDER BY severity DESC, cantidad DESC;
```

### 15. Sensores por tipo con estadísticas
```sql
SELECT 
    sensor_type AS tipo_sensor,
    COUNT(*) AS cantidad,
    COUNT(CASE WHEN is_active THEN 1 END) AS activos,
    COUNT(CASE WHEN NOT is_active THEN 1 END) AS inactivos
FROM sensors
GROUP BY sensor_type
ORDER BY cantidad DESC;
```

---

## NIVEL EXPERTO - Subconsultas y HAVING

### 16. Proyectos con más de 2 dispositivos
```sql
SELECT 
    p.name AS proyecto,
    COUNT(d.id) AS total_dispositivos
FROM iot_projects p
LEFT JOIN devices d ON p.id = d.project_id
GROUP BY p.id, p.name
HAVING COUNT(d.id) > 2
ORDER BY total_dispositivos DESC;
```

### 17. Dispositivos con alertas activas (subconsulta)
```sql
SELECT 
    d.name AS dispositivo,
    d.status,
    (SELECT COUNT(*) 
     FROM alerts a 
     WHERE a.device_id = d.id AND a.status = 'active') AS alertas_activas
FROM devices d
WHERE EXISTS (
    SELECT 1 
    FROM alerts a 
    WHERE a.device_id = d.id AND a.status = 'active'
);
```

### 18. Técnicos con más de 2 tareas completadas
```sql
SELECT 
    u.name AS tecnico,
    u.role AS rol,
    COUNT(m.id) AS tareas_completadas,
    SUM(m.cost) AS costo_total
FROM users u
INNER JOIN maintenance_logs m ON u.id = m.technician_id
WHERE m.status = 'completed'
GROUP BY u.id, u.name, u.role
HAVING COUNT(m.id) > 2
ORDER BY tareas_completadas DESC;
```

### 19. Promedio de lecturas por sensor con más de 10 registros
```sql
SELECT 
    s.name AS sensor,
    s.unit AS unidad,
    COUNT(sr.id) AS total_lecturas,
    ROUND(AVG(sr.value)::numeric, 2) AS valor_promedio,
    ROUND(MIN(sr.value)::numeric, 2) AS valor_minimo,
    ROUND(MAX(sr.value)::numeric, 2) AS valor_maximo
FROM sensors s
INNER JOIN sensor_readings sr ON s.id = sr.sensor_id
GROUP BY s.id, s.name, s.unit
HAVING COUNT(sr.id) > 10
ORDER BY total_lecturas DESC;
```

### 20. Ubicaciones con más alertas activas
```sql
SELECT 
    l.name AS ubicacion,
    l.city AS ciudad,
    COUNT(DISTINCT d.id) AS dispositivos,
    COUNT(a.id) AS alertas_activas
FROM locations l
INNER JOIN devices d ON l.id = d.location_id
INNER JOIN alerts a ON d.id = a.device_id
WHERE a.status = 'active'
GROUP BY l.id, l.name, l.city
HAVING COUNT(a.id) > 0
ORDER BY alertas_activas DESC;
```

---

## NIVEL MAESTRO - JOINs Complejos y Análisis Avanzado

### 21. Análisis completo de proyecto (JOIN de 5 tablas)
```sql
SELECT 
    p.name AS proyecto,
    p.budget AS presupuesto,
    d.name AS dispositivo,
    dt.name AS tipo_dispositivo,
    l.city AS ciudad,
    COUNT(DISTINCT s.id) AS total_sensores,
    COUNT(DISTINCT a.id) AS alertas_activas
FROM iot_projects p
INNER JOIN devices d ON p.id = d.project_id
INNER JOIN device_types dt ON d.device_type_id = dt.id
LEFT JOIN locations l ON d.location_id = l.id
LEFT JOIN sensors s ON d.id = s.device_id
LEFT JOIN alerts a ON d.id = a.device_id AND a.status = 'active'
GROUP BY p.id, p.name, p.budget, d.id, d.name, dt.name, l.city
ORDER BY p.name, d.name;
```

### 22. Rendimiento de técnicos con tiempo promedio
```sql
SELECT 
    u.name AS tecnico,
    COUNT(*) AS total_tareas,
    COUNT(CASE WHEN m.status = 'completed' THEN 1 END) AS completadas,
    COUNT(CASE WHEN m.status = 'in_progress' THEN 1 END) AS en_progreso,
    SUM(m.cost) AS costo_total,
    ROUND(AVG(
        EXTRACT(EPOCH FROM (m.completed_date - m.created_at)) / 3600
    )::numeric, 2) AS horas_promedio
FROM users u
INNER JOIN maintenance_logs m ON u.id = m.technician_id
WHERE u.role IN ('technician', 'engineer')
GROUP BY u.id, u.name
ORDER BY completadas DESC;
```

### 23. Dispositivos sin lecturas recientes (últimas 24 horas)
```sql
SELECT 
    d.name AS dispositivo,
    d.status,
    d.last_seen AS ultima_conexion,
    p.name AS proyecto,
    l.name AS ubicacion
FROM devices d
INNER JOIN iot_projects p ON d.project_id = p.id
LEFT JOIN locations l ON d.location_id = l.id
WHERE NOT EXISTS (
    SELECT 1
    FROM sensors s
    INNER JOIN sensor_readings sr ON s.id = sr.sensor_id
    WHERE s.device_id = d.id
    AND sr.timestamp >= NOW() - INTERVAL '24 hours'
)
ORDER BY d.last_seen DESC;
```

### 24. Comparación de firmware por tipo de dispositivo
```sql
SELECT 
    dt.name AS tipo_dispositivo,
    fv.version AS version_firmware,
    fv.is_stable AS estable,
    COUNT(d.id) AS dispositivos_usando,
    COUNT(CASE WHEN d.status = 'online' THEN 1 END) AS online,
    COUNT(CASE WHEN d.status = 'error' THEN 1 END) AS con_errores
FROM device_types dt
INNER JOIN firmware_versions fv ON dt.id = fv.device_type_id
LEFT JOIN devices d ON dt.id = d.device_type_id AND d.firmware_version = fv.version
GROUP BY dt.id, dt.name, fv.id, fv.version, fv.is_stable
ORDER BY dt.name, fv.version DESC;
```

### 25. Análisis de calidad de sensores
```sql
SELECT 
    s.name AS sensor,
    d.name AS dispositivo,
    COUNT(sr.id) AS lecturas_totales,
    ROUND(AVG(sr.quality_score)::numeric, 4) AS calidad_promedio,
    COUNT(CASE WHEN sr.quality_score < 0.9 THEN 1 END) AS lecturas_baja_calidad,
    ROUND((COUNT(CASE WHEN sr.quality_score < 0.9 THEN 1 END)::numeric / 
           COUNT(sr.id)::numeric * 100), 2) AS porcentaje_baja_calidad
FROM sensors s
INNER JOIN devices d ON s.device_id = d.id
LEFT JOIN sensor_readings sr ON s.id = sr.sensor_id
GROUP BY s.id, s.name, d.name
HAVING COUNT(sr.id) > 0
ORDER BY calidad_promedio ASC;
```

---

## CONSULTAS ESPECIALES - Funciones de Ventana y CTEs

### 26. Ranking de dispositivos por número de alertas (Función de Ventana)
```sql
SELECT 
    d.name AS dispositivo,
    p.name AS proyecto,
    COUNT(a.id) AS total_alertas,
    RANK() OVER (ORDER BY COUNT(a.id) DESC) AS ranking
FROM devices d
INNER JOIN iot_projects p ON d.project_id = p.id
LEFT JOIN alerts a ON d.id = a.device_id
GROUP BY d.id, d.name, p.name
ORDER BY ranking;
```

### 27. CTE (Common Table Expression) - Dispositivos problemáticos
```sql
WITH dispositivos_problematicos AS (
    SELECT 
        d.id,
        d.name,
        COUNT(a.id) AS alertas,
        COUNT(m.id) AS mantenimientos
    FROM devices d
    LEFT JOIN alerts a ON d.id = a.device_id AND a.status = 'active'
    LEFT JOIN maintenance_logs m ON d.id = m.device_id
    GROUP BY d.id, d.name
)
SELECT 
    dp.name AS dispositivo,
    dp.alertas AS alertas_activas,
    dp.mantenimientos AS total_mantenimientos,
    dt.name AS tipo,
    l.name AS ubicacion
FROM dispositivos_problematicos dp
INNER JOIN devices d ON dp.id = d.id
INNER JOIN device_types dt ON d.device_type_id = dt.id
LEFT JOIN locations l ON d.location_id = l.id
WHERE dp.alertas > 0 OR dp.mantenimientos > 2
ORDER BY dp.alertas DESC, dp.mantenimientos DESC;
```

### 28. Comparación con promedio (Función de Ventana)
```sql
SELECT 
    s.name AS sensor,
    ROUND(AVG(sr.value)::numeric, 2) AS valor_promedio_sensor,
    ROUND(AVG(AVG(sr.value)) OVER ()::numeric, 2) AS valor_promedio_global,
    ROUND((AVG(sr.value) - AVG(AVG(sr.value)) OVER ())::numeric, 2) AS diferencia
FROM sensors s
INNER JOIN sensor_readings sr ON s.id = sr.sensor_id
WHERE s.sensor_type = 'temperature'
GROUP BY s.id, s.name
ORDER BY valor_promedio_sensor DESC;
```

### 29. Lecturas con diferencia respecto a lectura anterior (LAG)
```sql
SELECT 
    s.name AS sensor,
    sr.value AS valor_actual,
    LAG(sr.value) OVER (PARTITION BY s.id ORDER BY sr.timestamp) AS valor_anterior,
    sr.value - LAG(sr.value) OVER (PARTITION BY s.id ORDER BY sr.timestamp) AS diferencia,
    sr.timestamp
FROM sensors s
INNER JOIN sensor_readings sr ON s.id = sr.sensor_id
WHERE s.name = 'Temperatura Ambiente'
ORDER BY sr.timestamp DESC
LIMIT 20;
```

### 30. Costos acumulados de mantenimiento por mes
```sql
SELECT 
    DATE_TRUNC('month', m.created_at) AS mes,
    m.maintenance_type AS tipo,
    SUM(m.cost) AS costo_mes,
    SUM(SUM(m.cost)) OVER (
        PARTITION BY m.maintenance_type 
        ORDER BY DATE_TRUNC('month', m.created_at)
    ) AS costo_acumulado
FROM maintenance_logs m
WHERE m.cost IS NOT NULL
GROUP BY DATE_TRUNC('month', m.created_at), m.maintenance_type
ORDER BY mes DESC, tipo;
```

---

## CONSULTAS DE ANÁLISIS DE NEGOCIO

### 31. Dashboard ejecutivo
```sql
SELECT 
    'Proyectos Activos' AS metrica,
    COUNT(*) AS valor
FROM iot_projects
WHERE status = 'active'
UNION ALL
SELECT 
    'Dispositivos Online',
    COUNT(*)
FROM devices
WHERE status = 'online'
UNION ALL
SELECT 
    'Alertas Críticas',
    COUNT(*)
FROM alerts
WHERE severity = 'critical' AND status = 'active'
UNION ALL
SELECT 
    'Mantenimientos Pendientes',
    COUNT(*)
FROM maintenance_logs
WHERE status IN ('scheduled', 'in_progress');
```

### 32. Costo total por proyecto
```sql
SELECT 
    p.name AS proyecto,
    p.budget AS presupuesto,
    COALESCE(SUM(m.cost), 0) AS costo_mantenimiento,
    p.budget - COALESCE(SUM(m.cost), 0) AS presupuesto_restante,
    ROUND((COALESCE(SUM(m.cost), 0) / p.budget * 100)::numeric, 2) AS porcentaje_gastado
FROM iot_projects p
LEFT JOIN devices d ON p.id = d.project_id
LEFT JOIN maintenance_logs m ON d.id = m.device_id AND m.status = 'completed'
GROUP BY p.id, p.name, p.budget
ORDER BY porcentaje_gastado DESC;
```

### 33. Tasa de fallas por tipo de dispositivo
```sql
SELECT 
    dt.name AS tipo_dispositivo,
    COUNT(DISTINCT d.id) AS total_dispositivos,
    COUNT(DISTINCT CASE WHEN d.status = 'error' THEN d.id END) AS dispositivos_error,
    COUNT(DISTINCT a.id) AS total_alertas,
    ROUND((COUNT(DISTINCT CASE WHEN d.status = 'error' THEN d.id END)::numeric / 
           NULLIF(COUNT(DISTINCT d.id), 0) * 100), 2) AS tasa_fallas_porcentaje
FROM device_types dt
LEFT JOIN devices d ON dt.id = d.device_type_id
LEFT JOIN alerts a ON d.id = a.device_id AND a.status = 'active'
GROUP BY dt.id, dt.name
ORDER BY tasa_fallas_porcentaje DESC;
```

### 34. Análisis temporal de alertas
```sql
SELECT 
    DATE_TRUNC('day', created_at) AS fecha,
    severity AS severidad,
    COUNT(*) AS cantidad_alertas
FROM alerts
WHERE created_at >= NOW() - INTERVAL '30 days'
GROUP BY DATE_TRUNC('day', created_at), severity
ORDER BY fecha DESC, cantidad_alertas DESC;
```

### 35. Eficiencia de mantenimiento preventivo vs correctivo
```sql
SELECT 
    maintenance_type AS tipo,
    COUNT(*) AS total_tareas,
    COUNT(CASE WHEN status = 'completed' THEN 1 END) AS completadas,
    ROUND(AVG(EXTRACT(EPOCH FROM (completed_date - scheduled_date)) / 3600)::numeric, 2) AS horas_demora_promedio,
    ROUND(AVG(cost)::numeric, 2) AS costo_promedio
FROM maintenance_logs
WHERE completed_date IS NOT NULL AND scheduled_date IS NOT NULL
GROUP BY maintenance_type
ORDER BY tipo;
```

---

## CONSULTAS PARA PRÁCTICA DE EXAMEN

### 36. UNION - Combinar tipos de eventos
```sql
SELECT 
    'Alerta' AS tipo_evento,
    created_at AS fecha,
    message AS descripcion,
    severity AS prioridad
FROM alerts
WHERE created_at >= NOW() - INTERVAL '7 days'
UNION ALL
SELECT 
    'Mantenimiento',
    created_at,
    description,
    maintenance_type
FROM maintenance_logs
WHERE created_at >= NOW() - INTERVAL '7 days'
ORDER BY fecha DESC;
```

### 37. CASE - Categorización de dispositivos
```sql
SELECT 
    d.name AS dispositivo,
    d.status,
    CASE 
        WHEN d.status = 'online' THEN 'Operativo'
        WHEN d.status = 'offline' THEN 'Fuera de Servicio'
        WHEN d.status = 'maintenance' THEN 'En Mantenimiento'
        WHEN d.status = 'error' THEN 'Requiere Atención'
        ELSE 'Desconocido'
    END AS categoria,
    CASE 
        WHEN d.last_seen >= NOW() - INTERVAL '1 hour' THEN 'Reciente'
        WHEN d.last_seen >= NOW() - INTERVAL '24 hours' THEN 'Normal'
        ELSE 'Atención Requerida'
    END AS estado_conexion
FROM devices d
ORDER BY d.status, d.last_seen DESC;
```

### 38. COALESCE y manejo de NULL
```sql
SELECT 
    u.name AS tecnico,
    COUNT(m.id) AS tareas_asignadas,
    COALESCE(SUM(m.cost), 0) AS costo_total,
    COALESCE(AVG(m.cost), 0) AS costo_promedio,
    COUNT(CASE WHEN m.notes IS NOT NULL THEN 1 END) AS tareas_con_notas
FROM users u
LEFT JOIN maintenance_logs m ON u.id = m.technician_id
WHERE u.role IN ('technician', 'engineer')
GROUP BY u.id, u.name
ORDER BY tareas_asignadas DESC;
```

### 39. Funciones DATE - Análisis de antigüedad
```sql
SELECT 
    d.name AS dispositivo,
    d.created_at AS fecha_instalacion,
    AGE(NOW(), d.created_at) AS antiguedad,
    DATE_PART('day', AGE(NOW(), d.created_at)) AS dias_activo,
    CASE 
        WHEN DATE_PART('day', AGE(NOW(), d.created_at)) < 30 THEN 'Nuevo'
        WHEN DATE_PART('day', AGE(NOW(), d.created_at)) < 180 THEN 'Reciente'
        ELSE 'Establecido'
    END AS clasificacion
FROM devices d
ORDER BY d.created_at DESC;
```

### 40. Funciones STRING - Búsqueda y formato
```sql
SELECT 
    UPPER(d.name) AS dispositivo_mayusculas,
    LOWER(d.mac_address) AS mac_minusculas,
    LENGTH(d.name) AS longitud_nombre,
    SUBSTRING(d.mac_address, 1, 8) AS mac_prefijo,
    CONCAT(d.name, ' - ', dt.name) AS nombre_completo,
    REPLACE(d.status, '_', ' ') AS estado_formateado
FROM devices d
INNER JOIN device_types dt ON d.device_type_id = dt.id
WHERE d.name LIKE '%DC%'
ORDER BY d.name;
```

---

## DESAFÍOS AVANZADOS

### 41. Encontrar dispositivos con todas sus métricas
```sql
SELECT 
    d.name AS dispositivo,
    p.name AS proyecto,
    l.city AS ciudad,
    COUNT(DISTINCT s.id) AS sensores,
    COUNT(DISTINCT sr.id) AS lecturas,
    COUNT(DISTINCT a.id) AS alertas,
    COUNT(DISTINCT m.id) AS mantenimientos,
    MAX(sr.timestamp) AS ultima_lectura
FROM devices d
INNER JOIN iot_projects p ON d.project_id = p.id
LEFT JOIN locations l ON d.location_id = l.id
LEFT JOIN sensors s ON d.id = s.device_id
LEFT JOIN sensor_readings sr ON s.id = sr.sensor_id
LEFT JOIN alerts a ON d.id = a.device_id
LEFT JOIN maintenance_logs m ON d.id = m.device_id
GROUP BY d.id, d.name, p.name, l.city
ORDER BY lecturas DESC;
```

### 42. Identificar patrones anómalos en lecturas
```sql
WITH estadisticas_sensor AS (
    SELECT 
        sensor_id,
        AVG(value) AS promedio,
        STDDEV(value) AS desviacion_estandar
    FROM sensor_readings
    GROUP BY sensor_id
)
SELECT 
    s.name AS sensor,
    sr.value AS valor,
    es.promedio,
    es.desviacion_estandar,
    sr.timestamp,
    CASE 
        WHEN ABS(sr.value - es.promedio) > (2 * es.desviacion_estandar) THEN 'ANOMALÍA'
        ELSE 'Normal'
    END AS estado
FROM sensor_readings sr
INNER JOIN sensors s ON sr.sensor_id = s.id
INNER JOIN estadisticas_sensor es ON sr.sensor_id = es.sensor_id
WHERE sr.timestamp >= NOW() - INTERVAL '24 hours'
    AND ABS(sr.value - es.promedio) > (2 * es.desviacion_estandar)
ORDER BY sr.timestamp DESC;
```

### 43. Análisis de correlación entre alertas y mantenimiento
```sql
SELECT 
    d.name AS dispositivo,
    COUNT(DISTINCT a.id) AS alertas_antes_mantenimiento,
    COUNT(DISTINCT m.id) AS mantenimientos_realizados,
    MAX(a.created_at) AS ultima_alerta,
    MAX(m.completed_date) AS ultimo_mantenimiento,
    CASE 
        WHEN MAX(m.completed_date) > MAX(a.created_at) THEN 'Mantenimiento Posterior'
        WHEN MAX(a.created_at) > MAX(m.completed_date) THEN 'Alerta Posterior'
        ELSE 'Sin Relación'
    END AS relacion_temporal
FROM devices d
LEFT JOIN alerts a ON d.id = a.device_id
LEFT JOIN maintenance_logs m ON d.id = m.device_id
WHERE a.created_at IS NOT NULL OR m.completed_date IS NOT NULL
GROUP BY d.id, d.name
HAVING COUNT(DISTINCT a.id) > 0 AND COUNT(DISTINCT m.id) > 0
ORDER BY alertas_antes_mantenimiento DESC;
```

### 44. Proyección de costos futuros basada en datos históricos
```sql
WITH costos_mensuales AS (
    SELECT 
        DATE_TRUNC('month', created_at) AS mes,
        SUM(cost) AS costo_mes
    FROM maintenance_logs
    WHERE cost IS NOT NULL
        AND created_at >= NOW() - INTERVAL '6 months'
    GROUP BY DATE_TRUNC('month', created_at)
)
SELECT 
    mes,
    costo_mes AS costo_real,
    AVG(costo_mes) OVER (ORDER BY mes ROWS BETWEEN 2 PRECEDING AND CURRENT ROW) AS promedio_movil_3_meses,
    AVG(costo_mes) OVER () AS promedio_general,
    costo_mes - AVG(costo_mes) OVER () AS diferencia_vs_promedio
FROM costos_mensuales
ORDER BY mes DESC;
```

### 45. Dispositivos que requieren calibración urgente
```sql
SELECT 
    s.name AS sensor,
    d.name AS dispositivo,
    s.calibration_date AS ultima_calibracion,
    AGE(NOW(), s.calibration_date) AS tiempo_desde_calibracion,
    CASE 
        WHEN AGE(NOW(), s.calibration_date) > INTERVAL '6 months' THEN 'URGENTE'
        WHEN AGE(NOW(), s.calibration_date) > INTERVAL '4 months' THEN 'Próximo'
        ELSE 'OK'
    END AS prioridad,
    l.name AS ubicacion,
    u.name AS tecnico_asignado
FROM sensors s
INNER JOIN devices d ON s.device_id = d.id
LEFT JOIN locations l ON d.location_id = l.id
LEFT JOIN maintenance_logs m ON d.id = m.device_id 
    AND m.status = 'scheduled'
    AND m.maintenance_type = 'preventive'
LEFT JOIN users u ON m.technician_id = u.id
WHERE AGE(NOW(), s.calibration_date) > INTERVAL '4 months'
ORDER BY AGE(NOW(), s.calibration_date) DESC;
```

---

## Notas Finales

### Tipos de Consultas Cubiertos:
- SELECT básico y WHERE
- JOIN (INNER, LEFT, RIGHT, FULL)
- Agregaciones (COUNT, SUM, AVG, MIN, MAX)
- GROUP BY y HAVING
- Subconsultas (correlacionadas y no correlacionadas)
- Funciones de Ventana (RANK, LAG, LEAD, OVER)
- CTEs (Common Table Expressions)
- UNION y UNION ALL
- CASE y expresiones condicionales
- Funciones de fecha y cadenas de texto
- Manejo de NULL (COALESCE, NULLIF)

### Recomendaciones para el Examen:
1. **Practicar escribir consultas de memoria** - No copiar y pegar
2. **Entender el modelo de datos** - Conocer las relaciones entre tablas
3. **Leer los requisitos cuidadosamente** - Asegurarse de entender lo que se pide
4. **Optimizar las consultas** - Usar EXPLAIN para ver el plan de ejecución
5. **Probar casos extremos** - Valores NULL, tablas vacías, etc.
6. **Usar alias descriptivos** - Hace el código más legible
7. **Formatear el código** - Indentación y capitalización consistentes

### Comandos Útiles:
```sql
-- Ver estructura de tabla
\d+ devices

-- Ver todas las tablas
\dt

-- Explicar plan de ejecución
EXPLAIN ANALYZE SELECT * FROM devices;

-- Ver índices
\di
```

---

**Última Actualización**: Enero 2025  
**Total de Consultas**: 45+  
**Curso**: Diseño de Base de Datos - FIS UNCP
