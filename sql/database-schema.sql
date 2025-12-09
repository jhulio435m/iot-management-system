-- Sistema de Gestión IoT - PostgreSQL
-- 10 Tablas Normalizadas 3FN
DROP TABLE IF EXISTS sensor_readings CASCADE;
DROP TABLE IF EXISTS alerts CASCADE;
DROP TABLE IF EXISTS maintenance_logs CASCADE;
DROP TABLE IF EXISTS sensors CASCADE;
DROP TABLE IF EXISTS devices CASCADE;
DROP TABLE IF EXISTS firmware_versions CASCADE;
DROP TABLE IF EXISTS iot_projects CASCADE;
DROP TABLE IF EXISTS device_types CASCADE;
DROP TABLE IF EXISTS locations CASCADE;
DROP TABLE IF EXISTS users CASCADE;
CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('admin', 'engineer', 'technician', 'operator')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE locations (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    address VARCHAR(255) NOT NULL,
    city VARCHAR(100) NOT NULL,
    country VARCHAR(100) NOT NULL,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE device_types (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    manufacturer VARCHAR(100),
    specifications JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE iot_projects (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    description TEXT,
    status VARCHAR(50) NOT NULL CHECK (status IN ('active', 'inactive', 'completed', 'suspended')),
    start_date DATE NOT NULL,
    end_date DATE,
    budget DECIMAL(15, 2),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE firmware_versions (
    id BIGSERIAL PRIMARY KEY,
    device_type_id BIGINT NOT NULL REFERENCES device_types(id) ON DELETE CASCADE,
    version VARCHAR(50) NOT NULL,
    release_date DATE NOT NULL,
    release_notes TEXT,
    download_url VARCHAR(500),
    is_stable BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(device_type_id, version)
);

CREATE TABLE devices (
    id BIGSERIAL PRIMARY KEY,
    project_id BIGINT NOT NULL REFERENCES iot_projects(id) ON DELETE CASCADE,
    device_type_id BIGINT NOT NULL REFERENCES device_types(id) ON DELETE RESTRICT,
    location_id BIGINT REFERENCES locations(id) ON DELETE SET NULL,
    name VARCHAR(150) NOT NULL,
    mac_address VARCHAR(17) UNIQUE NOT NULL,
    ip_address INET,
    status VARCHAR(50) NOT NULL CHECK (status IN ('online', 'offline', 'maintenance', 'error')),
    firmware_version VARCHAR(50),
    last_seen TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE sensors (
    id BIGSERIAL PRIMARY KEY,
    device_id BIGINT NOT NULL REFERENCES devices(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    sensor_type VARCHAR(100) NOT NULL,
    unit VARCHAR(50) NOT NULL,
    min_value DECIMAL(15, 4),
    max_value DECIMAL(15, 4),
    calibration_date DATE,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE sensor_readings (
    id BIGSERIAL PRIMARY KEY,
    sensor_id BIGINT NOT NULL REFERENCES sensors(id) ON DELETE CASCADE,
    value DECIMAL(15, 4) NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    quality_score DECIMAL(3, 2) CHECK (quality_score >= 0 AND quality_score <= 1),
    metadata JSONB
);

CREATE TABLE alerts (
    id BIGSERIAL PRIMARY KEY,
    device_id BIGINT NOT NULL REFERENCES devices(id) ON DELETE CASCADE,
    severity VARCHAR(50) NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
    message TEXT NOT NULL,
    alert_type VARCHAR(100) NOT NULL,
    status VARCHAR(50) NOT NULL CHECK (status IN ('active', 'acknowledged', 'resolved', 'dismissed')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    resolved_at TIMESTAMP WITH TIME ZONE,
    resolved_by BIGINT REFERENCES users(id) ON DELETE SET NULL
);

CREATE TABLE maintenance_logs (
    id BIGSERIAL PRIMARY KEY,
    device_id BIGINT NOT NULL REFERENCES devices(id) ON DELETE CASCADE,
    technician_id BIGINT NOT NULL REFERENCES users(id) ON DELETE RESTRICT,
    maintenance_type VARCHAR(50) NOT NULL CHECK (maintenance_type IN ('preventive', 'corrective', 'emergency', 'upgrade')),
    description TEXT NOT NULL,
    status VARCHAR(50) NOT NULL CHECK (status IN ('scheduled', 'in_progress', 'completed', 'cancelled')),
    scheduled_date TIMESTAMP WITH TIME ZONE,
    completed_date TIMESTAMP WITH TIME ZONE,
    cost DECIMAL(12, 2),
    parts_replaced TEXT[],
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
CREATE INDEX idx_devices_status ON devices(status);
CREATE INDEX idx_devices_project_id ON devices(project_id);
CREATE INDEX idx_devices_location_id ON devices(location_id);
CREATE INDEX idx_sensors_device_id ON sensors(device_id);
CREATE INDEX idx_sensor_readings_sensor_id ON sensor_readings(sensor_id);
CREATE INDEX idx_sensor_readings_timestamp ON sensor_readings(timestamp DESC);
CREATE INDEX idx_alerts_device_id ON alerts(device_id);
CREATE INDEX idx_alerts_status ON alerts(status);
CREATE INDEX idx_alerts_severity ON alerts(severity);
CREATE INDEX idx_maintenance_logs_device_id ON maintenance_logs(device_id);
CREATE INDEX idx_maintenance_logs_technician_id ON maintenance_logs(technician_id);
CREATE INDEX idx_maintenance_logs_status ON maintenance_logs(status);
CREATE INDEX idx_firmware_versions_device_type_id ON firmware_versions(device_type_id);
INSERT INTO users (name, email, role) VALUES
('Carlos Rodríguez', 'carlos.rodriguez@iot.com', 'admin'),
('Ana Martínez', 'ana.martinez@iot.com', 'engineer'),
('Luis García', 'luis.garcia@iot.com', 'technician'),
('María López', 'maria.lopez@iot.com', 'operator'),
('Pedro Sánchez', 'pedro.sanchez@iot.com', 'technician'),
('Laura Fernández', 'laura.fernandez@iot.com', 'engineer');

INSERT INTO locations (name, address, city, country, latitude, longitude) VALUES
('Data Center Norte', 'Av. Tecnológica 1234', 'Madrid', 'España', 40.416775, -3.703790),
('Planta Industrial Sur', 'Calle Industrial 567', 'Barcelona', 'España', 41.385064, 2.173404),
('Laboratorio Central', 'Av. Investigación 890', 'Valencia', 'España', 39.469907, -0.376288),
('Almacén Logístico', 'Polígono Industrial Este', 'Sevilla', 'España', 37.389092, -5.984459),
('Oficinas Corporativas', 'Gran Vía 100', 'Madrid', 'España', 40.420000, -3.705000),
('Centro de Distribución', 'Zona Franca 200', 'Zaragoza', 'España', 41.648823, -0.889085);

INSERT INTO device_types (name, description, manufacturer, specifications) VALUES
('Sensor Gateway IoT', 'Gateway para comunicación de sensores', 'TechIoT Inc', '{"connectivity": "WiFi/4G", "power": "12V DC", "max_sensors": 50}'),
('Smart Temperature Controller', 'Controlador de temperatura inteligente', 'SmartDevices Co', '{"range": "-40 to 125°C", "accuracy": "±0.5°C", "protocol": "MQTT"}'),
('Vibration Monitor', 'Monitor de vibración industrial', 'IndustrialSense', '{"frequency": "0-10kHz", "sensitivity": "100mV/g", "channels": 3}'),
('Air Quality Sensor', 'Sensor de calidad del aire', 'EcoMonitor Ltd', '{"sensors": ["CO2", "PM2.5", "PM10", "VOC"], "protocol": "MQTT"}'),
('Energy Meter', 'Medidor de energía trifásico', 'PowerTech', '{"voltage": "100-500V", "current": "0-100A", "accuracy": "0.5%"}'),
('Water Flow Sensor', 'Sensor de flujo de agua para gestión hídrica', 'AquaTech Systems', '{"accuracy": "±2%", "range": "0-100 L/min", "protocol": "Modbus"}');

-- Insertar proyectos
INSERT INTO iot_projects (name, description, status, start_date, budget) VALUES
('Monitoreo Climatización', 'Sistema de monitoreo de temperatura y humedad en data centers', 'active', '2024-01-15', 50000.00),
('Control Industrial', 'Monitoreo de maquinaria industrial en tiempo real', 'active', '2024-03-01', 75000.00),
('Calidad Aire Oficinas', 'Sensores de calidad de aire en espacios de trabajo', 'active', '2024-06-01', 30000.00),
('Gestión Energética', 'Monitoreo y optimización de consumo energético', 'active', '2024-02-10', 45000.00),
('Control de Agua', 'Sistema de medición de consumo de agua', 'active', '2024-05-20', 35000.00);

-- Insertar versiones de firmware
INSERT INTO firmware_versions (device_type_id, version, release_date, release_notes, is_stable)
SELECT id, '2.1.0', '2024-10-15', 'Mejoras de estabilidad y soporte MQTT 5.0', true
FROM device_types WHERE name = 'Sensor Gateway IoT';

INSERT INTO firmware_versions (device_type_id, version, release_date, release_notes, is_stable)
SELECT id, '2.0.5', '2024-08-20', 'Versión anterior estable', true
FROM device_types WHERE name = 'Sensor Gateway IoT';

INSERT INTO firmware_versions (device_type_id, version, release_date, release_notes, is_stable)
SELECT id, '1.5.3', '2024-11-01', 'Corrección de bugs en calibración automática', true
FROM device_types WHERE name = 'Smart Temperature Controller';

INSERT INTO firmware_versions (device_type_id, version, release_date, release_notes, is_stable)
SELECT id, '3.2.1', '2024-09-10', 'Soporte para nuevos sensores VOC', true
FROM device_types WHERE name = 'Air Quality Sensor';

INSERT INTO firmware_versions (device_type_id, version, release_date, release_notes, is_stable)
SELECT id, '1.0.8', '2024-07-15', 'Primera versión estable', true
FROM device_types WHERE name = 'Energy Meter';

INSERT INTO firmware_versions (device_type_id, version, release_date, release_notes, is_stable)
SELECT id, '2.3.0', '2024-11-20', 'Mejoras en precisión de medición', true
FROM device_types WHERE name = 'Water Flow Sensor';

-- Insertar dispositivos (múltiples por proyecto y ubicación)
INSERT INTO devices (project_id, device_type_id, location_id, name, mac_address, ip_address, status, firmware_version, last_seen)
SELECT 
    p.id, dt.id, l.id, 
    'Gateway-DC-01', '00:1B:44:11:3A:B7', '192.168.1.101', 'online', '2.1.0', NOW()
FROM iot_projects p, device_types dt, locations l
WHERE p.name = 'Monitoreo Climatización' 
AND dt.name = 'Sensor Gateway IoT' 
AND l.name = 'Data Center Norte';

INSERT INTO devices (project_id, device_type_id, location_id, name, mac_address, ip_address, status, firmware_version, last_seen)
SELECT 
    p.id, dt.id, l.id, 
    'TempCtrl-DC-01', '00:1B:44:11:3A:B8', '192.168.1.102', 'online', '1.5.3', NOW()
FROM iot_projects p, device_types dt, locations l
WHERE p.name = 'Monitoreo Climatización' 
AND dt.name = 'Smart Temperature Controller' 
AND l.name = 'Data Center Norte';

INSERT INTO devices (project_id, device_type_id, location_id, name, mac_address, ip_address, status, firmware_version, last_seen)
SELECT 
    p.id, dt.id, l.id, 
    'TempCtrl-DC-02', '00:1B:44:11:3A:B9', '192.168.1.103', 'online', '1.5.3', NOW()
FROM iot_projects p, device_types dt, locations l
WHERE p.name = 'Monitoreo Climatización' 
AND dt.name = 'Smart Temperature Controller' 
AND l.name = 'Data Center Norte';

INSERT INTO devices (project_id, device_type_id, location_id, name, mac_address, ip_address, status, firmware_version, last_seen)
SELECT 
    p.id, dt.id, l.id, 
    'VibMon-IND-01', '00:1B:44:11:3A:C1', '192.168.2.101', 'online', '1.0.2', NOW() - INTERVAL '5 minutes'
FROM iot_projects p, device_types dt, locations l
WHERE p.name = 'Control Industrial' 
AND dt.name = 'Vibration Monitor' 
AND l.name = 'Planta Industrial Sur';

INSERT INTO devices (project_id, device_type_id, location_id, name, mac_address, ip_address, status, firmware_version, last_seen)
SELECT 
    p.id, dt.id, l.id, 
    'VibMon-IND-02', '00:1B:44:11:3A:C2', '192.168.2.102', 'offline', '1.0.2', NOW() - INTERVAL '3 hours'
FROM iot_projects p, device_types dt, locations l
WHERE p.name = 'Control Industrial' 
AND dt.name = 'Vibration Monitor' 
AND l.name = 'Planta Industrial Sur';

INSERT INTO devices (project_id, device_type_id, location_id, name, mac_address, ip_address, status, firmware_version, last_seen)
SELECT 
    p.id, dt.id, l.id, 
    'AirQ-LAB-01', '00:1B:44:11:3A:D0', '192.168.3.101', 'maintenance', '3.2.1', NOW() - INTERVAL '2 hours'
FROM iot_projects p, device_types dt, locations l
WHERE p.name = 'Calidad Aire Oficinas' 
AND dt.name = 'Air Quality Sensor' 
AND l.name = 'Laboratorio Central';

INSERT INTO devices (project_id, device_type_id, location_id, name, mac_address, ip_address, status, firmware_version, last_seen)
SELECT 
    p.id, dt.id, l.id, 
    'AirQ-OFF-01', '00:1B:44:11:3A:D1', '192.168.3.102', 'online', '3.2.1', NOW()
FROM iot_projects p, device_types dt, locations l
WHERE p.name = 'Calidad Aire Oficinas' 
AND dt.name = 'Air Quality Sensor' 
AND l.name = 'Oficinas Corporativas';

INSERT INTO devices (project_id, device_type_id, location_id, name, mac_address, ip_address, status, firmware_version, last_seen)
SELECT 
    p.id, dt.id, l.id, 
    'EnergyM-DC-01', '00:1B:44:11:3A:E0', '192.168.1.104', 'online', '1.0.8', NOW()
FROM iot_projects p, device_types dt, locations l
WHERE p.name = 'Gestión Energética' 
AND dt.name = 'Energy Meter' 
AND l.name = 'Data Center Norte';

INSERT INTO devices (project_id, device_type_id, location_id, name, mac_address, ip_address, status, firmware_version, last_seen)
SELECT 
    p.id, dt.id, l.id, 
    'EnergyM-OFF-01', '00:1B:44:11:3A:E1', '192.168.5.101', 'online', '1.0.8', NOW()
FROM iot_projects p, device_types dt, locations l
WHERE p.name = 'Gestión Energética' 
AND dt.name = 'Energy Meter' 
AND l.name = 'Oficinas Corporativas';

INSERT INTO devices (project_id, device_type_id, location_id, name, mac_address, ip_address, status, firmware_version, last_seen)
SELECT 
    p.id, dt.id, l.id, 
    'WaterFlow-ALM-01', '00:1B:44:11:3A:F0', '192.168.4.101', 'online', '2.3.0', NOW()
FROM iot_projects p, device_types dt, locations l
WHERE p.name = 'Control de Agua' 
AND dt.name = 'Water Flow Sensor' 
AND l.name = 'Almacén Logístico';

INSERT INTO devices (project_id, device_type_id, location_id, name, mac_address, ip_address, status, firmware_version, last_seen)
SELECT 
    p.id, dt.id, l.id, 
    'WaterFlow-IND-01', '00:1B:44:11:3A:F1', '192.168.2.103', 'error', '2.3.0', NOW() - INTERVAL '6 hours'
FROM iot_projects p, device_types dt, locations l
WHERE p.name = 'Control de Agua' 
AND dt.name = 'Water Flow Sensor' 
AND l.name = 'Planta Industrial Sur';

-- Insertar sensores (múltiples por dispositivo)
INSERT INTO sensors (device_id, name, sensor_type, unit, min_value, max_value, calibration_date)
SELECT d.id, 'Temperatura Ambiente', 'temperature', '°C', -10, 50, '2024-10-01'
FROM devices d WHERE d.name = 'TempCtrl-DC-01';

INSERT INTO sensors (device_id, name, sensor_type, unit, min_value, max_value, calibration_date)
SELECT d.id, 'Humedad Relativa', 'humidity', '%', 0, 100, '2024-10-01'
FROM devices d WHERE d.name = 'TempCtrl-DC-01';

INSERT INTO sensors (device_id, name, sensor_type, unit, min_value, max_value, calibration_date)
SELECT d.id, 'Temperatura Ambiente', 'temperature', '°C', -10, 50, '2024-10-01'
FROM devices d WHERE d.name = 'TempCtrl-DC-02';

INSERT INTO sensors (device_id, name, sensor_type, unit, min_value, max_value, calibration_date)
SELECT d.id, 'Humedad Relativa', 'humidity', '%', 0, 100, '2024-10-01'
FROM devices d WHERE d.name = 'TempCtrl-DC-02';

INSERT INTO sensors (device_id, name, sensor_type, unit, min_value, max_value, calibration_date)
SELECT d.id, 'Vibración Eje X', 'vibration', 'mm/s', 0, 100, '2024-09-15'
FROM devices d WHERE d.name = 'VibMon-IND-01';

INSERT INTO sensors (device_id, name, sensor_type, unit, min_value, max_value, calibration_date)
SELECT d.id, 'Vibración Eje Y', 'vibration', 'mm/s', 0, 100, '2024-09-15'
FROM devices d WHERE d.name = 'VibMon-IND-01';

INSERT INTO sensors (device_id, name, sensor_type, unit, min_value, max_value, calibration_date)
SELECT d.id, 'Vibración Eje Z', 'vibration', 'mm/s', 0, 100, '2024-09-15'
FROM devices d WHERE d.name = 'VibMon-IND-01';

INSERT INTO sensors (device_id, name, sensor_type, unit, min_value, max_value, calibration_date)
SELECT d.id, 'CO2 Ambiental', 'co2', 'ppm', 0, 5000, '2024-11-01'
FROM devices d WHERE d.name = 'AirQ-LAB-01';

INSERT INTO sensors (device_id, name, sensor_type, unit, min_value, max_value, calibration_date)
SELECT d.id, 'Partículas PM2.5', 'particle', 'µg/m³', 0, 500, '2024-11-01'
FROM devices d WHERE d.name = 'AirQ-LAB-01';

INSERT INTO sensors (device_id, name, sensor_type, unit, min_value, max_value, calibration_date)
SELECT d.id, 'CO2 Ambiental', 'co2', 'ppm', 0, 5000, '2024-11-01'
FROM devices d WHERE d.name = 'AirQ-OFF-01';

INSERT INTO sensors (device_id, name, sensor_type, unit, min_value, max_value, calibration_date)
SELECT d.id, 'Partículas PM2.5', 'particle', 'µg/m³', 0, 500, '2024-11-01'
FROM devices d WHERE d.name = 'AirQ-OFF-01';

INSERT INTO sensors (device_id, name, sensor_type, unit, min_value, max_value, calibration_date)
SELECT d.id, 'VOC Total', 'voc', 'ppb', 0, 1000, '2024-11-01'
FROM devices d WHERE d.name = 'AirQ-OFF-01';

INSERT INTO sensors (device_id, name, sensor_type, unit, min_value, max_value, calibration_date)
SELECT d.id, 'Potencia Activa', 'power', 'kW', 0, 100, '2024-10-20'
FROM devices d WHERE d.name = 'EnergyM-DC-01';

INSERT INTO sensors (device_id, name, sensor_type, unit, min_value, max_value, calibration_date)
SELECT d.id, 'Voltaje L1', 'voltage', 'V', 0, 500, '2024-10-20'
FROM devices d WHERE d.name = 'EnergyM-DC-01';

INSERT INTO sensors (device_id, name, sensor_type, unit, min_value, max_value, calibration_date)
SELECT d.id, 'Corriente L1', 'current', 'A', 0, 100, '2024-10-20'
FROM devices d WHERE d.name = 'EnergyM-DC-01';

INSERT INTO sensors (device_id, name, sensor_type, unit, min_value, max_value, calibration_date)
SELECT d.id, 'Potencia Activa', 'power', 'kW', 0, 50, '2024-10-20'
FROM devices d WHERE d.name = 'EnergyM-OFF-01';

INSERT INTO sensors (device_id, name, sensor_type, unit, min_value, max_value, calibration_date)
SELECT d.id, 'Flujo Instantáneo', 'flow', 'L/min', 0, 100, '2024-11-05'
FROM devices d WHERE d.name = 'WaterFlow-ALM-01';

INSERT INTO sensors (device_id, name, sensor_type, unit, min_value, max_value, calibration_date)
SELECT d.id, 'Flujo Total', 'flow_total', 'L', 0, 1000000, '2024-11-05'
FROM devices d WHERE d.name = 'WaterFlow-ALM-01';

INSERT INTO sensors (device_id, name, sensor_type, unit, min_value, max_value, calibration_date)
SELECT d.id, 'Flujo Instantáneo', 'flow', 'L/min', 0, 100, '2024-11-05'
FROM devices d WHERE d.name = 'WaterFlow-IND-01';

-- Insertar lecturas de sensores (últimas 24 horas con variaciones realistas)
-- Temperatura
INSERT INTO sensor_readings (sensor_id, value, timestamp, quality_score)
SELECT s.id, 
       21.0 + (3 * SIN(RADIANS(generate_series * 15))) + (random() * 1.5), 
       NOW() - INTERVAL '1 hour' * generate_series, 
       0.95 + (random() * 0.05)
FROM sensors s, generate_series(0, 47) 
WHERE s.name = 'Temperatura Ambiente' AND s.device_id IN (SELECT id FROM devices WHERE name = 'TempCtrl-DC-01');

INSERT INTO sensor_readings (sensor_id, value, timestamp, quality_score)
SELECT s.id, 
       22.0 + (2.5 * SIN(RADIANS(generate_series * 15))) + (random() * 1.2), 
       NOW() - INTERVAL '1 hour' * generate_series, 
       0.96 + (random() * 0.04)
FROM sensors s, generate_series(0, 47) 
WHERE s.name = 'Temperatura Ambiente' AND s.device_id IN (SELECT id FROM devices WHERE name = 'TempCtrl-DC-02');

-- Humedad
INSERT INTO sensor_readings (sensor_id, value, timestamp, quality_score)
SELECT s.id, 
       45.0 + (10 * COS(RADIANS(generate_series * 12))) + (random() * 5), 
       NOW() - INTERVAL '1 hour' * generate_series, 
       0.90 + (random() * 0.10)
FROM sensors s, generate_series(0, 47) 
WHERE s.name = 'Humedad Relativa' AND s.device_id IN (SELECT id FROM devices WHERE name = 'TempCtrl-DC-01');

INSERT INTO sensor_readings (sensor_id, value, timestamp, quality_score)
SELECT s.id, 
       48.0 + (8 * COS(RADIANS(generate_series * 12))) + (random() * 4), 
       NOW() - INTERVAL '1 hour' * generate_series, 
       0.92 + (random() * 0.08)
FROM sensors s, generate_series(0, 47) 
WHERE s.name = 'Humedad Relativa' AND s.device_id IN (SELECT id FROM devices WHERE name = 'TempCtrl-DC-02');

-- Vibración
INSERT INTO sensor_readings (sensor_id, value, timestamp, quality_score)
SELECT s.id, 
       2.5 + (0.5 * SIN(RADIANS(generate_series * 8))) + (random() * 0.8), 
       NOW() - INTERVAL '30 minutes' * generate_series, 
       0.98 + (random() * 0.02)
FROM sensors s, generate_series(0, 47) 
WHERE s.name = 'Vibración Eje X';

INSERT INTO sensor_readings (sensor_id, value, timestamp, quality_score)
SELECT s.id, 
       2.2 + (0.4 * SIN(RADIANS(generate_series * 7))) + (random() * 0.7), 
       NOW() - INTERVAL '30 minutes' * generate_series, 
       0.98 + (random() * 0.02)
FROM sensors s, generate_series(0, 47) 
WHERE s.name = 'Vibración Eje Y';

INSERT INTO sensor_readings (sensor_id, value, timestamp, quality_score)
SELECT s.id, 
       1.8 + (0.3 * SIN(RADIANS(generate_series * 6))) + (random() * 0.5), 
       NOW() - INTERVAL '30 minutes' * generate_series, 
       0.98 + (random() * 0.02)
FROM sensors s, generate_series(0, 47) 
WHERE s.name = 'Vibración Eje Z';

-- CO2
INSERT INTO sensor_readings (sensor_id, value, timestamp, quality_score)
SELECT s.id, 
       400 + (150 * SIN(RADIANS(generate_series * 10))) + (random() * 100), 
       NOW() - INTERVAL '2 hours' * generate_series, 
       0.92 + (random() * 0.08)
FROM sensors s, generate_series(0, 23) 
WHERE s.name = 'CO2 Ambiental' AND s.device_id IN (SELECT id FROM devices WHERE name = 'AirQ-OFF-01');

-- Partículas PM2.5
INSERT INTO sensor_readings (sensor_id, value, timestamp, quality_score)
SELECT s.id, 
       15 + (10 * SIN(RADIANS(generate_series * 12))) + (random() * 8), 
       NOW() - INTERVAL '2 hours' * generate_series, 
       0.93 + (random() * 0.07)
FROM sensors s, generate_series(0, 23) 
WHERE s.name = 'Partículas PM2.5' AND s.device_id IN (SELECT id FROM devices WHERE name = 'AirQ-OFF-01');

-- VOC
INSERT INTO sensor_readings (sensor_id, value, timestamp, quality_score)
SELECT s.id, 
       50 + (30 * SIN(RADIANS(generate_series * 9))) + (random() * 20), 
       NOW() - INTERVAL '2 hours' * generate_series, 
       0.94 + (random() * 0.06)
FROM sensors s, generate_series(0, 23) 
WHERE s.name = 'VOC Total';

-- Potencia
INSERT INTO sensor_readings (sensor_id, value, timestamp, quality_score)
SELECT s.id, 
       45 + (15 * SIN(RADIANS(generate_series * 20))) + (random() * 8), 
       NOW() - INTERVAL '1 hour' * generate_series, 
       0.99 + (random() * 0.01)
FROM sensors s, generate_series(0, 47) 
WHERE s.name = 'Potencia Activa' AND s.device_id IN (SELECT id FROM devices WHERE name = 'EnergyM-DC-01');

INSERT INTO sensor_readings (sensor_id, value, timestamp, quality_score)
SELECT s.id, 
       12 + (5 * SIN(RADIANS(generate_series * 18))) + (random() * 3), 
       NOW() - INTERVAL '1 hour' * generate_series, 
       0.99 + (random() * 0.01)
FROM sensors s, generate_series(0, 47) 
WHERE s.name = 'Potencia Activa' AND s.device_id IN (SELECT id FROM devices WHERE name = 'EnergyM-OFF-01');

-- Voltaje
INSERT INTO sensor_readings (sensor_id, value, timestamp, quality_score)
SELECT s.id, 
       230 + (5 * SIN(RADIANS(generate_series * 25))) + (random() * 3), 
       NOW() - INTERVAL '1 hour' * generate_series, 
       0.99 + (random() * 0.01)
FROM sensors s, generate_series(0, 47) 
WHERE s.name = 'Voltaje L1';

-- Corriente
INSERT INTO sensor_readings (sensor_id, value, timestamp, quality_score)
SELECT s.id, 
       35 + (10 * SIN(RADIANS(generate_series * 22))) + (random() * 5), 
       NOW() - INTERVAL '1 hour' * generate_series, 
       0.99 + (random() * 0.01)
FROM sensors s, generate_series(0, 47) 
WHERE s.name = 'Corriente L1';

-- Flujo de agua
INSERT INTO sensor_readings (sensor_id, value, timestamp, quality_score)
SELECT s.id, 
       25 + (8 * SIN(RADIANS(generate_series * 15))) + (random() * 5), 
       NOW() - INTERVAL '1 hour' * generate_series, 
       0.97 + (random() * 0.03)
FROM sensors s, generate_series(0, 47) 
WHERE s.name = 'Flujo Instantáneo' AND s.device_id IN (SELECT id FROM devices WHERE name = 'WaterFlow-ALM-01');

-- Insertar alertas variadas
INSERT INTO alerts (device_id, severity, message, alert_type, status, created_at)
SELECT d.id, 'high', 'Temperatura por encima del umbral recomendado (26.5°C)', 'threshold_exceeded', 'active', NOW() - INTERVAL '3 hours'
FROM devices d WHERE d.name = 'TempCtrl-DC-01';

INSERT INTO alerts (device_id, severity, message, alert_type, status, resolved_at, created_at)
SELECT d.id, 'medium', 'Vibración anómala detectada en eje X', 'anomaly_detected', 'resolved', NOW() - INTERVAL '2 hours', NOW() - INTERVAL '8 hours'
FROM devices d WHERE d.name = 'VibMon-IND-01';

INSERT INTO alerts (device_id, severity, message, alert_type, status, created_at)
SELECT d.id, 'critical', 'Dispositivo sin comunicación desde hace 2 horas', 'connection_lost', 'active', NOW() - INTERVAL '2 hours'
FROM devices d WHERE d.name = 'AirQ-LAB-01';

INSERT INTO alerts (device_id, severity, message, alert_type, status, created_at)
SELECT d.id, 'critical', 'Dispositivo fuera de línea - revisión urgente requerida', 'connection_lost', 'active', NOW() - INTERVAL '3 hours'
FROM devices d WHERE d.name = 'VibMon-IND-02';

INSERT INTO alerts (device_id, severity, message, alert_type, status, created_at)
SELECT d.id, 'high', 'Nivel de CO2 elevado (750 ppm)', 'threshold_exceeded', 'active', NOW() - INTERVAL '1 hour'
FROM devices d WHERE d.name = 'AirQ-OFF-01';

INSERT INTO alerts (device_id, severity, message, alert_type, status, created_at)
SELECT d.id, 'critical', 'Error en sensor de flujo - lecturas inconsistentes', 'sensor_error', 'active', NOW() - INTERVAL '6 hours'
FROM devices d WHERE d.name = 'WaterFlow-IND-01';

INSERT INTO alerts (device_id, severity, message, alert_type, status, resolved_at, created_at)
SELECT d.id, 'low', 'Actualización de firmware disponible', 'firmware_update', 'dismissed', NOW() - INTERVAL '1 day', NOW() - INTERVAL '5 days'
FROM devices d WHERE d.name = 'Gateway-DC-01';

INSERT INTO alerts (device_id, severity, message, alert_type, status, created_at)
SELECT d.id, 'medium', 'Consumo energético 15% por encima del promedio', 'threshold_exceeded', 'active', NOW() - INTERVAL '4 hours'
FROM devices d WHERE d.name = 'EnergyM-DC-01';

-- Insertar registros de mantenimiento variados
INSERT INTO maintenance_logs (device_id, technician_id, maintenance_type, description, status, scheduled_date, completed_date, cost)
SELECT 
    d.id, u.id, 'preventive', 
    'Calibración trimestral de sensores y actualización de firmware', 
    'completed', 
    NOW() - INTERVAL '5 days', 
    NOW() - INTERVAL '5 days' + INTERVAL '2 hours',
    150.00
FROM devices d, users u 
WHERE d.name = 'TempCtrl-DC-01' AND u.name = 'Luis García';

INSERT INTO maintenance_logs (device_id, technician_id, maintenance_type, description, status, scheduled_date, cost)
SELECT 
    d.id, u.id, 'corrective', 
    'Revisión de módulo de comunicación WiFi', 
    'scheduled', 
    NOW() + INTERVAL '2 days',
    200.00
FROM devices d, users u 
WHERE d.name = 'AirQ-LAB-01' AND u.name = 'Luis García';

INSERT INTO maintenance_logs (device_id, technician_id, maintenance_type, description, status, scheduled_date, completed_date, cost, parts_replaced)
SELECT 
    d.id, u.id, 'corrective', 
    'Reemplazo de sensor de vibración defectuoso', 
    'completed', 
    NOW() - INTERVAL '10 days', 
    NOW() - INTERVAL '10 days' + INTERVAL '3 hours',
    320.00,
    ARRAY['Sensor acelerómetro MEMS', 'Cable blindado']
FROM devices d, users u 
WHERE d.name = 'VibMon-IND-01' AND u.name = 'Luis García';

INSERT INTO maintenance_logs (device_id, technician_id, maintenance_type, description, status, scheduled_date)
SELECT 
    d.id, u.id, 'preventive', 
    'Mantenimiento preventivo mensual - limpieza de sensores', 
    'scheduled', 
    NOW() + INTERVAL '1 week'
FROM devices d, users u 
WHERE d.name = 'TempCtrl-DC-02' AND u.name = 'Pedro Sánchez';

INSERT INTO maintenance_logs (device_id, technician_id, maintenance_type, description, status, scheduled_date, completed_date, cost)
SELECT 
    d.id, u.id, 'upgrade', 
    'Actualización de firmware a versión 2.1.0', 
    'completed', 
    NOW() - INTERVAL '3 days', 
    NOW() - INTERVAL '3 days' + INTERVAL '1 hour',
    0.00
FROM devices d, users u 
WHERE d.name = 'Gateway-DC-01' AND u.name = 'Pedro Sánchez';

INSERT INTO maintenance_logs (device_id, technician_id, maintenance_type, description, status, scheduled_date)
SELECT 
    d.id, u.id, 'emergency', 
    'Reparación urgente - dispositivo no responde', 
    'in_progress', 
    NOW()
FROM devices d, users u 
WHERE d.name = 'VibMon-IND-02' AND u.name = 'Luis García';

INSERT INTO maintenance_logs (device_id, technician_id, maintenance_type, description, status, scheduled_date, completed_date, cost, parts_replaced)
SELECT 
    d.id, u.id, 'corrective', 
    'Reemplazo de sensor de flujo', 
    'completed', 
    NOW() - INTERVAL '7 days', 
    NOW() - INTERVAL '7 days' + INTERVAL '4 hours',
    450.00,
    ARRAY['Sensor de flujo', 'Empaquetaduras']
FROM devices d, users u 
WHERE d.name = 'WaterFlow-IND-01' AND u.name = 'Pedro Sánchez';

INSERT INTO maintenance_logs (device_id, technician_id, maintenance_type, description, status, scheduled_date, completed_date, cost)
SELECT 
    d.id, u.id, 'preventive', 
    'Inspección y calibración de sensores de calidad de aire', 
    'completed', 
    NOW() - INTERVAL '15 days', 
    NOW() - INTERVAL '15 days' + INTERVAL '2 hours',
    180.00
FROM devices d, users u 
WHERE d.name = 'AirQ-OFF-01' AND u.name = 'Luis García';

-- =====================================================
-- FIN DEL SCRIPT DE DATOS
-- =====================================================

-- Mostrar resumen de datos insertados
SELECT 
    'users' as tabla, COUNT(*) as registros FROM users
UNION ALL
SELECT 'locations', COUNT(*) FROM locations
UNION ALL
SELECT 'device_types', COUNT(*) FROM device_types
UNION ALL
SELECT 'iot_projects', COUNT(*) FROM iot_projects
UNION ALL
SELECT 'firmware_versions', COUNT(*) FROM firmware_versions
UNION ALL
SELECT 'devices', COUNT(*) FROM devices
UNION ALL
SELECT 'sensors', COUNT(*) FROM sensors
UNION ALL
SELECT 'sensor_readings', COUNT(*) FROM sensor_readings
UNION ALL
SELECT 'alerts', COUNT(*) FROM alerts
UNION ALL
SELECT 'maintenance_logs', COUNT(*) FROM maintenance_logs
ORDER BY tabla;