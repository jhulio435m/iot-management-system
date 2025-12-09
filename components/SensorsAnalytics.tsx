import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Gauge, TrendingUp, Filter, Search, RefreshCw } from 'lucide-react';
import { AddSensorForm } from './AddSensorForm';

interface SensorAnalytic {
  id: string;
  name: string;
  sensor_type: string;
  unit: string;
  min_value: number;
  max_value: number;
  is_active: boolean;
  calibration_date: string;
  devices: {
    name: string;
    status: string;
    iot_projects?: { name: string };
    locations?: { name: string; city: string };
  };
  stats: {
    totalReadings: number;
    avgValue: number;
    minValue: number;
    maxValue: number;
    avgQuality: number;
    readingsLast24h: number;
    lastReading: any;
  };
}

interface SensorsAnalyticsProps {
  sensors: SensorAnalytic[];
  devices?: any[];
  onAdd?: (sensor: any) => void;
  onRefresh?: () => void;
  loading?: boolean;
}

export function SensorsAnalytics({ sensors, devices = [], onAdd, onRefresh, loading }: SensorsAnalyticsProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Obtener tipos únicos
  const sensorTypes = ['all', ...new Set(sensors.map(s => s.sensor_type))];

  const filteredSensors = sensors.filter((sensor) => {
    const matchesSearch =
      sensor.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sensor.sensor_type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sensor.devices?.name?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = typeFilter === 'all' || sensor.sensor_type === typeFilter;
    const matchesStatus = statusFilter === 'all' || 
      (statusFilter === 'active' && sensor.is_active) ||
      (statusFilter === 'inactive' && !sensor.is_active);
    
    return matchesSearch && matchesType && matchesStatus;
  });

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Gauge className="h-5 w-5" />
            Análisis de Sensores ({filteredSensors.length})
          </CardTitle>
          <div className="flex items-center gap-2">
            {onRefresh && (
              <Button onClick={onRefresh} disabled={loading} variant="outline" size="sm">
                <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              </Button>
            )}
            {onAdd && devices.length > 0 && <AddSensorForm onAdd={onAdd} devices={devices} />}
          </div>
        </div>
        
        {/* Filtros */}
        <div className="flex flex-col sm:flex-row gap-3 mt-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Buscar por nombre, tipo o dispositivo..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-full sm:w-[200px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Tipo de sensor" />
            </SelectTrigger>
            <SelectContent>
              {sensorTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {type === 'all' ? 'Todos los tipos' : type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-[160px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="active">Activos</SelectItem>
              <SelectItem value="inactive">Inactivos</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {filteredSensors.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-8">
              {sensors.length === 0 
                ? 'No hay sensores registrados' 
                : 'No se encontraron sensores con los filtros aplicados'}
            </p>
          ) : (
            filteredSensors.map((sensor) => (
              <div
                key={sensor.id}
                className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-medium">{sensor.name}</h3>
                      <Badge variant={sensor.is_active ? 'default' : 'secondary'}>
                        {sensor.is_active ? 'Activo' : 'Inactivo'}
                      </Badge>
                      <Badge variant="outline">{sensor.sensor_type}</Badge>
                    </div>
                    <p className="text-sm text-gray-600">
                      Dispositivo: {sensor.devices?.name}
                    </p>
                    <p className="text-xs text-gray-500">
                      Rango: {sensor.min_value} - {sensor.max_value} {sensor.unit}
                    </p>
                    {sensor.devices?.locations && (
                      <p className="text-xs text-gray-500">
                        Ubicación: {sensor.devices.locations.name}, {sensor.devices.locations.city}
                      </p>
                    )}
                  </div>
                </div>

                {/* Estadísticas */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-3 pt-3 border-t">
                  <div className="text-center">
                    <p className="text-xs text-gray-500">Valor Promedio</p>
                    <p className="text-lg font-bold text-gray-900">
                      {sensor.stats.avgValue} {sensor.unit}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-gray-500">Total Lecturas</p>
                    <p className="text-lg font-bold text-gray-900">
                      {sensor.stats.totalReadings}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-gray-500">Últimas 24h</p>
                    <p className="text-lg font-bold text-gray-900">
                      {sensor.stats.readingsLast24h}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-gray-500">Calidad Promedio</p>
                    <p className="text-lg font-bold text-gray-900">
                      {(parseFloat(sensor.stats.avgQuality) * 100).toFixed(0)}%
                    </p>
                  </div>
                </div>

                {sensor.stats.lastReading && (
                  <div className="mt-3 p-2 bg-gray-50 rounded text-xs text-gray-600">
                    Última lectura: {sensor.stats.lastReading.value} {sensor.unit} - {' '}
                    {new Date(sensor.stats.lastReading.timestamp).toLocaleString('es-ES')}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}