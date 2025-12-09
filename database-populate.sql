-- ========================================
-- SCRIPT DE POBLACIÓN DE DATOS MODERADO
-- ========================================
-- Datos balanceados con nombres realistas
-- Tiempo estimado: 30-45 segundos

-- PARTE 1: USUARIOS (20 adicionales con nombres reales)
-- ========================================
WITH nombres AS (
    SELECT unnest(ARRAY[
        'Carlos', 'María', 'Javier', 'Laura', 'Antonio',
        'Carmen', 'Miguel', 'Ana', 'Francisco', 'Isabel',
        'David', 'Lucía', 'José', 'Elena', 'Manuel',
        'Patricia', 'Alejandro', 'Cristina', 'Rafael', 'Beatriz'
    ]) as nombre, generate_series(1, 20) as i
),
apellidos AS (
    SELECT unnest(ARRAY[
        'García', 'Rodríguez', 'Martínez', 'López', 'Fernández',
        'González', 'Sánchez', 'Pérez', 'Martín', 'Gómez',
        'Ruiz', 'Díaz', 'Hernández', 'Jiménez', 'Álvarez',
        'Moreno', 'Muñoz', 'Alonso', 'Romero', 'Navarro'
    ]) as apellido, generate_series(1, 20) as i
)
INSERT INTO users (name, email, role)
SELECT 
    n.nombre || ' ' || a.apellido,
    lower(n.nombre) || '.' || lower(a.apellido) || '@iotcompany.es',
    CASE (n.i % 4)
        WHEN 0 THEN 'admin'
        WHEN 1 THEN 'engineer'
        WHEN 2 THEN 'technician'
        ELSE 'operator'
    END
FROM nombres n
JOIN apellidos a ON n.i = a.i;

-- PARTE 2: UBICACIONES (20 adicionales con nombres reales)
-- ========================================
WITH ubicaciones_reales AS (
    SELECT * FROM (VALUES
        ('Centro Logístico Norte', 'Polígono Industrial Las Mercedes', 'Madrid', 40.4168, -3.7038),
        ('Planta Producción Barcelona', 'Zona Franca, Sector B', 'Barcelona', 41.3851, 2.1734),
        ('Almacén Central Valencia', 'Parque Tecnológico Paterna', 'Valencia', 39.4699, -0.3763),
        ('Fábrica Sevilla Este', 'Polígono Industrial Calonge', 'Sevilla', 37.3886, -5.9823),
        ('Centro Distribución Bilbao', 'Zona Industrial Asua', 'Bilbao', 43.2630, -2.9350),
        ('Complejo Industrial Málaga', 'Parque Empresarial Andalucía', 'Málaga', 36.7213, -4.4214),
        ('Planta Zaragoza Norte', 'Plaza Logística PLAZA', 'Zaragoza', 41.6488, -0.8891),
        ('Almacén Murcia Sur', 'Polígono Industrial Oeste', 'Murcia', 37.9922, -1.1307),
        ('Centro Tecnológico Palma', 'Parc Bit - Son Espanyol', 'Palma', 39.5696, 2.6502),
        ('Fábrica Granada Este', 'Parque Tecnológico Ciencias Salud', 'Granada', 37.1773, -3.5986),
        ('Hub Logístico Madrid Sur', 'Corredor del Henares', 'Madrid', 40.3167, -3.4667),
        ('Centro I+D Barcelona Tech', 'Distrito 22@', 'Barcelona', 41.3995, 2.1909),
        ('Planta Ensamblaje Valencia', 'Polígono Industrial Fuente del Jarro', 'Valencia', 39.4321, -0.4012),
        ('Nave Industrial Sevilla', 'Parque Empresarial Carretera Amarilla', 'Sevilla', 37.4012, -5.9667),
        ('Centro Operaciones Bilbao', 'Parque Tecnológico Zamudio', 'Bilbao', 43.2989, -2.8767),
        ('Almacén Costa del Sol', 'Polígono Industrial San Luis', 'Málaga', 36.6789, -4.4989),
        ('Planta Aragón', 'Plataforma Logística Zaragoza', 'Zaragoza', 41.7012, -0.8456),
        ('Centro Logístico Levante', 'Parque Industrial Cabezo Beaza', 'Murcia', 37.9456, -1.0989),
        ('Instalaciones Baleares', 'Polígono Son Castelló', 'Palma', 39.5989, 2.6789),
        ('Complejo Andalucía Oriental', 'Área Metropolitana Granada', 'Granada', 37.1456, -3.6234)
    ) AS t(nombre, direccion, ciudad, lat, lon)
)
INSERT INTO locations (name, address, city, country, latitude, longitude)
SELECT nombre, direccion, ciudad, 'España', lat, lon
FROM ubicaciones_reales;

