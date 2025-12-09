import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import { createClient } from "npm:@supabase/supabase-js@2";

const app = new Hono();

// Enable logger
app.use('*', logger(console.log));

// Enable CORS for all routes and methods
app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

// Initialize Supabase client
const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
);

// Health check endpoint
app.get("/make-server-5aa00d2c/health", (c) => {
  return c.json({ status: "ok" });
});

// ============= PROJECTS =============
app.get("/make-server-5aa00d2c/projects", async (c) => {
  try {
    const { data, error } = await supabase
      .from('iot_projects')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return c.json(data);
  } catch (error) {
    console.error('Error fetching projects:', error);
    return c.json({ error: String(error) }, 500);
  }
});

app.post("/make-server-5aa00d2c/projects", async (c) => {
  try {
    const body = await c.req.json();
    const { data, error } = await supabase
      .from('iot_projects')
      .insert(body)
      .select()
      .single();
    
    if (error) throw error;
    return c.json(data);
  } catch (error) {
    console.error('Error creating project:', error);
    return c.json({ error: String(error) }, 500);
  }
});

// ============= DEVICES =============
app.get("/make-server-5aa00d2c/devices", async (c) => {
  try {
    const { data, error } = await supabase
      .from('devices')
      .select(`
        *,
        iot_projects(name),
        device_types(name),
        locations(name, address)
      `)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return c.json(data);
  } catch (error) {
    console.error('Error fetching devices:', error);
    return c.json({ error: String(error) }, 500);
  }
});

app.post("/make-server-5aa00d2c/devices", async (c) => {
  try {
    const body = await c.req.json();
    const { data, error } = await supabase
      .from('devices')
      .insert(body)
      .select()
      .single();
    
    if (error) throw error;
    return c.json(data);
  } catch (error) {
    console.error('Error creating device:', error);
    return c.json({ error: String(error) }, 500);
  }
});

// ============= SENSORS =============
app.get("/make-server-5aa00d2c/sensors", async (c) => {
  try {
    const deviceId = c.req.query('device_id');
    let query = supabase
      .from('sensors')
      .select(`
        *,
        devices(name)
      `);
    
    if (deviceId) {
      query = query.eq('device_id', deviceId);
    }
    
    const { data, error } = await query.order('created_at', { ascending: false });
    
    if (error) throw error;
    return c.json(data);
  } catch (error) {
    console.error('Error fetching sensors:', error);
    return c.json({ error: String(error) }, 500);
  }
});

// ============= SENSOR READINGS =============
app.get("/make-server-5aa00d2c/readings", async (c) => {
  try {
    const sensorId = c.req.query('sensor_id');
    const limit = c.req.query('limit') || '100';
    
    let query = supabase
      .from('sensor_readings')
      .select(`
        *,
        sensors(name, unit, sensor_type, devices(name))
      `)
      .order('timestamp', { ascending: false })
      .limit(parseInt(limit));
    
    if (sensorId) {
      query = query.eq('sensor_id', sensorId);
    }
    
    const { data, error } = await query;
    
    if (error) throw error;
    return c.json(data);
  } catch (error) {
    console.error('Error fetching sensor readings:', error);
    return c.json({ error: String(error) }, 500);
  }
});

app.post("/make-server-5aa00d2c/readings", async (c) => {
  try {
    const body = await c.req.json();
    const { data, error } = await supabase
      .from('sensor_readings')
      .insert(body)
      .select()
      .single();
    
    if (error) throw error;
    return c.json(data);
  } catch (error) {
    console.error('Error creating sensor reading:', error);
    return c.json({ error: String(error) }, 500);
  }
});

// ============= ALERTS =============
app.get("/make-server-5aa00d2c/alerts", async (c) => {
  try {
    const { data, error } = await supabase
      .from('alerts')
      .select(`
        *,
        devices(name, iot_projects(name))
      `)
      .order('created_at', { ascending: false })
      .limit(50);
    
    if (error) throw error;
    return c.json(data);
  } catch (error) {
    console.error('Error fetching alerts:', error);
    return c.json({ error: String(error) }, 500);
  }
});

app.put("/make-server-5aa00d2c/alerts/:id", async (c) => {
  try {
    const id = c.req.param('id');
    const body = await c.req.json();
    const { data, error } = await supabase
      .from('alerts')
      .update(body)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return c.json(data);
  } catch (error) {
    console.error('Error updating alert:', error);
    return c.json({ error: String(error) }, 500);
  }
});

