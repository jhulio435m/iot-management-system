import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { 
  FolderKanban, 
  MapPin, 
  Cpu, 
  Gauge, 
  TrendingUp, 
  AlertCircle, 
  Wrench,
  CheckCircle,
  XCircle,
  Clock,
  Activity,
  RefreshCw
} from 'lucide-react';

interface DashboardGeneralProps {
  stats: {
    projects: number;
    devices: number;
    sensors: number;
    activeAlerts: number;
  };
  projectsSummary: any[];
  locationsStats: any[];
  devices: any[];
  sensorsAnalytics: any[];
  alerts: any[];
  maintenance: any[];
  onRefresh?: () => void;
  loading?: boolean;
}

export function DashboardGeneral({
  stats,
  projectsSummary,
  locationsStats,
  devices,
  sensorsAnalytics,
  alerts,
  maintenance,
  onRefresh,
  loading,
}: DashboardGeneralProps) {
  // Calcular estadísticas adicionales
  const activeProjects = projectsSummary.filter(p => p.status === 'active').length;
  const onlineDevices = devices.filter(d => d.status === 'online').length;
  const activeSensors = sensorsAnalytics.filter(s => s.is_active).length;
  const criticalAlerts = alerts.filter(a => a.severity === 'critical' && a.status === 'active').length;
  const pendingMaintenance = maintenance.filter(m => m.status === 'scheduled').length;
  const inProgressMaintenance = maintenance.filter(m => m.status === 'in_progress').length;

  // Top 5 proyectos con más dispositivos
  const topProjects = [...projectsSummary]
    .sort((a, b) => (b.stats?.totalDevices || 0) - (a.stats?.totalDevices || 0))
    .slice(0, 5);

  // Top 5 ubicaciones con más dispositivos
  const topLocations = [...locationsStats]
    .sort((a, b) => (b.stats?.totalDevices || 0) - (a.stats?.totalDevices || 0))
    .slice(0, 5);

  // Alertas recientes
  const recentAlerts = alerts.slice(0, 5);

  // Mantenimientos próximos
  const upcomingMaintenance = maintenance
    .filter(m => m.status === 'scheduled')
    .slice(0, 5);

  return (
    <div className="space-y-6">
      {/* KPIs Principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Proyectos Activos</p>
                <p className="text-3xl font-bold text-gray-900">{activeProjects}</p>
                <p className="text-xs text-gray-500 mt-1">de {stats.projects} totales</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <FolderKanban className="h-8 w-8 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Dispositivos Online</p>
                <p className="text-3xl font-bold text-gray-900">{onlineDevices}</p>
                <p className="text-xs text-gray-500 mt-1">de {stats.devices} totales</p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <Cpu className="h-8 w-8 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Sensores Activos</p>
                <p className="text-3xl font-bold text-gray-900">{activeSensors}</p>
                <p className="text-xs text-gray-500 mt-1">de {stats.sensors} totales</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <Gauge className="h-8 w-8 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Alertas Activas</p>
                <p className="text-3xl font-bold text-gray-900">{stats.activeAlerts}</p>
                <p className="text-xs text-red-600 mt-1">{criticalAlerts} críticas</p>
              </div>
              <div className="p-3 bg-red-100 rounded-lg">
                <AlertCircle className="h-8 w-8 text-red-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Segundo nivel de KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Ubicaciones</p>
                <p className="text-2xl font-bold text-gray-900">{locationsStats.length}</p>
              </div>
              <MapPin className="h-6 w-6 text-gray-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Mantenimiento Pendiente</p>
                <p className="text-2xl font-bold text-gray-900">{pendingMaintenance}</p>
              </div>
              <Clock className="h-6 w-6 text-orange-400" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">En Mantenimiento</p>
                <p className="text-2xl font-bold text-gray-900">{inProgressMaintenance}</p>
              </div>
              <Wrench className="h-6 w-6 text-blue-400" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Gráficos y listas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Proyectos */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FolderKanban className="h-5 w-5" />
              Top 5 Proyectos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topProjects.length === 0 ? (
                <p className="text-sm text-gray-500">No hay proyectos</p>
              ) : (
                topProjects.map((project) => (
                  <div key={project.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <p className="font-medium text-sm">{project.name}</p>
                      <div className="flex gap-2 mt-1">
                        <span className="text-xs text-gray-500">
                          {project.stats?.totalDevices || 0} dispositivos
                        </span>
                        <span className="text-xs text-gray-500">•</span>
                        <span className="text-xs text-gray-500">
                          {project.stats?.totalSensors || 0} sensores
                        </span>
                      </div>
                    </div>
                    <Badge variant={project.status === 'active' ? 'default' : 'secondary'}>
                      {project.status}
                    </Badge>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Top Ubicaciones */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Top 5 Ubicaciones
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {topLocations.length === 0 ? (
                <p className="text-sm text-gray-500">No hay ubicaciones</p>
              ) : (
                topLocations.map((location) => (
                  <div key={location.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <p className="font-medium text-sm">{location.name}</p>
                      <p className="text-xs text-gray-500">{location.city}</p>
                      <div className="flex gap-2 mt-1">
                        <span className="text-xs text-green-600">
                          {location.stats?.onlineDevices || 0} online
                        </span>
                        <span className="text-xs text-red-600">
                          {location.stats?.offlineDevices || 0} offline
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold">{location.stats?.totalDevices || 0}</p>
                      <p className="text-xs text-gray-500">dispositivos</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Alertas Recientes */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5" />
              Alertas Recientes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentAlerts.length === 0 ? (
                <div className="text-center py-8">
                  <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">No hay alertas activas</p>
                </div>
              ) : (
                recentAlerts.map((alert) => (
                  <div key={alert.id} className="flex items-start gap-3 p-3 border rounded-lg">
                    <AlertCircle className={`h-5 w-5 mt-0.5 ${
                      alert.severity === 'critical' ? 'text-red-500' :
                      alert.severity === 'high' ? 'text-orange-500' :
                      alert.severity === 'medium' ? 'text-yellow-500' :
                      'text-blue-500'
                    }`} />
                    <div className="flex-1">
                      <p className="font-medium text-sm">{alert.alert_type}</p>
                      <p className="text-xs text-gray-500">{alert.devices?.name}</p>
                      <div className="flex gap-2 mt-1">
                        <Badge variant="outline" className="text-xs">
                          {alert.severity}
                        </Badge>
                        <Badge variant={alert.status === 'active' ? 'destructive' : 'secondary'} className="text-xs">
                          {alert.status}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Mantenimientos Próximos */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wrench className="h-5 w-5" />
              Mantenimientos Próximos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {upcomingMaintenance.length === 0 ? (
                <div className="text-center py-8">
                  <Activity className="h-12 w-12 text-gray-300 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">No hay mantenimientos programados</p>
                </div>
              ) : (
                upcomingMaintenance.map((maint) => (
                  <div key={maint.id} className="flex items-start gap-3 p-3 border rounded-lg">
                    <Clock className="h-5 w-5 text-orange-500 mt-0.5" />
                    <div className="flex-1">
                      <p className="font-medium text-sm">{maint.maintenance_type}</p>
                      <p className="text-xs text-gray-500">{maint.devices?.name}</p>
                      <div className="flex gap-2 mt-1">
                        <Badge variant="outline" className="text-xs">
                          {maint.status}
                        </Badge>
                        {maint.scheduled_date && (
                          <span className="text-xs text-gray-500">
                            {new Date(maint.scheduled_date).toLocaleDateString('es-ES')}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Estado de dispositivos */}
      <Card>
        <CardHeader>
          <CardTitle>Estado General de Dispositivos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-green-700">{onlineDevices}</p>
              <p className="text-sm text-gray-600">Online</p>
            </div>
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <XCircle className="h-8 w-8 text-red-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-red-700">
                {devices.filter(d => d.status === 'offline').length}
              </p>
              <p className="text-sm text-gray-600">Offline</p>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <Wrench className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-yellow-700">
                {devices.filter(d => d.status === 'maintenance').length}
              </p>
              <p className="text-sm text-gray-600">Mantenimiento</p>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <AlertCircle className="h-8 w-8 text-orange-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-orange-700">
                {devices.filter(d => d.status === 'error').length}
              </p>
              <p className="text-sm text-gray-600">Error</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Botón de refresco */}
      {onRefresh && (
        <div className="text-right">
          <Button
            variant="outline"
            onClick={onRefresh}
            disabled={loading}
          >
            {loading ? (
              <RefreshCw className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
            Refrescar
          </Button>
        </div>
      )}
    </div>
  );
}