-- PARTE 3: TIPOS DE DISPOSITIVOS (10 adicionales con nombres reales)
-- ========================================
WITH tipos_dispositivos AS (
    SELECT * FROM (VALUES
        ('Gateway Industrial IoT GW-5000', 'Gateway de comunicación industrial con soporte multi-protocolo', 'Siemens', '{"model": "SICAM GW-5000", "power": "24V DC", "connectivity": "Ethernet/4G/WiFi"}'),
        ('Controlador PLC Avanzado', 'Controlador lógico programable para automatización', 'Allen-Bradley', '{"model": "CompactLogix 5380", "power": "24V DC", "connectivity": "Ethernet/IP"}'),
        ('Sensor Ambiental Multifunción', 'Sensor integrado temperatura/humedad/presión/CO2', 'Bosch', '{"model": "BME688", "power": "3.3V DC", "connectivity": "WiFi"}'),
        ('Medidor Energía Trifásico', 'Analizador de red eléctrica trifásico', 'Schneider Electric', '{"model": "PM8000", "power": "230V AC", "connectivity": "Modbus TCP"}'),
        ('Monitor Vibración Industrial', 'Sistema de monitoreo de vibraciones y temperatura', 'SKF', '{"model": "IMx-8", "power": "12V DC", "connectivity": "Wireless"}'),
        ('RTU Remoto Fieldbus', 'Unidad terminal remota para telemetría', 'ABB', '{"model": "RTU560", "power": "48V DC", "connectivity": "4G/Ethernet"}'),
        ('Datalogger Multicanal', 'Registrador de datos con 16 canales analógicos', 'National Instruments', '{"model": "cDAQ-9189", "power": "9-30V DC", "connectivity": "Ethernet"}'),
        ('Control Acceso Biométrico', 'Terminal de control de acceso con huella y RFID', 'HID Global', '{"model": "iCLASS SE R40", "power": "12V DC", "connectivity": "TCP/IP"}'),
        ('Cámara Térmica Industrial', 'Cámara termográfica con analítica de temperatura', 'FLIR', '{"model": "A700", "power": "24V DC", "connectivity": "Ethernet/PoE"}'),
        ('Sistema HVAC Inteligente', 'Controlador inteligente climatización industrial', 'Honeywell', '{"model": "Spyder", "power": "24V AC/DC", "connectivity": "BACnet/IP"}')
    ) AS t(nombre, descripcion, fabricante, specs)
)
INSERT INTO device_types (name, description, manufacturer, specifications)
SELECT nombre, descripcion, fabricante, specs::jsonb
FROM tipos_dispositivos;

