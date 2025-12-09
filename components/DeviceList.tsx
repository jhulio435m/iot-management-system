import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Server, Search, Filter, RefreshCw, MapPin } from 'lucide-react';
import { AddDeviceForm } from './AddDeviceForm';

interface Device {
  id: string;
  name: string;
  status: string;
  mac_address: string;
  ip_address?: string;
  iot_projects?: { name: string };
  device_types?: { name: string };
  locations?: { name: string; address: string };
}

interface DeviceListProps {
  devices: Device[];
  projects?: any[];
  deviceTypes?: any[];
  locations?: any[];
  onAddDevice?: (device: any) => Promise<void>;
  onRefresh?: () => void;
  loading?: boolean;
}

export function DeviceList({ devices, projects = [], deviceTypes = [], locations = [], onAddDevice, onRefresh, loading }: DeviceListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newDevice, setNewDevice] = useState({
    name: '',
    mac_address: '',
    ip_address: '',
    status: 'offline',
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online':
        return 'bg-green-500';
      case 'offline':
        return 'bg-red-500';
      case 'maintenance':
        return 'bg-yellow-500';
      case 'error':
        return 'bg-orange-500';
      default:
        return 'bg-gray-500';
    }
  };

  const filteredDevices = devices.filter((device) => {
    const matchesSearch =
      device.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      device.mac_address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      device.device_types?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      device.iot_projects?.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || device.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handleAddDevice = async () => {
    if (onAddDevice && newDevice.name && newDevice.mac_address) {
      await onAddDevice(newDevice);
      setNewDevice({ name: '', mac_address: '', ip_address: '', status: 'offline' });
      setIsDialogOpen(false);
    }
  };

  const statusOptions = [
    { value: 'all', label: 'Todos los estados' },
    { value: 'online', label: 'En línea' },
    { value: 'offline', label: 'Desconectado' },
    { value: 'maintenance', label: 'Mantenimiento' },
    { value: 'error', label: 'Error' },
  ];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Server className="h-5 w-5" />
            Dispositivos IoT ({filteredDevices.length})
          </CardTitle>
          <div className="flex items-center gap-2">
            {onRefresh && (
              <Button onClick={onRefresh} disabled={loading} variant="outline" size="sm">
                <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              </Button>
            )}
            {onAddDevice && projects.length > 0 && deviceTypes.length > 0 && (
              <AddDeviceForm 
                onAdd={onAddDevice} 
                projects={projects}
                deviceTypes={deviceTypes}
                locations={locations}
              />
            )}
          </div>
        </div>
        
        {/* Filtros */}
        <div className="flex flex-col sm:flex-row gap-3 mt-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Buscar por nombre, MAC, tipo o proyecto..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-[200px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {statusOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {filteredDevices.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-8">
              {devices.length === 0 
                ? 'No hay dispositivos registrados' 
                : 'No se encontraron dispositivos con los filtros aplicados'}
            </p>
          ) : (
            filteredDevices.map((device) => (
              <div
                key={device.id}
                className="flex items-start justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${getStatusColor(device.status)}`} />
                    <div>
                      <p className="font-medium">{device.name}</p>
                      <p className="text-xs text-gray-500">{device.mac_address}</p>
                      {device.ip_address && (
                        <p className="text-xs text-gray-400">IP: {device.ip_address}</p>
                      )}
                    </div>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {device.device_types && (
                      <Badge variant="outline">{device.device_types.name}</Badge>
                    )}
                    {device.iot_projects && (
                      <Badge variant="secondary">{device.iot_projects.name}</Badge>
                    )}
                  </div>
                  {device.locations && (
                    <div className="mt-2 flex items-center gap-1 text-xs text-gray-600">
                      <MapPin className="h-3 w-3" />
                      <span>{device.locations.name}</span>
                    </div>
                  )}
                </div>
                <Badge
                  variant={device.status === 'online' ? 'default' : 'secondary'}
                  className={device.status === 'online' ? 'bg-green-600' : ''}
                >
                  {device.status}
                </Badge>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}