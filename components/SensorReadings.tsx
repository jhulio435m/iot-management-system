import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { TrendingUp, Search } from 'lucide-react';
import { AddReadingForm } from './AddReadingForm';

interface SensorReading {
  id: string;
  value: number;
  quality_score: number;
  timestamp: string;
  sensors: {
    name: string;
    unit: string;
    sensor_type: string;
    devices: {
      name: string;
    };
  };
}

interface SensorReadingsProps {
  readings: SensorReading[];
  sensors: any[];
  onAddReading: (reading: any) => void;
}

export function SensorReadings({ readings, sensors, onAddReading }: SensorReadingsProps) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredReadings = readings.filter((reading) =>
    reading.sensors?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    reading.sensors?.sensor_type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    reading.sensors?.devices?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getQualityColor = (quality: number) => {
    if (quality >= 0.9) return 'text-green-600';
    if (quality >= 0.7) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getQualityBadge = (quality: number) => {
    if (quality >= 0.9) return { variant: 'default' as const, label: 'Excelente' };
    if (quality >= 0.7) return { variant: 'secondary' as const, label: 'Buena' };
    return { variant: 'destructive' as const, label: 'Baja' };
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Lecturas de Sensores ({filteredReadings.length})
          </CardTitle>
          <AddReadingForm sensors={sensors} onAddReading={onAddReading} />
        </div>
        
        {/* Filtro de búsqueda */}
        <div className="relative mt-4">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Buscar por sensor, tipo o dispositivo..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-2 text-sm font-medium text-gray-700">Sensor</th>
                <th className="text-left py-3 px-2 text-sm font-medium text-gray-700">Tipo</th>
                <th className="text-left py-3 px-2 text-sm font-medium text-gray-700">Dispositivo</th>
                <th className="text-right py-3 px-2 text-sm font-medium text-gray-700">Valor</th>
                <th className="text-center py-3 px-2 text-sm font-medium text-gray-700">Calidad</th>
                <th className="text-right py-3 px-2 text-sm font-medium text-gray-700">Fecha/Hora</th>
              </tr>
            </thead>
            <tbody>
              {filteredReadings.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-sm text-gray-500">
                    {readings.length === 0 
                      ? 'No hay lecturas registradas' 
                      : 'No se encontraron lecturas con los filtros aplicados'}
                  </td>
                </tr>
              ) : (
                filteredReadings.map((reading) => {
                  const qualityBadge = getQualityBadge(reading.quality_score);
                  return (
                    <tr key={reading.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-2 text-sm">
                        {reading.sensors?.name || 'N/A'}
                      </td>
                      <td className="py-3 px-2">
                        <Badge variant="outline" className="text-xs">
                          {reading.sensors?.sensor_type || 'N/A'}
                        </Badge>
                      </td>
                      <td className="py-3 px-2 text-sm text-gray-600">
                        {reading.sensors?.devices?.name || 'N/A'}
                      </td>
                      <td className="py-3 px-2 text-right font-medium">
                        {reading.value.toFixed(2)} {reading.sensors?.unit || ''}
                      </td>
                      <td className="py-3 px-2 text-center">
                        <Badge variant={qualityBadge.variant} className="text-xs">
                          {qualityBadge.label}
                        </Badge>
                      </td>
                      <td className="py-3 px-2 text-right text-xs text-gray-600">
                        {new Date(reading.timestamp).toLocaleString('es-ES')}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}