-- PARTE 4: PROYECTOS (20 adicionales con nombres reales)
-- ========================================
WITH proyectos_reales AS (
    SELECT * FROM (VALUES
        ('Smart Factory Industria 4.0', 'Digitalización completa de planta de producción', 'active'),
        ('Sistema Monitoreo Energético', 'Control y optimización del consumo energético', 'active'),
        ('Red Sensores Ambientales', 'Monitoreo de calidad del aire en instalaciones', 'active'),
        ('Automatización Almacén Logístico', 'Sistema WMS con control robotizado', 'active'),
        ('Plataforma Mantenimiento Predictivo', 'IA para predicción de fallos en maquinaria', 'active'),
        ('Control Acceso Corporativo', 'Sistema integrado de seguridad y accesos', 'inactive'),
        ('Smart Building Central', 'Gestión inteligente de edificio corporativo', 'active'),
        ('Monitoreo Cadena Frío', 'Control temperatura en logística farmacéutica', 'active'),
        ('Sistema Detección Incendios', 'Red de sensores anti-incendios IoT', 'completed'),
        ('Telemetría Flota Vehículos', 'Seguimiento GPS y telemetría de vehículos', 'active'),
        ('Optimización Producción Línea A', 'Sensórica para mejora de proceso productivo', 'active'),
        ('Control Calidad Automatizado', 'Inspección visual con IA en producción', 'suspended'),
        ('Gestión Residuos Inteligente', 'Sensores nivel y rutas optimizadas', 'active'),
        ('Infraestructura Parking Smart', 'Control de plazas y pagos automatizados', 'completed'),
        ('Red Iluminación Inteligente', 'Sistema de iluminación adaptativa LED', 'active'),
        ('Monitoreo Estructural Edificios', 'Sensores de estrés y vibraciones', 'inactive'),
        ('Sistema Riego Automatizado', 'Control IoT de riego en zonas verdes', 'active'),
        ('Control Procesos Químicos', 'Monitoreo en tiempo real de reactores', 'active'),
        ('Trazabilidad Producto End-to-End', 'Sistema RFID para trazabilidad completa', 'suspended'),
        ('Hub Datos Industrial', 'Centralización y análisis de datos OT/IT', 'active')
    ) AS t(nombre, descripcion, estado)
)
INSERT INTO iot_projects (name, description, status, start_date, budget)
SELECT 
    nombre, 
    descripcion, 
    estado,
    CURRENT_DATE - ((random() * 365)::INT || ' days')::INTERVAL,
    (50000 + random() * 150000)::NUMERIC(15, 2)
FROM proyectos_reales;

-- PARTE 5: VERSIONES DE FIRMWARE (40 versiones)
-- ========================================
WITH device_type_ids AS (
    SELECT id, ROW_NUMBER() OVER (ORDER BY id) as rn
    FROM device_types
)
INSERT INTO firmware_versions (device_type_id, version, release_date, release_notes, is_stable)
SELECT 
    dt.id,
    ((i - 1) / 4)::INT || '.' || ((i - 1) % 4) || '.' || (random() * 9)::INT,
    CURRENT_DATE - ((random() * 180)::INT || ' days')::INTERVAL,
    CASE ((i - 1) % 4)
        WHEN 0 THEN 'Actualización de seguridad y corrección de vulnerabilidades'
        WHEN 1 THEN 'Mejoras de rendimiento y estabilidad del sistema'
        WHEN 2 THEN 'Nuevas funcionalidades de conectividad y protocolos'
        ELSE 'Optimización de consumo energético y recursos'
    END,
    (i % 3) != 0
FROM generate_series(1, 40) as i
CROSS JOIN LATERAL (
    SELECT id FROM device_type_ids 
    WHERE rn = ((i - 1) % (SELECT COUNT(*) FROM device_types)) + 1
) dt
ON CONFLICT (device_type_id, version) DO NOTHING;

