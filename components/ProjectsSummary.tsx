import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { FolderKanban, Server, Activity, AlertTriangle, Wrench, Search, Filter, RefreshCw } from 'lucide-react';
import { AddProjectForm } from './AddProjectForm';

interface ProjectSummary {
  id: string;
  name: string;
  description: string;
  status: string;
  budget: number;
  start_date: string;
  devices: any[];
  stats: {
    totalDevices: number;
    totalSensors: number;
    onlineDevices: number;
    offlineDevices: number;
    activeAlerts: number;
    maintenanceRecords: number;
    deviceTypes: string[];
  };
}

interface ProjectsSummaryProps {
  projects: ProjectSummary[];
  onAdd?: (project: any) => void;
  onRefresh?: () => void;
  loading?: boolean;
}

export function ProjectsSummary({ projects, onAdd, onRefresh, loading }: ProjectsSummaryProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-600';
      case 'inactive':
        return 'bg-gray-600';
      case 'completed':
        return 'bg-blue-600';
      case 'suspended':
        return 'bg-red-600';
      default:
        return 'bg-gray-500';
    }
  };

  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || project.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const statusOptions = [
    { value: 'all', label: 'Todos los estados' },
    { value: 'active', label: 'Activo' },
    { value: 'inactive', label: 'Inactivo' },
    { value: 'completed', label: 'Completado' },
    { value: 'suspended', label: 'Suspendido' },
  ];

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <FolderKanban className="h-5 w-5" />
            Resumen de Proyectos ({filteredProjects.length})
          </CardTitle>
          <div className="flex items-center gap-2">
            {onRefresh && (
              <Button onClick={onRefresh} disabled={loading} variant="outline" size="sm">
                <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
              </Button>
            )}
            {onAdd && <AddProjectForm onAdd={onAdd} />}
          </div>
        </div>
        
        {/* Filtros */}
        <div className="flex flex-col sm:flex-row gap-3 mt-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Buscar por nombre o descripción..."
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
          {filteredProjects.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-8">
              {projects.length === 0 
                ? 'No hay proyectos disponibles' 
                : 'No se encontraron proyectos con los filtros aplicados'}
            </p>
          ) : (
            filteredProjects.map((project) => (
              <div
                key={project.id}
                className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-lg">{project.name}</h3>
                      <Badge className={getStatusColor(project.status)}>
                        {project.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">{project.description}</p>
                    <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                      <span>Inicio: {new Date(project.start_date).toLocaleDateString('es-ES')}</span>
                      <span>Presupuesto: ${project.budget?.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* Estadísticas del proyecto */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mt-4">
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <Server className="h-4 w-4 text-blue-600" />
                      <p className="text-xs text-blue-900">Dispositivos</p>
                    </div>
                    <p className="text-xl font-bold text-blue-700">
                      {project.stats.totalDevices}
                    </p>
                    <p className="text-xs text-blue-600">
                      {project.stats.onlineDevices} online
                    </p>
                  </div>

                  <div className="bg-purple-50 p-3 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <Activity className="h-4 w-4 text-purple-600" />
                      <p className="text-xs text-purple-900">Sensores</p>
                    </div>
                    <p className="text-xl font-bold text-purple-700">
                      {project.stats.totalSensors}
                    </p>
                  </div>

                  <div className="bg-red-50 p-3 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <AlertTriangle className="h-4 w-4 text-red-600" />
                      <p className="text-xs text-red-900">Alertas</p>
                    </div>
                    <p className="text-xl font-bold text-red-700">
                      {project.stats.activeAlerts}
                    </p>
                  </div>

                  <div className="bg-yellow-50 p-3 rounded-lg">
                    <div className="flex items-center gap-2 mb-1">
                      <Wrench className="h-4 w-4 text-yellow-600" />
                      <p className="text-xs text-yellow-900">Mantenim.</p>
                    </div>
                    <p className="text-xl font-bold text-yellow-700">
                      {project.stats.maintenanceRecords}
                    </p>
                  </div>

                  <div className="bg-gray-50 p-3 rounded-lg col-span-2">
                    <p className="text-xs text-gray-600 mb-1">Tipos de Dispositivos</p>
                    <div className="flex flex-wrap gap-1">
                      {project.stats.deviceTypes.length > 0 ? (
                        project.stats.deviceTypes.map((type, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {type}
                          </Badge>
                        ))
                      ) : (
                        <span className="text-xs text-gray-400">Ninguno</span>
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