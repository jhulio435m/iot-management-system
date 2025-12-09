-- ========================================
-- VERIFICACIÓN DE INTEGRIDAD REFERENCIAL
-- ========================================
-- Este script verifica que todas las foreign keys sean válidas
-- y que los datos estén distribuidos correctamente

-- 1. CONTEO GENERAL DE REGISTROS
-- ========================================
SELECT 
    '=== CONTEO DE REGISTROS ===' as verificacion,
    '' as tabla,
    '' as registros,
    '' as estado;

SELECT 
    'Tabla' as verificacion,
    tabla,
    registros::TEXT,
    CASE 
        WHEN registros = 0 THEN '❌ VACÍA'
        WHEN registros < 10 THEN '⚠️ POCOS DATOS'
        ELSE '✅ OK'
    END as estado
FROM (
    SELECT 'users' as tabla, COUNT(*) as registros FROM users
    UNION ALL SELECT 'locations', COUNT(*) FROM locations
    UNION ALL SELECT 'device_types', COUNT(*) FROM device_types
    UNION ALL SELECT 'iot_projects', COUNT(*) FROM iot_projects
    UNION ALL SELECT 'firmware_versions', COUNT(*) FROM firmware_versions
    UNION ALL SELECT 'devices', COUNT(*) FROM devices
    UNION ALL SELECT 'sensors', COUNT(*) FROM sensors
    UNION ALL SELECT 'sensor_readings', COUNT(*) FROM sensor_readings
    UNION ALL SELECT 'alerts', COUNT(*) FROM alerts
    UNION ALL SELECT 'maintenance_logs', COUNT(*) FROM maintenance_logs
) t
ORDER BY tabla;

-- 2. VERIFICAR FOREIGN KEYS INVÁLIDAS
-- ========================================
SELECT '' as verificacion, '=== VERIFICACIÓN DE FOREIGN KEYS ===' as resultado;

-- 2.1 Devices con foreign keys inválidas
SELECT 
    'devices -> projects' as verificacion,
    CASE 
        WHEN COUNT(*) = 0 THEN '✅ Todas las referencias son válidas'
        ELSE '❌ HAY ' || COUNT(*) || ' DEVICES CON PROJECT_ID INVÁLIDO'
    END as resultado
FROM devices d
LEFT JOIN iot_projects p ON d.project_id = p.id
WHERE p.id IS NULL;

SELECT 
    'devices -> device_types' as verificacion,
    CASE 
        WHEN COUNT(*) = 0 THEN '✅ Todas las referencias son válidas'
        ELSE '❌ HAY ' || COUNT(*) || ' DEVICES CON DEVICE_TYPE_ID INVÁLIDO'
    END as resultado
FROM devices d
LEFT JOIN device_types dt ON d.device_type_id = dt.id
WHERE dt.id IS NULL;

SELECT 
    'devices -> locations' as verificacion,
    CASE 
        WHEN COUNT(*) = 0 THEN '✅ Todas las referencias son válidas'
        ELSE '❌ HAY ' || COUNT(*) || ' DEVICES CON LOCATION_ID INVÁLIDO'
    END as resultado
FROM devices d
LEFT JOIN locations l ON d.location_id = l.id
WHERE l.id IS NULL;

-- 2.2 Sensors con foreign keys inválidas
SELECT 
    'sensors -> devices' as verificacion,
    CASE 
        WHEN COUNT(*) = 0 THEN '✅ Todas las referencias son válidas'
        ELSE '❌ HAY ' || COUNT(*) || ' SENSORS CON DEVICE_ID INVÁLIDO'
    END as resultado
FROM sensors s
LEFT JOIN devices d ON s.device_id = d.id
WHERE d.id IS NULL;

-- 2.3 Sensor Readings con foreign keys inválidas
SELECT 
    'sensor_readings -> sensors' as verificacion,
    CASE 
        WHEN COUNT(*) = 0 THEN '✅ Todas las referencias son válidas'
        ELSE '❌ HAY ' || COUNT(*) || ' LECTURAS CON SENSOR_ID INVÁLIDO'
    END as resultado
FROM sensor_readings sr
LEFT JOIN sensors s ON sr.sensor_id = s.id
WHERE s.id IS NULL;

-- 2.4 Alerts con foreign keys inválidas
SELECT 
    'alerts -> devices' as verificacion,
    CASE 
        WHEN COUNT(*) = 0 THEN '✅ Todas las referencias son válidas'
        ELSE '❌ HAY ' || COUNT(*) || ' ALERTAS CON DEVICE_ID INVÁLIDO'
    END as resultado
FROM alerts a
LEFT JOIN devices d ON a.device_id = d.id
WHERE d.id IS NULL;

SELECT 
    'alerts -> users (resolved)' as verificacion,
    CASE 
        WHEN COUNT(*) = 0 THEN '✅ Todas las referencias son válidas'
        ELSE '❌ HAY ' || COUNT(*) || ' ALERTAS CON RESOLVED_BY INVÁLIDO'
    END as resultado
FROM alerts a
LEFT JOIN users u ON a.resolved_by = u.id
WHERE a.resolved_by IS NOT NULL AND u.id IS NULL;

-- 2.5 Maintenance Logs con foreign keys inválidas
SELECT 
    'maintenance_logs -> devices' as verificacion,
    CASE 
        WHEN COUNT(*) = 0 THEN '✅ Todas las referencias son válidas'
        ELSE '❌ HAY ' || COUNT(*) || ' MANTENIMIENTOS CON DEVICE_ID INVÁLIDO'
    END as resultado