-- PARTE 6: DISPOSITIVOS (100 dispositivos con nombres descriptivos)
-- ========================================
WITH project_ids AS (
    SELECT id, name, ROW_NUMBER() OVER (ORDER BY id) as rn
    FROM iot_projects
),
device_type_ids AS (
    SELECT id, name, ROW_NUMBER() OVER (ORDER BY id) as rn
    FROM device_types
),
location_ids AS (
    SELECT id, name, ROW_NUMBER() OVER (ORDER BY id) as rn
    FROM locations
),
prefijos AS (
    SELECT unnest(ARRAY[
        'GW', 'PLC', 'SNS', 'MTR', 'MON', 'RTU', 'DLG', 'ACC', 'CAM', 'HVC'
    ]) as prefijo, generate_series(1, 10) as pos
)
INSERT INTO devices (project_id, device_type_id, location_id, name, mac_address, ip_address, status, firmware_version, last_seen)
SELECT 
    p.id,
    dt.id,
    l.id,
    pf.prefijo || '-' || 
    CASE (i % 5)
        WHEN 0 THEN 'PROD'
        WHEN 1 THEN 'TEST'
        WHEN 2 THEN 'QA'
        WHEN 3 THEN 'DEV'
        ELSE 'MAIN'
    END || '-' || LPAD(i::TEXT, 4, '0'),
    LPAD(TO_HEX((i / 256 / 256) % 256), 2, '0') || ':' ||
    LPAD(TO_HEX((i / 256) % 256), 2, '0') || ':' ||
    LPAD(TO_HEX(i % 256), 2, '0') || ':' ||
    LPAD(TO_HEX((i * 7) % 256), 2, '0') || ':' ||
    LPAD(TO_HEX((i * 13) % 256), 2, '0') || ':' ||
    LPAD(TO_HEX((i * 17) % 256), 2, '0'),
    ('10.' || ((i / 256) % 256) || '.' || (i % 256) || '.' || (50 + (i % 200)))::inet,
    CASE (i % 5)
        WHEN 0 THEN 'online'
        WHEN 1 THEN 'offline'
        WHEN 2 THEN 'maintenance'
        WHEN 3 THEN 'error'
        ELSE 'online'
    END,
    '1.' || (i % 5) || '.' || (i % 10),
    NOW() - ((random() * 48)::INT || ' hours')::INTERVAL
FROM generate_series(1, 100) as i
CROSS JOIN LATERAL (
    SELECT id, name FROM project_ids 
    WHERE rn = ((i - 1) % (SELECT COUNT(*) FROM iot_projects)) + 1
) p
CROSS JOIN LATERAL (
    SELECT id, name FROM device_type_ids 
    WHERE rn = ((i - 1) % (SELECT COUNT(*) FROM device_types)) + 1
) dt
CROSS JOIN LATERAL (
    SELECT id, name FROM location_ids 
    WHERE rn = ((i - 1) % (SELECT COUNT(*) FROM locations)) + 1
) l
CROSS JOIN LATERAL (
    SELECT prefijo FROM prefijos WHERE pos = ((i - 1) % 10) + 1
) pf;

-- PARTE 7: SENSORES (300 sensores con nombres descriptivos)
-- ========================================
WITH device_ids AS (
    SELECT id, name, ROW_NUMBER() OVER (ORDER BY id) as rn
    FROM devices
),
tipos_sensor AS (
    SELECT * FROM (VALUES
        ('temperature', 'Temperatura Ambiente', '°C', 15, 40),
        ('humidity', 'Humedad Relativa', '%RH', 30, 85),
        ('pressure', 'Presión Atmosférica', 'hPa', 980, 1030),
        ('co2', 'Concentración CO2', 'ppm', 400, 1500),
        ('vibration', 'Nivel Vibración', 'mm/s', 1, 45),
        ('voltage', 'Tensión Eléctrica', 'V', 200, 240),
        ('current', 'Corriente Eléctrica', 'A', 5, 80),
        ('flow', 'Caudal de Fluido', 'L/min', 10, 800)
    ) AS t(tipo, nombre, unidad, min_val, max_val)
)
INSERT INTO sensors (device_id, name, sensor_type, unit, min_value, max_value, calibration_date, is_active)
SELECT 
    d.id,
    ts.nombre || ' - ' || 
    CASE ((i - 1) % 3)
        WHEN 0 THEN 'Principal'
        WHEN 1 THEN 'Redundante'
        ELSE 'Auxiliar'
    END || ' [' || SUBSTRING(d.name, 1, 12) || ']',
    ts.tipo,
    ts.unidad,
    ts.min_val::NUMERIC(15, 4),
    ts.max_val::NUMERIC(15, 4),
    CURRENT_DATE - ((random() * 90)::INT || ' days')::INTERVAL,
    (i % 10) != 0
