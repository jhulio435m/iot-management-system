import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Wrench, Search, Filter } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { AddMaintenanceForm } from './AddMaintenanceForm';

interface MaintenanceLog {
  id: string;
  maintenance_type: string;
  description: string;
  status: string;
  cost: number;
  scheduled_date: string;
  completed_date: string;
  created_at: string;
  devices: {
    name: string;
  };
  users: {
    name: string;
  };
}

interface MaintenanceLogsProps {
  logs: MaintenanceLog[];
  devices: any[];
  technicians: any[];
  onAddMaintenance: (maintenance: any) => void;
}

export function MaintenanceLogs({ logs, devices, technicians, onAddMaintenance }: MaintenanceLogsProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-600';
      case 'in_progress':
        return 'bg-blue-600';
      case 'scheduled':
        return 'bg-yellow-600';
      case 'cancelled':
        return 'bg-red-600';
      default:
        return 'bg-gray-600';
    }
  };

  const filteredLogs = logs.filter((log) => {
    const matchesSearch =
      log.maintenance_type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.devices?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.users?.name?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = typeFilter === 'all' || log.maintenance_type === typeFilter;
    const matchesStatus = statusFilter === 'all' || log.status === statusFilter;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  const typeOptions = [
    { value: 'all', label: 'Todos los tipos' },
    { value: 'preventive', label: 'Preventivo' },
    { value: 'corrective', label: 'Correctivo' },
    { value: 'emergency', label: 'Emergencia' },
    { value: 'upgrade', label: 'Actualización' },
  ];

  const statusOptions = [
    { value: 'all', label: 'Todos los estados' },
    { value: 'scheduled', label: 'Programado' },
    { value: 'in_progress', label: 'En Progreso' },
    { value: 'completed', label: 'Completado' },
    { value: 'cancelled', label: 'Cancelado' },
  ];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between mb-4">
          <CardTitle className="flex items-center gap-2">
            <Wrench className="h-5 w-5" />
            Registro de Mantenimiento ({filteredLogs.length})
          </CardTitle>
          <AddMaintenanceForm devices={devices} technicians={technicians} onAddMaintenance={onAddMaintenance} />
        </div>
        
        {/* Filtros */}
        <div className="flex flex-col sm:flex-row gap-3 mt-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Buscar por tipo, descripción, dispositivo o técnico..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-full sm:w-[200px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {typeOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-[180px]">
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
        <div className="space-y-3">
          {filteredLogs.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-8">
              {logs.length === 0 
                ? 'No hay registros de mantenimiento' 
                : 'No se encontraron registros con los filtros aplicados'}
            </p>
          ) : (
            filteredLogs.map((log) => (
              <div
                key={log.id}
                className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-medium capitalize">{log.maintenance_type}</h3>
                      <Badge className={getStatusColor(log.status)}>
                        {log.status === 'in_progress' ? 'En Progreso' : log.status}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        ${log.cost?.toLocaleString()}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{log.description}</p>
                    <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-gray-500">
                      {log.devices && (
                        <span>Dispositivo: {log.devices.name}</span>
                      )}
                      {log.users && (
                        <span>Técnico: {log.users.name}</span>
                      )}
                      {log.scheduled_date && (
                        <span>
                          Programado: {new Date(log.scheduled_date).toLocaleDateString('es-ES')}
                        </span>
                      )}
                      {log.completed_date && (
                        <span>
                          Completado: {new Date(log.completed_date).toLocaleDateString('es-ES')}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}