import { useEffect, useState } from 'react';
import { projectId, publicAnonKey } from './utils/supabase/info';
import { Sidebar } from './components/Sidebar';
import { DashboardGeneral } from './components/DashboardGeneral';
import { DeviceList } from './components/DeviceList';
import { SensorReadings } from './components/SensorReadings';
import { AlertsList } from './components/AlertsList';
import { MaintenanceLogs } from './components/MaintenanceLogs';
import { ProjectsSummary } from './components/ProjectsSummary';
import { LocationsStats } from './components/LocationsStats';
import { SensorsAnalytics } from './components/SensorsAnalytics';
import { Toaster } from './components/ui/sonner';
import { toast } from 'sonner';
import { RefreshCw } from 'lucide-react';
import { Button } from './components/ui/button';

const API_BASE_URL = `https://${projectId}.supabase.co/functions/v1/make-server-5aa00d2c`;

interface Stats {
  projects: number;
  devices: number;
  sensors: number;
  activeAlerts: number;
}

export default function App() {
  const [currentView, setCurrentView] = useState('dashboard');
  const [stats, setStats] = useState<Stats>({ projects: 0, devices: 0, sensors: 0, activeAlerts: 0 });
  const [devices, setDevices] = useState([]);
  const [readings, setReadings] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [maintenance, setMaintenance] = useState([]);
  const [projectsSummary, setProjectsSummary] = useState([]);
  const [locationsStats, setLocationsStats] = useState([]);
  const [sensorsAnalytics, setSensorsAnalytics] = useState([]);
  const [deviceTypes, setDeviceTypes] = useState([]);
  const [locations, setLocations] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [
        statsRes,
        devicesRes,
        readingsRes,
        alertsRes,
        maintenanceRes,
        projectsRes,
        locationsRes,
        sensorsRes,
        deviceTypesRes,
        locationsListRes,
        usersRes,
      ] = await Promise.all([
        fetch(`${API_BASE_URL}/stats`, {
          headers: { 'Authorization': `Bearer ${publicAnonKey}` },
        }),
        fetch(`${API_BASE_URL}/devices`, {
          headers: { 'Authorization': `Bearer ${publicAnonKey}` },
        }),
        fetch(`${API_BASE_URL}/readings`, {
          headers: { 'Authorization': `Bearer ${publicAnonKey}` },
        }),
        fetch(`${API_BASE_URL}/alerts`, {
          headers: { 'Authorization': `Bearer ${publicAnonKey}` },
        }),
        fetch(`${API_BASE_URL}/maintenance`, {
          headers: { 'Authorization': `Bearer ${publicAnonKey}` },
        }),
        fetch(`${API_BASE_URL}/projects/summary`, {
          headers: { 'Authorization': `Bearer ${publicAnonKey}` },
        }),
        fetch(`${API_BASE_URL}/locations/stats`, {
          headers: { 'Authorization': `Bearer ${publicAnonKey}` },
        }),
        fetch(`${API_BASE_URL}/sensors/analytics`, {
          headers: { 'Authorization': `Bearer ${publicAnonKey}` },
        }),
        fetch(`${API_BASE_URL}/device-types`, {
          headers: { 'Authorization': `Bearer ${publicAnonKey}` },
        }),
        fetch(`${API_BASE_URL}/locations`, {
          headers: { 'Authorization': `Bearer ${publicAnonKey}` },
        }),
        fetch(`${API_BASE_URL}/users`, {
          headers: { 'Authorization': `Bearer ${publicAnonKey}` },
        }),
      ]);

      const [
        statsData,
        devicesData,
        readingsData,
        alertsData,
        maintenanceData,
        projectsData,
        locationsData,
        sensorsData,
        deviceTypesData,
        locationsListData,
        usersData,
      ] = await Promise.all([
        statsRes.json(),
        devicesRes.json(),
        readingsRes.json(),
        alertsRes.json(),
        maintenanceRes.json(),
        projectsRes.json(),
        locationsRes.json(),
        sensorsRes.json(),
        deviceTypesRes.json(),
        locationsListRes.json(),
        usersRes.json(),
      ]);

      setStats(statsData);
      setDevices(devicesData);
      setReadings(readingsData);
      setAlerts(alertsData);
      setMaintenance(maintenanceData);
      setProjectsSummary(projectsData);
      setLocationsStats(locationsData);
      setSensorsAnalytics(sensorsData);
      setDeviceTypes(deviceTypesData);
      setLocations(locationsListData);
      setUsers(usersData);
    } catch (error) {
      console.error('Error fetching data:', error);
      toast.error('Error al cargar datos');
    } finally {
      setLoading(false);
    }
  };

  const handleResolveAlert = async (id: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/alerts/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: 'resolved' }),
      });

      if (!response.ok) {
        throw new Error('Error al resolver la alerta');
      }

      toast.success('Alerta resuelta correctamente');
      fetchData();
    } catch (error) {
      console.error('Error resolving alert:', error);
      toast.error('Error al resolver la alerta');
    }
  };

  const handleAddDevice = async (device: any) => {
    try {
      const response = await fetch(`${API_BASE_URL}/devices`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(device),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al agregar dispositivo');
      }

      toast.success('Dispositivo agregado correctamente');
      fetchData();
    } catch (error: any) {
      console.error('Error adding device:', error);
      toast.error(error.message || 'Error al agregar el dispositivo');
    }
  };

  const handleAddProject = async (project: any) => {
    try {
      const response = await fetch(`${API_BASE_URL}/projects`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(project),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al agregar proyecto');
      }

      toast.success('Proyecto agregado correctamente');
      fetchData();
    } catch (error: any) {
      console.error('Error adding project:', error);
      toast.error(error.message || 'Error al agregar el proyecto');
    }
  };

  const handleAddLocation = async (location: any) => {
    try {
      const response = await fetch(`${API_BASE_URL}/locations`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(location),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al agregar ubicación');
      }

      toast.success('Ubicación agregada correctamente');
      fetchData();
    } catch (error: any) {
      console.error('Error adding location:', error);
      toast.error(error.message || 'Error al agregar la ubicación');
    }
  };

  const handleAddSensor = async (sensor: any) => {
    try {
      const response = await fetch(`${API_BASE_URL}/sensors`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(sensor),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al agregar sensor');
      }

      toast.success('Sensor agregado correctamente');
      fetchData();
    } catch (error: any) {
      console.error('Error adding sensor:', error);
      toast.error(error.message || 'Error al agregar el sensor');
    }
  };

  const handleAddReading = async (reading: any) => {
    try {
      const response = await fetch(`${API_BASE_URL}/readings`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reading),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al agregar lectura');
      }

      toast.success('Lectura agregada correctamente');
      fetchData();
    } catch (error: any) {
      console.error('Error adding reading:', error);
      toast.error(error.message || 'Error al agregar la lectura');
    }
  };

  const handleAddAlert = async (alert: any) => {
    try {
      const response = await fetch(`${API_BASE_URL}/alerts`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(alert),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al agregar alerta');
      }

      toast.success('Alerta agregada correctamente');
      fetchData();
    } catch (error: any) {
      console.error('Error adding alert:', error);
      toast.error(error.message || 'Error al agregar la alerta');
    }
  };

  const handleAddMaintenance = async (maintenance: any) => {
    try {
      const response = await fetch(`${API_BASE_URL}/maintenance`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(maintenance),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al agregar mantenimiento');
      }

      toast.success('Mantenimiento agregado correctamente');
      fetchData();
    } catch (error: any) {
      console.error('Error adding maintenance:', error);
      toast.error(error.message || 'Error al agregar el mantenimiento');
    }
  };

  const handleAddUser = async (user: any) => {
    try {
      const response = await fetch(`${API_BASE_URL}/users`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al agregar usuario');
      }

      toast.success('Usuario agregado correctamente');
      fetchData();
    } catch (error: any) {
      console.error('Error adding user:', error);
      toast.error(error.message || 'Error al agregar el usuario');
    }
  };

  const handleAddDeviceType = async (deviceType: any) => {
    try {
      const response = await fetch(`${API_BASE_URL}/device-types`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(deviceType),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al agregar tipo de dispositivo');
      }

      toast.success('Tipo de dispositivo agregado correctamente');
      fetchData();
    } catch (error: any) {
      console.error('Error adding device type:', error);
      toast.error(error.message || 'Error al agregar el tipo de dispositivo');
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const renderContent = () => {
    switch (currentView) {
      case 'dashboard':
        return (
          <DashboardGeneral
            stats={stats}
            projectsSummary={projectsSummary}
            locationsStats={locationsStats}
            devices={devices}
            sensorsAnalytics={sensorsAnalytics}
            alerts={alerts}
            maintenance={maintenance}
            onRefresh={fetchData}
            loading={loading}
          />
        );
      case 'projects':
        return <ProjectsSummary projects={projectsSummary} onAdd={handleAddProject} onRefresh={fetchData} loading={loading} />;
      case 'locations':
        return <LocationsStats locations={locationsStats} onAdd={handleAddLocation} onRefresh={fetchData} loading={loading} />;
      case 'devices':
        return (
          <DeviceList 
            devices={devices} 
            projects={projectsSummary}
            deviceTypes={deviceTypes}
            locations={locations}
            onAddDevice={handleAddDevice} 
            onRefresh={fetchData} 
            loading={loading} 
          />
        );
      case 'sensors':
        return (
          <SensorsAnalytics 
            sensors={sensorsAnalytics} 
            devices={devices}
            onAdd={handleAddSensor}
            onRefresh={fetchData} 
            loading={loading} 
          />
        );
      case 'readings':
        return (
          <SensorReadings 
            readings={readings} 
            sensors={sensorsAnalytics}
            onAddReading={handleAddReading}
          />
        );
      case 'alerts':
        return (
          <AlertsList 
            alerts={alerts} 
            devices={devices}
            onAddAlert={handleAddAlert}
            onResolve={handleResolveAlert} 
          />
        );
      case 'maintenance':
        return (
          <MaintenanceLogs 
            logs={maintenance} 
            devices={devices}
            technicians={users}
            onAddMaintenance={handleAddMaintenance}
          />
        );
      default:
        return (
          <DashboardGeneral
            stats={stats}
            projectsSummary={projectsSummary}
            locationsStats={locationsStats}
            devices={devices}
            sensorsAnalytics={sensorsAnalytics}
            alerts={alerts}
            maintenance={maintenance}
            onRefresh={fetchData}
            loading={loading}
          />
        );
    }
  };

  const getViewTitle = () => {
    const titles: Record<string, string> = {
      dashboard: 'Dashboard General',
      projects: 'Proyectos IoT',
      locations: 'Ubicaciones',
      devices: 'Dispositivos',
      sensors: 'Sensores',
      readings: 'Lecturas de Sensores',
      alerts: 'Alertas y Notificaciones',
      maintenance: 'Registro de Mantenimiento',
    };
    return titles[currentView] || 'Dashboard';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-right" />
      
      {/* Sidebar */}
      <Sidebar currentView={currentView} onViewChange={setCurrentView} />

      {/* Main Content */}
      <div className="lg:pl-64">
        {/* Header - Solo se muestra en Dashboard */}
        {currentView === 'dashboard' && (
          <header className="bg-white border-b border-gray-200 sticky top-0 z-20">
            <div className="px-4 sm:px-6 lg:px-8 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">
                    {getViewTitle()}
                  </h1>
                  <p className="text-sm text-gray-600 mt-1">
                    Sistema de Gestión IoT
                  </p>
                </div>
                <Button onClick={fetchData} disabled={loading} variant="outline" size="sm">
                  <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                  Actualizar
                </Button>
              </div>
            </div>
          </header>
        )}

        {/* Content Area */}
        <main className="px-4 sm:px-6 lg:px-8 py-8">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}