FROM generate_series(1, 300) as i
CROSS JOIN LATERAL (
    SELECT id, name FROM device_ids 
    WHERE rn = ((i - 1) / 3) + 1
) d
CROSS JOIN LATERAL (
    SELECT * FROM tipos_sensor 
    OFFSET ((i - 1) % 8) LIMIT 1
) ts;

-- PARTE 8: LECTURAS DE SENSORES (5000 lecturas distribuidas)
-- ========================================
WITH active_sensors AS (
    SELECT id, min_value, max_value, sensor_type, ROW_NUMBER() OVER (ORDER BY id) as rn
    FROM sensors
    WHERE is_active = true
)
INSERT INTO sensor_readings (sensor_id, value, timestamp, quality_score, metadata)
SELECT 
    s.id,
    (s.min_value + random() * (COALESCE(NULLIF(s.max_value - s.min_value, 0), 100)))::NUMERIC(15, 4),
    NOW() - ((random() * 72)::INT || ' hours')::INTERVAL - ((random() * 60)::INT || ' minutes')::INTERVAL,
    (0.85 + random() * 0.15)::NUMERIC(3, 2),
    jsonb_build_object(
        'source', CASE (i % 3) WHEN 0 THEN 'automatic' WHEN 1 THEN 'scheduled' ELSE 'on_demand' END,
        'sensor_type', s.sensor_type,
        'batch_id', 'BATCH-' || LPAD(((i / 100)::INT)::TEXT, 4, '0')
    )
FROM generate_series(1, 5000) as i
CROSS JOIN LATERAL (
    SELECT id, min_value, max_value, sensor_type FROM active_sensors 
    WHERE rn = (i % (SELECT COUNT(*) FROM active_sensors)) + 1
) s;

-- PARTE 9: ALERTAS (200 alertas con mensajes descriptivos)
-- ========================================
WITH device_ids AS (
    SELECT id, name, ROW_NUMBER() OVER (ORDER BY id) as rn
    FROM devices
),
user_ids AS (
    SELECT id, name FROM users WHERE role IN ('admin', 'engineer')
),
mensajes_alertas AS (
    SELECT * FROM (VALUES
        ('threshold_exceeded', 'low', 'Temperatura supera umbral de precaución'),
        ('threshold_exceeded', 'medium', 'Humedad fuera del rango óptimo de operación'),
        ('threshold_exceeded', 'high', 'Presión crítica detectada en sistema'),
        ('threshold_exceeded', 'critical', 'Nivel de CO2 peligroso - ventilación requerida'),
        ('connection_lost', 'medium', 'Pérdida de comunicación con dispositivo'),
        ('connection_lost', 'high', 'Dispositivo sin respuesta por más de 1 hora'),
        ('connection_lost', 'critical', 'Gateway desconectado - múltiples sensores afectados'),
        ('sensor_error', 'low', 'Sensor requiere recalibración rutinaria'),
        ('sensor_error', 'medium', 'Lecturas inconsistentes detectadas en sensor'),
        ('sensor_error', 'high', 'Fallo en sensor - valores fuera de rango físico'),
        ('sensor_error', 'critical', 'Sensor no responde - reemplazo necesario'),
        ('firmware_update', 'low', 'Nueva versión de firmware disponible'),
        ('firmware_update', 'medium', 'Actualización de seguridad recomendada'),
        ('firmware_update', 'high', 'Actualización crítica de firmware requerida'),
        ('power_failure', 'critical', 'Fallo de alimentación eléctrica detectado'),
        ('maintenance_required', 'medium', 'Mantenimiento preventivo programado próximo'),
        ('performance_degradation', 'high', 'Degradación de rendimiento del dispositivo'),
        ('security_breach', 'critical', 'Intento de acceso no autorizado detectado'),
        ('data_anomaly', 'medium', 'Patrón anómalo detectado en lecturas'),
        ('calibration_drift', 'low', 'Deriva de calibración - revisión necesaria')
    ) AS t(tipo, severidad, mensaje)
)
INSERT INTO alerts (device_id, severity, message, alert_type, status, created_at, resolved_at, resolved_by)
SELECT 
    d.id,
    ma.severidad,
    ma.mensaje || ' en ' || d.name,
    ma.tipo,
    CASE (i % 4)
        WHEN 0 THEN 'active'
        WHEN 1 THEN 'acknowledged'
        WHEN 2 THEN 'resolved'
        ELSE 'dismissed'
    END,
    NOW() - ((random() * 168)::INT || ' hours')::INTERVAL,
    CASE WHEN (i % 4) IN (2, 3) THEN NOW() - ((random() * 24)::INT || ' hours')::INTERVAL ELSE NULL END,
    CASE WHEN (i % 4) IN (2, 3) THEN (SELECT id FROM user_ids ORDER BY random() LIMIT 1) ELSE NULL END