// ============= MAINTENANCE LOGS =============
app.get("/make-server-5aa00d2c/maintenance", async (c) => {
  try {
    const { data, error } = await supabase
      .from('maintenance_logs')
      .select(`
        *,
        devices(name),
        users(name)
      `)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return c.json(data);
  } catch (error) {
    console.error('Error fetching maintenance logs:', error);
    return c.json({ error: String(error) }, 500);
  }
});

app.post("/make-server-5aa00d2c/maintenance", async (c) => {
  try {
    const body = await c.req.json();
    const { data, error } = await supabase
      .from('maintenance_logs')
      .insert(body)
      .select()
      .single();
    
    if (error) throw error;
    return c.json(data);
  } catch (error) {
    console.error('Error creating maintenance log:', error);
    return c.json({ error: String(error) }, 500);
  }
});

// ============= STATISTICS =============
app.get("/make-server-5aa00d2c/stats", async (c) => {
  try {
    const [projectsCount, devicesCount, sensorsCount, activeAlerts] = await Promise.all([
      supabase.from('iot_projects').select('*', { count: 'exact', head: true }),
      supabase.from('devices').select('*', { count: 'exact', head: true }),
      supabase.from('sensors').select('*', { count: 'exact', head: true }),
      supabase.from('alerts').select('*', { count: 'exact', head: true }).eq('status', 'active'),
    ]);

    return c.json({
      projects: projectsCount.count || 0,
      devices: devicesCount.count || 0,
      sensors: sensorsCount.count || 0,
      activeAlerts: activeAlerts.count || 0,
    });
  } catch (error) {
    console.error('Error fetching statistics:', error);
    return c.json({ error: String(error) }, 500);
  }
});

// ============= DEVICE TYPES =============
app.get("/make-server-5aa00d2c/device-types", async (c) => {
  try {
    const { data, error } = await supabase
      .from('device_types')
      .select('*')
      .order('name');
    
    if (error) throw error;
    return c.json(data);
  } catch (error) {
    console.error('Error fetching device types:', error);
    return c.json({ error: String(error) }, 500);
  }
});

// ============= LOCATIONS =============
app.get("/make-server-5aa00d2c/locations", async (c) => {
  try {
    const { data, error } = await supabase
      .from('locations')
      .select('*')
      .order('name');
    
    if (error) throw error;
    return c.json(data);
  } catch (error) {
    console.error('Error fetching locations:', error);
    return c.json({ error: String(error) }, 500);
  }
});

// ============= USERS =============
app.get("/make-server-5aa00d2c/users", async (c) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .order('name');
    
    if (error) throw error;
    return c.json(data);
  } catch (error) {
    console.error('Error fetching users:', error);
    return c.json({ error: String(error) }, 500);
  }
});

// ============= FIRMWARE VERSIONS =============
app.get("/make-server-5aa00d2c/firmware", async (c) => {
  try {
    const { data, error } = await supabase
      .from('firmware_versions')
      .select(`
        *,
        device_types(name)
      `)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return c.json(data);
  } catch (error) {
    console.error('Error fetching firmware versions:', error);
    return c.json({ error: String(error) }, 500);
  }
});

// ============= ADVANCED QUERIES =============

// Resumen completo por proyecto (JOIN múltiple + agregación)
app.get("/make-server-5aa00d2c/projects/summary", async (c) => {
  try {
    const { data, error } = await supabase.rpc('get_projects_summary');
    
    if (error) {
      // Si la función RPC no existe, usar query directo
      const { data: projects, error: projectError } = await supabase
        .from('iot_projects')
        .select(`
          id,
          name,
          description,
          status,
          budget,
          start_date,
          devices (
            id,
            name,
            status,
            device_types (name),
            sensors (
              id,
              name
            )
          )
        `)
        .order('created_at', { ascending: false });
      
      if (projectError) throw projectError;
      
      // Procesar datos para agregar estadísticas
      const summaryData = await Promise.all(projects.map(async (project) => {
        const devices = project.devices || [];
        const deviceIds = devices.map(d => d.id);
        
        // Contar alertas activas para este proyecto
        const { count: alertsCount } = await supabase
          .from('alerts')
          .select('*', { count: 'exact', head: true })
          .in('device_id', deviceIds.length > 0 ? deviceIds : ['00000000-0000-0000-0000-000000000000'])
          .eq('status', 'active');
        
        // Contar mantenimientos
        const { count: maintenanceCount } = await supabase
          .from('maintenance_logs')
          .select('*', { count: 'exact', head: true })
          .in('device_id', deviceIds.length > 0 ? deviceIds : ['00000000-0000-0000-0000-000000000000']);
        
        const totalDevices = devices.length;
        const totalSensors = devices.reduce((sum, d) => sum + (d.sensors?.length || 0), 0);
        const onlineDevices = devices.filter(d => d.status === 'online').length;
        
        return {
          ...project,
          stats: {
            totalDevices,
            totalSensors,
            onlineDevices,
            offlineDevices: totalDevices - onlineDevices,
            activeAlerts: alertsCount || 0,
            maintenanceRecords: maintenanceCount || 0,
            deviceTypes: [...new Set(devices.map(d => d.device_types?.name).filter(Boolean))]
          }
        };
      }));
      
      return c.json(summaryData);
    }
    
    return c.json(data);
  } catch (error) {
    console.error('Error fetching projects summary:', error);
    return c.json({ error: String(error) }, 500);
  }
});