FROM maintenance_logs ml
LEFT JOIN devices d ON ml.device_id = d.id
WHERE d.id IS NULL;

SELECT 
    'maintenance_logs -> users' as verificacion,
    CASE 
        WHEN COUNT(*) = 0 THEN '✅ Todas las referencias son válidas'
        ELSE '❌ HAY ' || COUNT(*) || ' MANTENIMIENTOS CON TECHNICIAN_ID INVÁLIDO'
    END as resultado
FROM maintenance_logs ml
LEFT JOIN users u ON ml.technician_id = u.id
WHERE u.id IS NULL;

-- 2.6 Firmware Versions con foreign keys inválidas
SELECT 
    'firmware_versions -> device_types' as verificacion,
    CASE 
        WHEN COUNT(*) = 0 THEN '✅ Todas las referencias son válidas'
        ELSE '❌ HAY ' || COUNT(*) || ' FIRMWARES CON DEVICE_TYPE_ID INVÁLIDO'
    END as resultado
FROM firmware_versions fv
LEFT JOIN device_types dt ON fv.device_type_id = dt.id
WHERE dt.id IS NULL;

-- 3. DISTRIBUCIÓN DE DATOS
-- ========================================
SELECT '' as verificacion, '=== DISTRIBUCIÓN DE DATOS ===' as resultado;

-- 3.1 Proyectos sin dispositivos
SELECT 
    'Proyectos sin dispositivos' as verificacion,
    CASE 
        WHEN COUNT(*) = 0 THEN '✅ Todos los proyectos tienen dispositivos'
        ELSE '⚠️ HAY ' || COUNT(*) || ' PROYECTOS SIN DISPOSITIVOS'
    END as resultado
FROM iot_projects p
LEFT JOIN devices d ON p.id = d.project_id
WHERE d.id IS NULL;

-- 3.2 Dispositivos sin sensores
SELECT 
    'Dispositivos sin sensores' as verificacion,
    CASE 
        WHEN COUNT(*) = 0 THEN '✅ Todos los dispositivos tienen sensores'
        ELSE '⚠️ HAY ' || COUNT(*) || ' DISPOSITIVOS SIN SENSORES'
    END as resultado
FROM devices d
LEFT JOIN sensors s ON d.id = s.device_id
WHERE s.id IS NULL;

-- 3.3 Sensores sin lecturas
SELECT 
    'Sensores activos sin lecturas' as verificacion,
    CASE 
        WHEN COUNT(*) = 0 THEN '✅ Todos los sensores activos tienen lecturas'
        ELSE '⚠️ HAY ' || COUNT(*) || ' SENSORES ACTIVOS SIN LECTURAS'
    END as resultado
FROM sensors s
LEFT JOIN sensor_readings sr ON s.id = sr.sensor_id
WHERE s.is_active = true AND sr.id IS NULL;

-- 3.4 Ubicaciones sin dispositivos
SELECT 
    'Ubicaciones sin dispositivos' as verificacion,
    CASE 
        WHEN COUNT(*) = 0 THEN '✅ Todas las ubicaciones tienen dispositivos'
        ELSE '⚠️ HAY ' || COUNT(*) || ' UBICACIONES SIN DISPOSITIVOS'
    END as resultado
FROM locations l
LEFT JOIN devices d ON l.id = d.location_id
WHERE d.id IS NULL;

-- 4. ESTADÍSTICAS DE DISTRIBUCIÓN
-- ========================================
SELECT '' as verificacion, '=== ESTADÍSTICAS DE DISTRIBUCIÓN ===' as resultado;

SELECT 
    'Promedio de sensores por dispositivo' as metrica,
    ROUND(AVG(sensor_count)::NUMERIC, 2)::TEXT as valor
FROM (
    SELECT d.id, COUNT(s.id) as sensor_count
    FROM devices d
    LEFT JOIN sensors s ON d.id = s.device_id
    GROUP BY d.id
) t;

SELECT 
    'Promedio de lecturas por sensor' as metrica,
    ROUND(AVG(reading_count)::NUMERIC, 2)::TEXT as valor
FROM (
    SELECT s.id, COUNT(sr.id) as reading_count
    FROM sensors s
    LEFT JOIN sensor_readings sr ON s.id = sr.sensor_id
    WHERE s.is_active = true
    GROUP BY s.id
) t;

SELECT 
    'Promedio de alertas por dispositivo' as metrica,
    ROUND(AVG(alert_count)::NUMERIC, 2)::TEXT as valor
FROM (
    SELECT d.id, COUNT(a.id) as alert_count
    FROM devices d
    LEFT JOIN alerts a ON d.id = a.device_id
    GROUP BY d.id
) t;

-- 5. RESUMEN FINAL
-- ========================================
SELECT '' as verificacion, '=== RESUMEN FINAL ===' as resultado;

SELECT 
    'ESTADO GENERAL' as verificacion,
    CASE 
        WHEN (SELECT COUNT(*) FROM devices) >= 100 
         AND (SELECT COUNT(*) FROM sensors) >= 300 
         AND (SELECT COUNT(*) FROM sensor_readings) >= 1000
        THEN '✅ BASE DE DATOS CON DATOS SUFICIENTES PARA TESTING'
        WHEN (SELECT COUNT(*) FROM devices) >= 20 
         AND (SELECT COUNT(*) FROM sensors) >= 50
        THEN '⚠️ DATOS BASE PRESENTES, PERO POCOS DATOS MASIVOS'
        ELSE '❌ DATOS INSUFICIENTES - EJECUTAR SCRIPTS EN ORDEN'
    END as resultado;
