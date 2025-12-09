-- Sistema de Gestión IoT - Microsoft SQL Server
-- 10 Tablas Normalizadas 3FN

CREATE DATABASE IoTManagement;
GO

USE IoTManagement;
GO

DROP TABLE IF EXISTS sensor_readings;
DROP TABLE IF EXISTS alerts;
DROP TABLE IF EXISTS maintenance_logs;
DROP TABLE IF EXISTS sensors;
DROP TABLE IF EXISTS devices;
DROP TABLE IF EXISTS firmware_versions;
DROP TABLE IF EXISTS iot_projects;
DROP TABLE IF EXISTS device_types;
DROP TABLE IF EXISTS locations;
DROP TABLE IF EXISTS users;
GO

CREATE TABLE users (
    id BIGINT IDENTITY(1,1) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('admin', 'engineer', 'technician', 'operator')),
    created_at DATETIME2 DEFAULT GETDATE(),
    updated_at DATETIME2 DEFAULT GETDATE()
);

CREATE TABLE locations (
    id BIGINT IDENTITY(1,1) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    address VARCHAR(255) NOT NULL,
    city VARCHAR(100) NOT NULL,
    country VARCHAR(100) NOT NULL,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    created_at DATETIME2 DEFAULT GETDATE()
);

CREATE TABLE device_types (
    id BIGINT IDENTITY(1,1) PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    description NVARCHAR(MAX),
    manufacturer VARCHAR(100),
    specifications NVARCHAR(MAX),
    created_at DATETIME2 DEFAULT GETDATE()
);

CREATE TABLE iot_projects (
    id BIGINT IDENTITY(1,1) PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    description NVARCHAR(MAX),
    status VARCHAR(50) NOT NULL CHECK (status IN ('active', 'inactive', 'completed', 'suspended')),
    start_date DATE NOT NULL,
    end_date DATE,
    budget DECIMAL(15, 2),
    created_at DATETIME2 DEFAULT GETDATE(),
    updated_at DATETIME2 DEFAULT GETDATE()
);

CREATE TABLE firmware_versions (
    id BIGINT IDENTITY(1,1) PRIMARY KEY,
    device_type_id BIGINT NOT NULL,
    version VARCHAR(50) NOT NULL,
    release_date DATE NOT NULL,
    release_notes NVARCHAR(MAX),
    download_url VARCHAR(500),
    is_stable BIT DEFAULT 1,
    created_at DATETIME2 DEFAULT GETDATE(),
    CONSTRAINT FK_firmware_device_type FOREIGN KEY (device_type_id) REFERENCES device_types(id) ON DELETE CASCADE,
    CONSTRAINT UQ_firmware_version UNIQUE(device_type_id, version)
);

CREATE TABLE devices (
    id BIGINT IDENTITY(1,1) PRIMARY KEY,
    project_id BIGINT NOT NULL,
    device_type_id BIGINT NOT NULL,
    location_id BIGINT,
    name VARCHAR(150) NOT NULL,
    mac_address VARCHAR(17) UNIQUE NOT NULL,
    ip_address VARCHAR(45),
    status VARCHAR(50) NOT NULL CHECK (status IN ('online', 'offline', 'maintenance', 'error')),
    firmware_version VARCHAR(50),
    last_seen DATETIME2,
    created_at DATETIME2 DEFAULT GETDATE(),
    updated_at DATETIME2 DEFAULT GETDATE(),
    CONSTRAINT FK_devices_project FOREIGN KEY (project_id) REFERENCES iot_projects(id) ON DELETE CASCADE,
    CONSTRAINT FK_devices_type FOREIGN KEY (device_type_id) REFERENCES device_types(id),
    CONSTRAINT FK_devices_location FOREIGN KEY (location_id) REFERENCES locations(id) ON DELETE SET NULL
);