// Ubicaciones con estadísticas de dispositivos
app.get("/make-server-5aa00d2c/locations/stats", async (c) => {
  try {
    const { data: locations, error } = await supabase
      .from('locations')
      .select(`
        id,
        name,
        address,
        city,
        country,
        devices (
          id,
          name,
          status,
          device_types (name),
          iot_projects (name)
        )
      `)
      .order('name');
    
    if (error) throw error;
    
    // Agregar estadísticas de alertas por ubicación
    const locationsWithStats = await Promise.all(locations.map(async (location) => {
      const devices = location.devices || [];
      const deviceIds = devices.map(d => d.id);
      
      const { count: alertsCount } = await supabase
        .from('alerts')
        .select('*', { count: 'exact', head: true })
        .in('device_id', deviceIds.length > 0 ? deviceIds : ['00000000-0000-0000-0000-000000000000'])
        .eq('status', 'active');
      
      return {
        ...location,
        stats: {
          totalDevices: devices.length,
          onlineDevices: devices.filter(d => d.status === 'online').length,
          offlineDevices: devices.filter(d => d.status === 'offline').length,
          maintenanceDevices: devices.filter(d => d.status === 'maintenance').length,
          errorDevices: devices.filter(d => d.status === 'error').length,
          activeAlerts: alertsCount || 0,
          projects: [...new Set(devices.map(d => d.iot_projects?.name).filter(Boolean))]
        }
      };
    }));
    
    return c.json(locationsWithStats);
  } catch (error) {
    console.error('Error fetching locations stats:', error);
    return c.json({ error: String(error) }, 500);
  }
});

// Técnicos con historial de trabajo
app.get("/make-server-5aa00d2c/technicians/performance", async (c) => {
  try {
    const { data: technicians, error } = await supabase
      .from('users')
      .select(`
        id,
        name,
        email,
        role,
        maintenance_logs (
          id,
          maintenance_type,
          status,
          cost,
          created_at,
          completed_date,
          devices (name, device_types (name))
        )
      `)
      .in('role', ['technician', 'engineer'])
      .order('name');
    
    if (error) throw error;
    
    const performance = technicians.map(tech => {
      const logs = tech.maintenance_logs || [];
      const completed = logs.filter(l => l.status === 'completed');
      const inProgress = logs.filter(l => l.status === 'in_progress');
      const scheduled = logs.filter(l => l.status === 'scheduled');
      
      const totalCost = completed.reduce((sum, l) => sum + (parseFloat(l.cost) || 0), 0);
      
      // Calcular tiempo promedio de resolución
      const avgResolutionTime = completed.length > 0
        ? completed.reduce((sum, l) => {
            if (l.created_at && l.completed_date) {
              const start = new Date(l.created_at);
              const end = new Date(l.completed_date);
              return sum + (end.getTime() - start.getTime()) / (1000 * 60 * 60); // horas
            }
            return sum;
          }, 0) / completed.length
        : 0;
      
      return {
        id: tech.id,
        name: tech.name,
        email: tech.email,
        role: tech.role,
        stats: {
          totalTasks: logs.length,
          completedTasks: completed.length,
          inProgressTasks: inProgress.length,
          scheduledTasks: scheduled.length,
          totalCost: totalCost.toFixed(2),
          avgResolutionTimeHours: avgResolutionTime.toFixed(2),
          maintenanceByType: {
            preventive: logs.filter(l => l.maintenance_type === 'preventive').length,
            corrective: logs.filter(l => l.maintenance_type === 'corrective').length,
            emergency: logs.filter(l => l.maintenance_type === 'emergency').length,
            upgrade: logs.filter(l => l.maintenance_type === 'upgrade').length
          }
        },
        recentTasks: logs.slice(0, 5)
      };
    });
    
    return c.json(performance);
  } catch (error) {
    console.error('Error fetching technicians performance:', error);
    return c.json({ error: String(error) }, 500);
  }
});