FROM generate_series(1, 200) as i
CROSS JOIN LATERAL (
    SELECT id, name FROM device_ids 
    WHERE rn = (i % (SELECT COUNT(*) FROM devices)) + 1
) d
CROSS JOIN LATERAL (
    SELECT * FROM mensajes_alertas ORDER BY random() LIMIT 1
) ma;

-- PARTE 10: REGISTROS DE MANTENIMIENTO (160 registros con descripciones reales)
-- ========================================
WITH device_ids AS (
    SELECT id, name, ROW_NUMBER() OVER (ORDER BY id) as rn
    FROM devices
),
tech_ids AS (
    SELECT id, name FROM users WHERE role IN ('technician', 'engineer')
),
descripciones_mant AS (
    SELECT * FROM (VALUES
        ('preventive', 'Inspección visual y limpieza de componentes'),
        ('preventive', 'Verificación de conexiones y apriete de terminales'),
        ('preventive', 'Actualización de firmware y software'),
        ('preventive', 'Calibración de sensores y verificación de precisión'),
        ('preventive', 'Revisión de sistema de alimentación y baterías'),
        ('corrective', 'Reemplazo de sensor defectuoso'),
        ('corrective', 'Reparación de conexión de red intermitente'),
        ('corrective', 'Sustitución de fuente de alimentación'),
        ('corrective', 'Corrección de error de configuración'),
        ('emergency', 'Intervención urgente por fallo crítico del sistema'),
        ('emergency', 'Reparación de emergencia tras corte eléctrico'),
        ('emergency', 'Restauración de servicio tras caída de gateway'),
        ('upgrade', 'Instalación de módulo de comunicación 5G'),
        ('upgrade', 'Actualización a versión enterprise del firmware'),
        ('upgrade', 'Ampliación de capacidad de almacenamiento'),
        ('upgrade', 'Instalación de sensores adicionales')
    ) AS t(tipo, descripcion)
)
INSERT INTO maintenance_logs (
    device_id, 
    technician_id, 
    maintenance_type, 
    description, 
    status, 
    scheduled_date, 
    completed_date, 
    cost,
    parts_replaced,
    notes
)
SELECT 
    d.id,
    (SELECT id FROM tech_ids ORDER BY random() LIMIT 1),
    dm.tipo,
    dm.descripcion || ' en ' || d.name,
    CASE (i % 4)
        WHEN 0 THEN 'scheduled'
        WHEN 1 THEN 'in_progress'
        WHEN 2 THEN 'completed'
        ELSE 'cancelled'
    END,
    NOW() - ((random() * 60)::INT || ' days')::INTERVAL,
    CASE WHEN (i % 4) = 2 THEN NOW() - ((random() * 30)::INT || ' days')::INTERVAL ELSE NULL END,
    CASE WHEN (i % 4) = 2 THEN (150 + random() * 850)::NUMERIC(12, 2) ELSE NULL END,
    CASE 
        WHEN (i % 4) = 2 AND dm.tipo IN ('corrective', 'emergency') 
        THEN ARRAY['Componente ' || chr(65 + (i % 10)), 'Conector tipo ' || (i % 5)]
        ELSE NULL
    END,
    CASE (i % 4)
        WHEN 0 THEN 'Pendiente de programación con producción'
        WHEN 1 THEN 'Trabajo en curso - ' || (25 + random() * 50)::INT || '% completado'
        WHEN 2 THEN 'Finalizado satisfactoriamente - Sistema operativo'
        ELSE 'Cancelado - No requerido tras diagnóstico remoto'
    END
