import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { MapPin, Server, AlertCircle, Search, RefreshCw } from 'lucide-react';
import { AddLocationForm } from './AddLocationForm';

interface LocationStat {
  id: string;
  name: string;
  address: string;
  city: string;
  country: string;
  devices: any[];
  stats: {
    totalDevices: number;
    onlineDevices: number;
    offlineDevices: number;
    maintenanceDevices: number;
    errorDevices: number;
    activeAlerts: number;
    projects: string[];
  };
}

interface LocationsStatsProps {
  locations: LocationStat[];
  onAdd?: (location: any) => void;
  onRefresh?: () => void;
  loading?: boolean;
}

export function LocationsStats({ locations, onAdd, onRefresh, loading }: LocationsStatsProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredLocations = locations.filter((location) =>
    location.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    location.city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    location.country?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    location.address?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Estadísticas por Ubicación ({filteredLocations.length})
          </CardTitle>
          <div className="flex items-center gap-2">
            {onRefresh && (
              <Button onClick={onRefresh} disabled={loading} variant="outline" size="sm">
                <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              </Button>
            )}
            {onAdd && <AddLocationForm onAdd={onAdd} />}
          </div>
        </div>
        
        {/* Filtro de búsqueda */}
        <div className="relative mt-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Buscar por nombre, ciudad o país..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {filteredLocations.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-8">
              {locations.length === 0 
                ? 'No hay ubicaciones registradas' 
                : 'No se encontraron ubicaciones con los filtros aplicados'}
            </p>
          ) : (
            filteredLocations.map((location) => (
              <div
                key={location.id}
                className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <MapPin className="h-4 w-4 text-gray-500" />
                      <h3 className="font-semibold">{location.name}</h3>
                    </div>
                    <p className="text-sm text-gray-600">{location.address}</p>
                    <p className="text-xs text-gray-500">
                      {location.city}, {location.country}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-gray-900">
                      {location.stats.totalDevices}
                    </p>
                    <p className="text-xs text-gray-500">dispositivos</p>
                  </div>
                </div>

                {/* Estadísticas */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mt-4">
                  <div className="bg-green-50 p-3 rounded-lg text-center">
                    <p className="text-xs text-green-900 mb-1">Online</p>
                    <p className="text-xl font-bold text-green-700">
                      {location.stats.onlineDevices}
                    </p>
                  </div>

                  <div className="bg-red-50 p-3 rounded-lg text-center">
                    <p className="text-xs text-red-900 mb-1">Offline</p>
                    <p className="text-xl font-bold text-red-700">
                      {location.stats.offlineDevices}
                    </p>
                  </div>

                  <div className="bg-yellow-50 p-3 rounded-lg text-center">
                    <p className="text-xs text-yellow-900 mb-1">Mantenim.</p>
                    <p className="text-xl font-bold text-yellow-700">
                      {location.stats.maintenanceDevices}
                    </p>
                  </div>

                  <div className="bg-orange-50 p-3 rounded-lg text-center">
                    <p className="text-xs text-orange-900 mb-1">Error</p>
                    <p className="text-xl font-bold text-orange-700">
                      {location.stats.errorDevices}
                    </p>
                  </div>

                  <div className="bg-purple-50 p-3 rounded-lg text-center">
                    <AlertCircle className="h-4 w-4 text-purple-600 mx-auto mb-1" />
                    <p className="text-xl font-bold text-purple-700">
                      {location.stats.activeAlerts}
                    </p>
                    <p className="text-xs text-purple-600">alertas</p>
                  </div>
                </div>

                {/* Proyectos */}
                {location.stats.projects.length > 0 && (
                  <div className="mt-3">
                    <p className="text-xs text-gray-600 mb-2">Proyectos en esta ubicación:</p>
                    <div className="flex flex-wrap gap-1">
                      {location.stats.projects.map((project, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs">
                          {project}
                        </Badge>
                      ))}
                    </div>
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