// Análisis de sensores con estadísticas
app.get("/make-server-5aa00d2c/sensors/analytics", async (c) => {
  try {
    const { data: sensors, error } = await supabase
      .from('sensors')
      .select(`
        id,
        name,
        sensor_type,
        unit,
        min_value,
        max_value,
        is_active,
        calibration_date,
        devices (
          name,
          status,
          iot_projects (name),
          locations (name, city)
        )
      `)
      .order('name');
    
    if (error) throw error;
    
    // Obtener estadísticas de lecturas para cada sensor
    const analytics = await Promise.all(sensors.map(async (sensor) => {
      const { data: readings, error: readingsError } = await supabase
        .from('sensor_readings')
        .select('value, quality_score, timestamp')
        .eq('sensor_id', sensor.id)
        .order('timestamp', { ascending: false })
        .limit(100);
      
      if (readingsError) {
        return {
          ...sensor,
          stats: {
            totalReadings: 0,
            avgValue: 0,
            minValue: 0,
            maxValue: 0,
            avgQuality: 0,
            lastReading: null
          }
        };
      }
      
      const values = readings.map(r => parseFloat(r.value));
      const qualities = readings.map(r => parseFloat(r.quality_score));
      
      return {
        ...sensor,
        stats: {
          totalReadings: readings.length,
          avgValue: values.length > 0 ? (values.reduce((a, b) => a + b, 0) / values.length).toFixed(2) : 0,
          minValue: values.length > 0 ? Math.min(...values).toFixed(2) : 0,
          maxValue: values.length > 0 ? Math.max(...values).toFixed(2) : 0,
          avgQuality: qualities.length > 0 ? (qualities.reduce((a, b) => a + b, 0) / qualities.length).toFixed(3) : 0,
          lastReading: readings[0] || null,
          readingsLast24h: readings.filter(r => {
            const readingTime = new Date(r.timestamp);
            const now = new Date();
            return (now.getTime() - readingTime.getTime()) < 24 * 60 * 60 * 1000;
          }).length
        }
      };
    }));
    
    return c.json(analytics);
  } catch (error) {
    console.error('Error fetching sensors analytics:', error);
    return c.json({ error: String(error) }, 500);
  }
});

// Dispositivos por tipo de firmware
app.get("/make-server-5aa00d2c/firmware/devices", async (c) => {
  try {
    const { data: firmwareVersions, error } = await supabase
      .from('firmware_versions')
      .select(`
        id,
        version,
        release_date,
        release_notes,
        is_stable,
        device_types (
          id,
          name,
          manufacturer
        )
      `)
      .order('release_date', { ascending: false });
    
    if (error) throw error;
    
    // Para cada versión de firmware, contar dispositivos que la usan
    const firmwareWithDevices = await Promise.all(firmwareVersions.map(async (fw) => {
      const { data: devices, error: devicesError } = await supabase
        .from('devices')
        .select(`
          id,
          name,
          status,
          firmware_version,
          iot_projects (name),
          locations (name, city)
        `)
        .eq('device_type_id', fw.device_types.id)
        .eq('firmware_version', fw.version);
      
      if (devicesError) {
        return {
          ...fw,
          devicesCount: 0,
          devices: []
        };
      }
      
      return {
        ...fw,
        devicesCount: devices.length,
        devices: devices,
        onlineDevices: devices.filter(d => d.status === 'online').length
      };
    }));
    
    return c.json(firmwareWithDevices);
  } catch (error) {
    console.error('Error fetching firmware devices:', error);
    return c.json({ error: String(error) }, 500);
  }
});

// Alertas con contexto completo
app.get("/make-server-5aa00d2c/alerts/detailed", async (c) => {
  try {
    const status = c.req.query('status') || 'active';
    
    const { data, error } = await supabase
      .from('alerts')
      .select(`
        *,
        devices (
          name,
          status,
          mac_address,
          device_types (name),
          iot_projects (name, description),
          locations (name, address, city)
        ),
        users:resolved_by (
          name,
          email
        )
      `)
      .eq('status', status)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return c.json(data);
  } catch (error) {
    console.error('Error fetching detailed alerts:', error);
    return c.json({ error: String(error) }, 500);
  }
});

