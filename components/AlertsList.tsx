import { useState } from 'react';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { AlertTriangle, CheckCircle, Search, Filter } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './ui/select';
import { AddAlertForm } from './AddAlertForm';

interface Alert {
  id: string;
  alert_type: string;
  severity: string;
  message: string;
  status: string;
  created_at: string;
  devices?: {
    name: string;
    iot_projects?: {
      name: string;
    };
  };
}

interface AlertsListProps {
  alerts: Alert[];
  onResolve: (id: string) => void;
  devices: any[];
  onAddAlert: (alert: any) => void;
}

export function AlertsList({ alerts, onResolve, devices, onAddAlert }: AlertsListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [severityFilter, setSeverityFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'bg-red-600';
      case 'high':
        return 'bg-orange-600';
      case 'medium':
        return 'bg-yellow-600';
      case 'low':
        return 'bg-blue-600';
      default:
        return 'bg-gray-600';
    }
  };

  const filteredAlerts = alerts.filter((alert) => {
    const matchesSearch =
      alert.alert_type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alert.message?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      alert.devices?.name?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesSeverity = severityFilter === 'all' || alert.severity === severityFilter;
    const matchesStatus = statusFilter === 'all' || alert.status === statusFilter;
    
    return matchesSearch && matchesSeverity && matchesStatus;
  });

  const severityOptions = [
    { value: 'all', label: 'Todas las severidades' },
    { value: 'critical', label: 'Crítico' },
    { value: 'high', label: 'Alto' },
    { value: 'medium', label: 'Medio' },
    { value: 'low', label: 'Bajo' },
  ];

  const statusOptions = [
    { value: 'all', label: 'Todos los estados' },
    { value: 'active', label: 'Activo' },
    { value: 'resolved', label: 'Resuelto' },
  ];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between mb-4">
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Alertas del Sistema ({filteredAlerts.length})
          </CardTitle>
          <AddAlertForm devices={devices} onAddAlert={onAddAlert} />
        </div>
        
        {/* Filtros */}
        <div className="flex flex-col sm:flex-row gap-3 mt-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Buscar por tipo, mensaje o dispositivo..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={severityFilter} onValueChange={setSeverityFilter}>
            <SelectTrigger className="w-full sm:w-[200px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {severityOptions.map((option) => (
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
          {filteredAlerts.length === 0 ? (
            <div className="text-center py-12">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-3" />
              <p className="text-sm text-gray-500">
                {alerts.length === 0 
                  ? 'No hay alertas registradas' 
                  : 'No se encontraron alertas con los filtros aplicados'}
              </p>
            </div>
          ) : (
            filteredAlerts.map((alert) => (
              <div
                key={alert.id}
                className="flex items-start gap-3 p-4 border rounded-lg hover:bg-gray-50 transition-colors"
              >
                <AlertTriangle className={`h-5 w-5 mt-0.5 ${
                  alert.severity === 'critical' ? 'text-red-500' :
                  alert.severity === 'high' ? 'text-orange-500' :
                  alert.severity === 'medium' ? 'text-yellow-500' :
                  'text-blue-500'
                }`} />
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-medium">{alert.alert_type}</p>
                    <Badge className={getSeverityColor(alert.severity)}>
                      {alert.severity}
                    </Badge>
                    <Badge variant={alert.status === 'active' ? 'destructive' : 'secondary'}>
                      {alert.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600">{alert.message}</p>
                  <div className="mt-2 flex items-center gap-4 text-xs text-gray-500">
                    {alert.devices && (
                      <>
                        <span>Dispositivo: {alert.devices.name}</span>
                        {alert.devices.iot_projects && (
                          <span>Proyecto: {alert.devices.iot_projects.name}</span>
                        )}
                      </>
                    )}
                    <span>{new Date(alert.created_at).toLocaleString('es-ES')}</span>
                  </div>
                </div>
                {alert.status === 'active' && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => onResolve(alert.id)}
                  >
                    <CheckCircle className="h-4 w-4 mr-1" />
                    Resolver
                  </Button>
                )}
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
}