FROM generate_series(1, 160) as i
CROSS JOIN LATERAL (
    SELECT id, name FROM device_ids 
    WHERE rn = (i % (SELECT COUNT(*) FROM devices)) + 1
) d
CROSS JOIN LATERAL (
    SELECT * FROM descripciones_mant 
    WHERE tipo = (ARRAY['preventive', 'corrective', 'emergency', 'upgrade'])[(i % 4) + 1]
    ORDER BY random() LIMIT 1
) dm;

-- ========================================
-- RESUMEN FINAL
-- ========================================
SELECT 
    '========================================' as separador,
    'RESUMEN DE POBLACIÓN DE DATOS' as titulo;

SELECT 
    tabla,
    registros::TEXT,
    CASE 
        WHEN tabla = 'users' AND registros >= 20 THEN '✅'
        WHEN tabla = 'locations' AND registros >= 20 THEN '✅'
        WHEN tabla = 'device_types' AND registros >= 10 THEN '✅'
        WHEN tabla = 'iot_projects' AND registros >= 20 THEN '✅'
        WHEN tabla = 'firmware_versions' AND registros >= 30 THEN '✅'
        WHEN tabla = 'devices' AND registros >= 100 THEN '✅'
        WHEN tabla = 'sensors' AND registros >= 300 THEN '✅'
        WHEN tabla = 'sensor_readings' AND registros >= 5000 THEN '✅'
        WHEN tabla = 'alerts' AND registros >= 200 THEN '✅'
        WHEN tabla = 'maintenance_logs' AND registros >= 160 THEN '✅'
        ELSE '⚠️'
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
ORDER BY 
    CASE tabla
        WHEN 'users' THEN 1
        WHEN 'locations' THEN 2
        WHEN 'device_types' THEN 3
        WHEN 'iot_projects' THEN 4
        WHEN 'firmware_versions' THEN 5
        WHEN 'devices' THEN 6
        WHEN 'sensors' THEN 7
        WHEN 'sensor_readings' THEN 8
        WHEN 'alerts' THEN 9
        WHEN 'maintenance_logs' THEN 10
    END;

SELECT 
    '========================================' as separador,
    'DISTRIBUCIÓN DE DATOS' as titulo;

SELECT 'Dispositivos por proyecto' as metrica, 
       ROUND(AVG(cnt)::NUMERIC, 1)::TEXT || ' dispositivos/proyecto' as valor
FROM (SELECT project_id, COUNT(*) as cnt FROM devices GROUP BY project_id) t;

SELECT 'Sensores por dispositivo' as metrica,
       ROUND(AVG(cnt)::NUMERIC, 1)::TEXT || ' sensores/dispositivo' as valor
FROM (SELECT device_id, COUNT(*) as cnt FROM sensors GROUP BY device_id) t;

SELECT 'Lecturas por sensor activo' as metrica,
       ROUND(AVG(cnt)::NUMERIC, 1)::TEXT || ' lecturas/sensor' as valor
FROM (SELECT sensor_id, COUNT(*) as cnt FROM sensor_readings GROUP BY sensor_id) t;

SELECT '========================================' as separador,
       '✅ POBLACIÓN COMPLETADA CON NOMBRES REALES' as titulo;