// Dashboard mejorado con métricas avanzadas
app.get("/make-server-5aa00d2c/dashboard/metrics", async (c) => {
  try {
    // Ejecutar múltiples queries en paralelo
    const [
      projectsResult,
      devicesResult,
      sensorsResult,
      alertsResult,
      readingsResult,
      maintenanceResult,
      locationsResult
    ] = await Promise.all([
      supabase.from('iot_projects').select('status', { count: 'exact' }),
      supabase.from('devices').select('status', { count: 'exact' }),
      supabase.from('sensors').select('is_active', { count: 'exact' }),
      supabase.from('alerts').select('severity, status', { count: 'exact' }),
      supabase.from('sensor_readings').select('timestamp', { count: 'exact' }).gte('timestamp', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()),
      supabase.from('maintenance_logs').select('status', { count: 'exact' }),
      supabase.from('locations').select('id', { count: 'exact' })
    ]);

    // Procesar resultados
    const projectsData = projectsResult.data || [];
    const devicesData = devicesResult.data || [];
    const alertsData = alertsResult.data || [];
    const maintenanceData = maintenanceResult.data || [];

    return c.json({
      projects: {
        total: projectsResult.count || 0,
        active: projectsData.filter(p => p.status === 'active').length,
        inactive: projectsData.filter(p => p.status === 'inactive').length,
        completed: projectsData.filter(p => p.status === 'completed').length
      },
      devices: {
        total: devicesResult.count || 0,
        online: devicesData.filter(d => d.status === 'online').length,
        offline: devicesData.filter(d => d.status === 'offline').length,
        maintenance: devicesData.filter(d => d.status === 'maintenance').length,
        error: devicesData.filter(d => d.status === 'error').length
      },
      sensors: {
        total: sensorsResult.count || 0,
        active: sensorsResult.data?.filter(s => s.is_active).length || 0
      },
      alerts: {
        total: alertsResult.count || 0,
        active: alertsData.filter(a => a.status === 'active').length,
        critical: alertsData.filter(a => a.severity === 'critical').length,
        high: alertsData.filter(a => a.severity === 'high').length,
        medium: alertsData.filter(a => a.severity === 'medium').length,
        low: alertsData.filter(a => a.severity === 'low').length
      },
      readings: {
        last24h: readingsResult.count || 0
      },
      maintenance: {
        total: maintenanceResult.count || 0,
        scheduled: maintenanceData.filter(m => m.status === 'scheduled').length,
        inProgress: maintenanceData.filter(m => m.status === 'in_progress').length,
        completed: maintenanceData.filter(m => m.status === 'completed').length
      },
      locations: {
        total: locationsResult.count || 0
      }
    });
  } catch (error) {
    console.error('Error fetching dashboard metrics:', error);
    return c.json({ error: String(error) }, 500);
  }
});

// ============= POST ENDPOINTS FOR MISSING ENTITIES =============

// POST: Add new user
app.post("/make-server-5aa00d2c/users", async (c) => {
  try {
    const body = await c.req.json();
    const { data, error } = await supabase
      .from('users')
      .insert(body)
      .select()
      .single();
    
    if (error) throw error;
    return c.json(data);
  } catch (error) {
    console.error('Error creating user:', error);
    return c.json({ error: String(error) }, 500);
  }
});

// POST: Add new device type
app.post("/make-server-5aa00d2c/device-types", async (c) => {
  try {
    const body = await c.req.json();
    const { data, error } = await supabase
      .from('device_types')
      .insert(body)
      .select()
      .single();
    
    if (error) throw error;
    return c.json(data);
  } catch (error) {
    console.error('Error creating device type:', error);
    return c.json({ error: String(error) }, 500);
  }
});

// POST: Add new location
app.post("/make-server-5aa00d2c/locations", async (c) => {
  try {
    const body = await c.req.json();
    const { data, error } = await supabase
      .from('locations')
      .insert(body)
      .select()
      .single();
    
    if (error) throw error;
    return c.json(data);
  } catch (error) {
    console.error('Error creating location:', error);
    return c.json({ error: String(error) }, 500);
  }
});

// POST: Add new sensor
app.post("/make-server-5aa00d2c/sensors", async (c) => {
  try {
    const body = await c.req.json();
    const { data, error } = await supabase
      .from('sensors')
      .insert(body)
      .select()
      .single();
    
    if (error) throw error;
    return c.json(data);
  } catch (error) {
    console.error('Error creating sensor:', error);
    return c.json({ error: String(error) }, 500);
  }
});

// POST: Add new alert
app.post("/make-server-5aa00d2c/alerts", async (c) => {
  try {
    const body = await c.req.json();
    const { data, error } = await supabase
      .from('alerts')
      .insert(body)
      .select()
      .single();
    
    if (error) throw error;
    return c.json(data);
  } catch (error) {
    console.error('Error creating alert:', error);
    return c.json({ error: String(error) }, 500);
  }
});

Deno.serve(app.fetch);