CREATE TABLE sensors (
    id BIGINT IDENTITY(1,1) PRIMARY KEY,
    device_id BIGINT NOT NULL,
    name VARCHAR(100) NOT NULL,
    sensor_type VARCHAR(100) NOT NULL,
    unit VARCHAR(50) NOT NULL,
    min_value DECIMAL(15, 4),
    max_value DECIMAL(15, 4),
    calibration_date DATE,
    is_active BIT DEFAULT 1,
    created_at DATETIME2 DEFAULT GETDATE(),
    CONSTRAINT FK_sensors_device FOREIGN KEY (device_id) REFERENCES devices(id) ON DELETE CASCADE
);

CREATE TABLE sensor_readings (
    id BIGINT IDENTITY(1,1) PRIMARY KEY,
    sensor_id BIGINT NOT NULL,
    value DECIMAL(15, 4) NOT NULL,
    timestamp DATETIME2 DEFAULT GETDATE(),
    quality_score DECIMAL(3, 2) CHECK (quality_score >= 0 AND quality_score <= 1),
    metadata NVARCHAR(MAX),
    CONSTRAINT FK_readings_sensor FOREIGN KEY (sensor_id) REFERENCES sensors(id) ON DELETE CASCADE
);

CREATE TABLE alerts (
    id BIGINT IDENTITY(1,1) PRIMARY KEY,
    device_id BIGINT NOT NULL,
    severity VARCHAR(50) NOT NULL CHECK (severity IN ('low', 'medium', 'high', 'critical')),
    message NVARCHAR(MAX) NOT NULL,
    alert_type VARCHAR(100) NOT NULL,
    status VARCHAR(50) NOT NULL CHECK (status IN ('active', 'acknowledged', 'resolved', 'dismissed')),
    created_at DATETIME2 DEFAULT GETDATE(),
    resolved_at DATETIME2,
    resolved_by BIGINT,
    CONSTRAINT FK_alerts_device FOREIGN KEY (device_id) REFERENCES devices(id) ON DELETE CASCADE,
    CONSTRAINT FK_alerts_resolver FOREIGN KEY (resolved_by) REFERENCES users(id)
);

CREATE TABLE maintenance_logs (
    id BIGINT IDENTITY(1,1) PRIMARY KEY,
    device_id BIGINT NOT NULL,
    technician_id BIGINT NOT NULL,
    maintenance_type VARCHAR(50) NOT NULL CHECK (maintenance_type IN ('preventive', 'corrective', 'emergency', 'upgrade')),
    description NVARCHAR(MAX) NOT NULL,
    status VARCHAR(50) NOT NULL CHECK (status IN ('scheduled', 'in_progress', 'completed', 'cancelled')),
    scheduled_date DATETIME2 NOT NULL,
    completed_date DATETIME2,
    cost DECIMAL(12, 2),
    parts_replaced NVARCHAR(MAX),
    notes NVARCHAR(MAX),
    created_at DATETIME2 DEFAULT GETDATE(),
    CONSTRAINT FK_maintenance_device FOREIGN KEY (device_id) REFERENCES devices(id) ON DELETE CASCADE,
    CONSTRAINT FK_maintenance_technician FOREIGN KEY (technician_id) REFERENCES users(id)
);
GO

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_devices_status ON devices(status);
CREATE INDEX idx_devices_project_id ON devices(project_id);
CREATE INDEX idx_devices_mac_address ON devices(mac_address);
CREATE INDEX idx_sensors_device_id ON sensors(device_id);
CREATE INDEX idx_sensor_readings_sensor_id ON sensor_readings(sensor_id);
CREATE INDEX idx_sensor_readings_timestamp ON sensor_readings(timestamp DESC);
CREATE INDEX idx_alerts_device_id ON alerts(device_id);
CREATE INDEX idx_alerts_status ON alerts(status);
CREATE INDEX idx_maintenance_device_id ON maintenance_logs(device_id);
CREATE INDEX idx_maintenance_technician_id ON maintenance_logs(technician_id);
CREATE INDEX idx_firmware_versions_device_type_id ON firmware_versions(device_type_id);
GO
